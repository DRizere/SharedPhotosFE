import { Component, OnInit} from '@angular/core';
import { Album } from '../album';
import { AlbumService } from '../AlbumService/album.service';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../AlertService/alert.service';
import { AccountService } from '../AccountService/account.service';
import { SessionCheckerService } from '../SessionCheckerService/session-checker.service';

@Component({
  selector: 'app-public-album-page',
  templateUrl: './public-album-page.component.html',
  styleUrls: ['./public-album-page.component.css']
})
export class PublicAlbumPageComponent implements OnInit {
  albumForm: FormGroup;
  loading = true;
  submitted = false;

  albumList: Album[];

  constructor(
    private albumService: AlbumService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.albumForm = this.formBuilder.group({
      albumName: ['', Validators.required]
    });
    this.loadAlbums();
  }

  loadAlbums(){
    this.loading = true;
    this.albumService.fetchPublicAlbums().subscribe(
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
    this.albumService.checkPublicAlbumExistance(this.f.albumName.value)
      .subscribe(existance => {
        if(existance === 1){
          this.alertService.error("An album with that name already exists.");
        } else {
          this.albumService.createPublicAlbum(this.f.albumName.value)
            .subscribe(response => {
              if(response===0){
                this.alertService.success("Album was created");
                //refresh album list after creation
                this.albumService.fetchPublicAlbums().subscribe(
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

  deleteAlbum(albumName: string, accountName: string){
    if(accountName === localStorage.getItem("currentAccount")){
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
    } else if(accountName === "GuestUser"){
      this.loading = true;
      this.albumService.deletePublicAlbum(albumName).subscribe(
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
    } else {
      this.alertService.error("You do not have sufficient permissions to delete this album."); 
    }
  }

  drilldown(albumName: string, accountName: string){
    localStorage.setItem("currentPublicAlbum", albumName);
    localStorage.setItem("currentPublicAlbumAccount", accountName);
    this.router.navigate(["public/albums/selected"]);
  }

}
