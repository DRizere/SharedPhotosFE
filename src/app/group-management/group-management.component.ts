import { Component, OnInit} from '@angular/core';
import { Group } from '../group';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../AlertService/alert.service';
import { AccountService } from '../AccountService/account.service';
import { GroupService } from '../GroupService/group.service';
import { SessionCheckerService } from '../SessionCheckerService/session-checker.service';

@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.css']
})
export class GroupManagementComponent implements OnInit {

  groupForm: FormGroup;
  loading = true;
  submitted = false;

  groupList: Group[];

  constructor(
    private groupService: GroupService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private accountService: AccountService,
    private sessionCheckerService: SessionCheckerService
  ) { }

  ngOnInit(): void {
    this.groupForm = this.formBuilder.group({
      groupName: ['', Validators.required]
    });
    if(localStorage.getItem("currentAccount")==null){
      this.alertService.error("Please log in", true);
      this.router.navigate(["login"]);
      return;
    }
    this.sessionCheckerService.validateSession().subscribe(
      result => {
        if(result!=0){
          this.alertService.error("Session expired. Please login again.", true);
          this.accountService.logout();
          this.router.navigate(["login"]);
          return;
        }
      }
    )
    this.loadGroups();
  }

  loadGroups(){
    this.loading = true;
    this.groupService.readGroups(localStorage.getItem("currentAccount")).subscribe(
      groups => {
        if(groups===null){
          this.alertService.error("Something went wrong.", true);
        } else {
          this.groupList = groups;
          this.loading = false;
        }
      }
    );
  }

  get f() {
    return this.groupForm.controls;
  }

  onSubmit(){
    this.submitted = true;
    this.alertService.clear();

    if(this.groupForm.invalid){
      return;
    }

    this.loading = true;
    this.accountService.checkAccountExistance(this.f.groupName.value)
      .subscribe(existance => {
        if(existance === 1){
          this.alertService.error("You already manage a group with that name.");
        } else {
          this.groupService.createGroup(localStorage.getItem("currentAccount"),this.f.groupName.value)
            .subscribe(response => {
              if(response==0){
                this.alertService.success("Group was created");
                //refresh album list after creation
                this.groupService.readGroups(localStorage.getItem("currentAccount")).subscribe(
                  groups => {
                    this.groupList = groups;
                    this.loading = false;
                  });
              } else {
                this.alertService.error("Group was not created");
                this.loadGroups();
              }
            })
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  deleteGroup(groupName: string){
    //TODO
    this.loading = true;
    this.groupService.deleteGroup(groupName, localStorage.getItem("currentAccount")).subscribe(
      result => {
        if(result != 0){
          this.alertService.error("Group was not deleted");
        } else {
          this.alertService.success("Group was deleted");
          //refresh album list after deletion
          this.loadGroups();
        }
      }
    );
  }

  drilldown(groupName: string){
    localStorage.setItem("currentManagingGroup", groupName);
    this.router.navigate(["group-management/selected"]);
  }

}
