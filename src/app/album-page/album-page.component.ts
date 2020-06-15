import { Component, OnInit} from '@angular/core';
import { Album } from '../album';
import { AlbumService } from '../AlbumService/album.service';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../AlertService/alert.service';
import { AccountService } from '../AccountService/account.service';
import { SessionCheckerService } from '../SessionCheckerService/session-checker.service';
import { GroupAlbumService } from '../GroupAlbumService/group-album.service';
import { GroupAlbum } from '../group-album';
import { Group } from '../group';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GroupMemberService } from '../GroupMemberService/group-member.service';
import { GroupMember } from '../group-member';

@Component({
  selector: 'app-album-page',
  templateUrl: './album-page.component.html',
  styleUrls: ['./album-page.component.css']
})
export class AlbumPageComponent implements OnInit {
  albumForm: FormGroup;
  modalLoading = true;
  loading = true;
  submitted = false;

  currentModalAlbum: string;

  albumList: Album[];

  groupList: GroupMember[];

  selectedAlbumAllowedGroups: GroupAlbum[];
  selectedAlbumDeniedGroups: GroupMember[];

  closeResult = '';

  constructor(
    private albumService: AlbumService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private accountService: AccountService,
    private sessionCheckerService: SessionCheckerService,
    private groupAlbumService: GroupAlbumService,
    private groupMemberService: GroupMemberService,
    private modalService: NgbModal
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
    this.loadAlbums();
    this.loadGroups();
  }

  loadAlbums(){
    this.loading = true;
    this.albumService.fetchAlbums(localStorage.getItem("currentAccount")).subscribe(
      albums => {
        if(albums===null){
          this.alertService.error("Something went wrong.", true);
        } else {
          this.albumList = albums;
          this.loading = false;
        }
      }
    );
  }

  loadGroups(){
    this.loading = true;
    this.groupMemberService.readGroupMembersByMember(localStorage.getItem("currentAccount")).subscribe(
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
    return this.albumForm.controls;
  }

  onSubmit(){
    this.submitted = true;
    this.alertService.clear();

    if(this.albumForm.invalid){
      return;
    }

    this.loading = true;
    this.albumService.checkAlbumExistance(this.f.albumName.value, localStorage.getItem("currentAccount"))
      .subscribe(existance => {
        if(existance === 1){
          this.alertService.error("An album with that name already exists.");
        } else {
          this.albumService.createAlbum(this.f.albumName.value, localStorage.getItem("currentAccount"))
            .subscribe(response => {
              if(response===0){
                this.alertService.success("Album was created");
                //refresh album list after creation
                this.albumService.fetchAlbums(localStorage.getItem("currentAccount")).subscribe(
                  albums => {
                    this.albumList = albums;
                    this.loading = false;
                    this.submitted = false;
                    this.albumForm.reset();
                  });
              } else {
                this.alertService.error("Album was not created");
                this.loadAlbums();
              }
            })
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  deleteAlbum(albumName: string){
    this.loading = true;
    this.albumService.deleteAlbum(albumName, localStorage.getItem("currentAccount")).subscribe(
      result => {
        if(result != 0){
          this.alertService.error("Album was not deleted");
        } else {
          this.alertService.success("Album was deleted");
          //refresh album list after deletion
          this.loadAlbums();
        }
      }
    );
  }

  makePublicAlbum(albumName: string){
    this.loading = true;
    this.albumService.makePublic(albumName, localStorage.getItem("currentAccount")).subscribe(
      result => {
        if(result != 0){
          this.alertService.error("Album was not not made public");
        } else {
          this.alertService.success("Album was made public");
          //refresh album list after deletion
          this.loadAlbums();
        }
      }
    );
  }

  makePrivateAlbum(albumName: string){
    this.loading = true;
    this.albumService.makePrivate(albumName, localStorage.getItem("currentAccount")).subscribe(
      result => {
        if(result != 0){
          this.alertService.error("Album was not not made private");
        } else {
          this.alertService.success("Album was made private");
          //refresh album list after deletion
          this.loadAlbums();
        }
      }
    );
  }

  drilldown(albumName: string){
    localStorage.setItem("currentAlbum", albumName);
    this.router.navigate(["albums/selected"]);
  }



  open(content, albumName: string){
    console.log("hello");
    this.currentModalAlbum = albumName;
    this.updateModal();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  updateModal(){
    this.modalLoading = true;
    this.groupAlbumService.readGroupAlbumsByAlbum(this.currentModalAlbum).subscribe(
      result => {
        this.selectedAlbumAllowedGroups = result;
        this.selectedAlbumDeniedGroups = this.groupList.map(x => Object.assign({}, x));;
        this.selectedAlbumAllowedGroups.forEach(current => {
          var tmp = this.searchGroupListForGroupName(this.selectedAlbumDeniedGroups, current.groupName);
          console.log(tmp);
          if(tmp > -1){
            this.selectedAlbumDeniedGroups.splice(tmp, 1);
          }
        });
        this.modalLoading = false;
      }
    )
  }

  searchGroupListForGroupName(groupList: GroupMember[], groupName: String){
    for(var _i = 0; _i < groupList.length; _i++){
      if(groupList[_i].groupName === groupName){
        return _i;
      }
    }
    return -1;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  revokeShare(groupName: string){
    this.groupAlbumService.deleteGroupAlbum(groupName, this.currentModalAlbum).subscribe(
      result => {
        if(result == 0){    
          this.updateModal();
        } else {
          this.alertService.error("Revoking share was unsuccessful.")
          //close the modal
        }
      }
    )
  }

  allowShare(groupName: string){
    this.groupAlbumService.createGroupAlbum(groupName, this.currentModalAlbum, localStorage.getItem("currentAccount")).subscribe(
      result => {
        if(result == 0){    
          this.updateModal();
        } else {
          this.alertService.error("Allowing share was unsuccessful.")
          //close the modal
        }
      }
    )
  }

}
