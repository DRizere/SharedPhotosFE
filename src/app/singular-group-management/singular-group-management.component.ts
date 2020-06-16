import { Component, OnInit} from '@angular/core';
import { GroupMember } from '../group-member';
import { AlbumService } from '../AlbumService/album.service';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../AlertService/alert.service';
import { GroupMemberService } from '../GroupMemberService/group-member.service';
import { AccountService } from '../AccountService/account.service';
import { SessionCheckerService } from '../SessionCheckerService/session-checker.service';

@Component({
  selector: 'app-singular-group-management',
  templateUrl: './singular-group-management.component.html',
  styleUrls: ['./singular-group-management.component.css']
})
export class SingularGroupManagementComponent implements OnInit {
  groupmemberForm: FormGroup;
  loading = false;
  submitted = false;
  activeGroupmemberList: GroupMember[] = [];
  pendingGroupmemberList: GroupMember[] = [];

  constructor(
    private groupMemberService: GroupMemberService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private accountService: AccountService,
    private sessionCheckerService: SessionCheckerService
    ) { }

  get f() {
    return this.groupmemberForm.controls;
  }

  ngOnInit(): void { 
    this.groupmemberForm = this.formBuilder.group({
      accountName: ['', Validators.required],
    });
    if(localStorage.getItem("currentManagingGroup")==null){
      this.alertService.error("Please select a group");
      this.router.navigate(["group-management"]); 
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
    document.getElementById("currentGroupHeader").innerHTML ="Selected Group: " + localStorage.getItem("currentManagingGroup");


    this.loading = true;
    this.groupMemberService.readGroupMembersByGroup(localStorage.getItem("currentManagingGroup")).subscribe(
      groupMembers => {
        this.activeGroupmemberList=[];
        this.pendingGroupmemberList=[];
        if(groupMembers != null){
          groupMembers.forEach(element => {
            if(element.membershipStatus == 1){
              this.activeGroupmemberList.push(element);
            } else {
              this.pendingGroupmemberList.push(element);
            }
          });
        }
        this.loading = false; 
      }
    );
  }

  onSubmit(){
    //call to pictureService
    this.submitted = true;
    this.alertService.clear();

    if(this.groupmemberForm.invalid){
      return;
    }

    this.loading = true;
    this.groupMemberService.createGroupMember(this.f.accountName.value, localStorage.getItem("currentManagingGroup"))
      .subscribe(data => {
        if(data != 0){
          this.loading=false;
          this.alertService.error("That account doesn't exist or is already a member of this group.");
        } else {
          this.groupMemberService.readGroupMembersByGroup(localStorage.getItem("currentManagingGroup")).subscribe(
            groupMembers => {
              this.activeGroupmemberList=[];
              this.pendingGroupmemberList=[];
              groupMembers.forEach(element => {
                if(element.membershipStatus === 1){
                  this.activeGroupmemberList.push(element);
                } else {
                  this.pendingGroupmemberList.push(element);
                }
              });
              this.loading = false;
            }
          );
          this.alertService.success("Invitation sent");
          //window.location.reload();
          this.submitted = false;
          this.groupmemberForm.reset();
        }
      },
      error => {
        this.alertService.error(error);
        console.error(error);
      })
  }

  remove(accountName: string){
    if(accountName === localStorage.getItem("currentAccount")){
      this.alertService.error("You cannot remove yourself from a group you are the owner of.");
      return;
    }

    this.loading=true;
    this.groupMemberService.deleteGroupMember(localStorage.getItem("currentManagingGroup"), accountName).subscribe(
      result => {
        if(result != 0){
          this.alertService.error("Groupmember was not removed");
          this.loading=false;
        } else {
          this.alertService.success("Groupmember was removed");
          //refresh picture list after deletion
          this.groupMemberService.readGroupMembersByGroup(localStorage.getItem("currentManagingGroup")).subscribe(
            groupMembers => {
              this.activeGroupmemberList=[];
              this.pendingGroupmemberList=[];
              groupMembers.forEach(element => {
                if(element.membershipStatus === 1){
                  this.activeGroupmemberList.push(element);
                } else {
                  this.pendingGroupmemberList.push(element);
                }
              });
              this.loading = false; 
            }
          );
        }
      }
    );
  }

}
