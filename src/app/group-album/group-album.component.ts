import { Component, OnInit} from '@angular/core';
import { Picture } from '../picture';
import { AlbumService } from '../AlbumService/album.service';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../AlertService/alert.service';
import { PictureService } from '../PictureService/picture.service';
import { AccountService } from '../AccountService/account.service';
import { SessionCheckerService } from '../SessionCheckerService/session-checker.service';

@Component({
  selector: 'app-group-album',
  templateUrl: './group-album.component.html',
  styleUrls: ['./group-album.component.css']
})
export class GroupAlbumComponent implements OnInit {
  pictureForm: FormGroup;
  loading = false;
  submitted = false;

  pictureList: Picture[];
  fileSelected = false;
  fileToUpload: Picture;

  constructor(
    private pictureService: PictureService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private accountService: AccountService,
    private sessionCheckerService: SessionCheckerService
    ) { }

  get f() {
    return this.pictureForm.controls;
  }

  ngOnInit(): void { 
    this.pictureForm = this.formBuilder.group({
      pictureName: ['', Validators.required],
      pictureUp: ['', Validators.required]
    });
    if(localStorage.getItem("currentGroupAlbum")==null){
      this.alertService.error("Please select an album");
      this.router.navigate(["albums"]);
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
    document.getElementById("currentAlbumHeader").innerHTML ="Current Album: " + localStorage.getItem("currentGroupAlbum");


    this.loading = true;
    this.pictureService.getPicturesOfAlbum(localStorage.getItem("currentGroupAlbumAccount"), localStorage.getItem("currentGroupAlbum")).subscribe(
      pictures => {
        this.pictureList = pictures;
        this.loading = false;
      }
    );

    this.fileToUpload = {
      pictureName: "",
      pictureExtension: "",
      base64Encoding: ""
    };
  }

  onSelectFile(event){
    var files = event.target.files;
    var file = files[0];

    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(file);
    this.fileToUpload.pictureExtension = file.type;
  }

  _handleReaderLoaded(readerEvent){
    var binaryString = readerEvent.target.result;
    this.fileToUpload.base64Encoding=btoa(binaryString);
  }

  onSubmit(){
    if(localStorage.getItem("currentAccount")!==localStorage.getItem("currentGroupAlbumAccount")){
      this.alertService.error("You do not have permission to add pictures to this album.");
      window.scroll(0,0);
      return;
    }
    this.submitted = true;
    this.alertService.clear();

    if(this.pictureForm.invalid){
      return;
    }

    this.loading = true;
    this.pictureService.pushPublicPictureToAlbum(localStorage.getItem("currentAccount"), localStorage.getItem("currentGroupAlbum"), this.f.pictureName.value,this.fileToUpload.base64Encoding,this.fileToUpload.pictureExtension)
      .subscribe(data => {
        if(data != 0){
          this.loading=false;
          this.alertService.error("Account does not exist, please try again or register a new account.");
        } else {
          //handle successful login here
          this.pictureService.getPublicPicturesOfAlbum(localStorage.getItem("currentGroupAlbumAccount"), localStorage.getItem("currentGroupAlbum")).subscribe(
            pictures => {
              this.pictureList = pictures;
              this.loading = false;
            }
          );
          this.alertService.success("Picture uploaded");
          //window.location.reload();
          this.submitted = false;
          this.pictureForm.reset();
        }
      },
      error => {
        this.alertService.error(error);
        console.error(error);
      })
  }

  deletePicture(pictureName: string){
    if(localStorage.getItem("currentAccount")!==localStorage.getItem("currentPublicAlbumAccount")){
      this.alertService.error("You do not have permission to delete pictures from this album.");
      window.scroll(0,0);
      return;
    }
    this.loading=true;
    this.pictureService.deletePublicPictureFromAlbum(localStorage.getItem("currentAccount"), localStorage.getItem("currentGroupAlbum"), pictureName).subscribe(
      result => {
        if(result != 0){
          this.alertService.error("Picture was not deleted");
          this.loading=false;
        } else {
          this.alertService.success("Picture was deleted");
          //refresh picture list after deletion
          this.pictureService.getPublicPicturesOfAlbum(localStorage.getItem("currentGroupAlbumAccount"), localStorage.getItem("currentGroupAlbum")).subscribe(
            pictures => {
              this.pictureList = pictures;
              this.loading=false;
            }
          );
        }
      }
    );
  }

}
