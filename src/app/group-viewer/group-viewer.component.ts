import { Component, OnInit} from '@angular/core';
import { Album } from '../album';
import { AlbumService } from '../AlbumService/album.service';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../AlertService/alert.service';
import { AccountService } from '../AccountService/account.service';
import { SessionCheckerService } from '../SessionCheckerService/session-checker.service';
import { GroupAlbumService } from '../GroupAlbumService/group-album.service';

@Component({
  selector: 'app-group-viewer',
  templateUrl: './group-viewer.component.html',
  styleUrls: ['./group-viewer.component.css']
})
export class GroupViewerComponent implements OnInit {
  albumForm: FormGroup;
  loading = true;
  submitted = false;

  albumList: Album[];

  constructor(
    private albumService: AlbumService,
    private groupAlbumService: GroupAlbumService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private accountService: AccountService,
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
    document.getElementById("currentMemberGroupHeader").innerHTML ="Current Group: " + localStorage.getItem("currentMemberGroup");
    this.albumForm = this.formBuilder.group({
      albumName: ['', Validators.required]
    });
    this.loadAlbums();
  }

  loadAlbums(){
    this.loading = true;
    this.groupAlbumService.readGroupAlbumsByGroup(localStorage.getItem("currentMemberGroup")).subscribe(
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

  get f() {
    return this.albumForm.controls;
  }

  drilldown(albumName: string){
    localStorage.setItem("currentGroupAlbum", albumName);
    this.router.navigate(["groups/selected/album"]);
  }

}
