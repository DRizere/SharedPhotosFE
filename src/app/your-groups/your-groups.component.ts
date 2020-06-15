import { Component, OnInit} from '@angular/core';
import { Album } from '../album';
import { AlbumService } from '../AlbumService/album.service';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../AlertService/alert.service';
import { AccountService } from '../AccountService/account.service';
import { SessionCheckerService } from '../SessionCheckerService/session-checker.service';
import { GroupService } from '../GroupService/group.service';
import { GroupMemberService } from '../GroupMemberService/group-member.service';
import { GroupMember } from '../group-member';

@Component({
  selector: 'app-your-groups',
  templateUrl: './your-groups.component.html',
  styleUrls: ['./your-groups.component.css']
})
export class YourGroupsComponent implements OnInit {

  albumForm: FormGroup;
  loading = true;
  submitted = false;

  activeGroupmemberList : GroupMember[] = [];
  pendingGroupmemberList : GroupMember[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private accountService: AccountService,
    private groupService: GroupService,
    private groupMemberService: GroupMemberService,
    private sessionCheckerService: SessionCheckerService
  ) { }

  ngOnInit(): void {
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
    this.albumForm = this.formBuilder.group({
      albumName: ['', Validators.required]
    });
    this.loadGroups();
  }

  loadGroups(){
    this.loading = true;
    this.groupMemberService.readGroupMembersByMember(localStorage.getItem("currentAccount")).subscribe(
      groupmembers => {
        if(groupmembers===null){
          this.alertService.error("Something went wrong.", true);
        } else {
          this.activeGroupmemberList=[];
          this.pendingGroupmemberList=[];
          groupmembers.forEach(element => {
            if(element.membershipStatus === 1){
              this.activeGroupmemberList.push(element);
            } else {
              this.pendingGroupmemberList.push(element);
            }
          });
          this.loading = false;
        }
      }
    );
  }

  get f() {
    return this.albumForm.controls;
  }

  joinGroup(groupName: string){
    this.loading = true;
    this.groupMemberService.updateGroupMember(groupName, localStorage.getItem("currentAccount"), 1).subscribe(
      result => {
        if(result != 0){
          this.alertService.error("Could not join group");
        } else {
          this.alertService.success("Joining group successful");
          //refresh group list after deletion
          this.loadGroups();
        }
      }
    );
  }

  leaveGroup(groupName: string){
    this.loading = true;
    this.groupService.readGroups(localStorage.getItem("currentAccount")).subscribe(
      yourGroups => {
        yourGroups.forEach(element => {
          if(element.groupName === groupName){
            this.alertService.error("You cannot leave a group that you are the owner of.");
            this.loading = false;
            return;
          }
          this.groupMemberService.deleteGroupMember(groupName, localStorage.getItem("currentAccount")).subscribe(
            result => {
              if(result != 0){
                this.alertService.error("Could not leave group");
              } else {
                this.alertService.success("Leaving group successful");
                //refresh group list after deletion
                this.loadGroups();
              }
            }
          );
        })
      }
    )
  }

  declineGroup(groupName: string){
    this.loading = true;
    this.groupMemberService.deleteGroupMember(groupName, localStorage.getItem("currentAccount")).subscribe(
      result => {
        if(result != 0){
          this.alertService.error("Could not decline invitation");
        } else {
          this.alertService.success("Invitation declined");
          //refresh group list after deletion
          this.loadGroups();
        }
      }
    );
  }

  drilldown(groupName: string){
    localStorage.setItem("currentMemberGroup", groupName);
    this.router.navigate(["groups/selected"]);
  }
}
