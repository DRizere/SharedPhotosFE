import { Component, OnInit} from '@angular/core';
import { Album } from '../album';
import { AlbumService } from '../AlbumService/album.service';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../AlertService/alert.service';
import { AccountService } from '../AccountService/account.service';
import { SessionCheckerService } from '../SessionCheckerService/session-checker.service';

@Component({
  selector: 'app-album-page',
  templateUrl: './album-page.component.html',
  styleUrls: ['./album-page.component.css']
})
export class AlbumPageComponent implements OnInit {
  albumForm: FormGroup;
  loading = true;
  submitted = false;

  albumList: Album[];

  constructor(
    private albumService: AlbumService,
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
    }
    this.sessionCheckerService.validateSession().subscribe(
      result => {
        if(result!=0){
          this.alertService.error("Session expired. Please login again.", true);
          this.accountService.logout();
          this.router.navigate(["login"]);
        }
      }
    )
    this.albumForm = this.formBuilder.group({
      albumName: ['', Validators.required]
    });
    this.loadAlbums();
  }

  loadAlbums(){
    this.loading = true;
    this.albumService.fetchAlbums().subscribe(
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

  onSubmit(){
    this.submitted = true;
    this.alertService.clear();

    if(this.albumForm.invalid){
      return;
    }

    this.loading = true;
    this.albumService.checkAlbumExistance(this.f.albumName.value)
      .subscribe(existance => {
        if(existance === 1){
          this.alertService.error("An album with that name already exists.");
        } else {
          this.albumService.createAlbum(this.f.albumName.value)
            .subscribe(response => {
              if(response===0){
                this.alertService.success("Album was created");
                this.albumForm.reset();
                //refresh album list after creation
                this.albumService.fetchAlbums().subscribe(
                  albums => {
                    this.albumList = albums;
                    this.loading = false;
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
    this.albumService.deleteAlbum(albumName).subscribe(
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

  drilldown(albumName: string){
    localStorage.setItem("currentAlbum", albumName);
    this.router.navigate(["albums/selected"]);
  }

}
