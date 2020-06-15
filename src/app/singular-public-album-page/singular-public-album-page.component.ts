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
  selector: 'app-singular-public-album-page',
  templateUrl: './singular-public-album-page.component.html',
  styleUrls: ['./singular-public-album-page.component.css']
})
export class SingularPublicAlbumPageComponent implements OnInit {

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
    if(localStorage.getItem("currentPublicAlbum")==null || localStorage.getItem("currentPublicAlbumAccount")==null){
      this.alertService.error("Please select an album");
      this.router.navigate(["public/albums"]);
      return;
    }
    document.getElementById("currentAlbumHeader").innerHTML ="Current Album: " + localStorage.getItem("currentPublicAlbum");
    this.pictureForm = this.formBuilder.group({
      pictureName: ['', Validators.required],
      pictureUp: ['', Validators.required]
    });

    this.loading = true;
    this.pictureService.getPublicPicturesOfAlbum(localStorage.getItem("currentPublicAlbumAccount"), localStorage.getItem("currentPublicAlbum")).subscribe(
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
    if(localStorage.getItem("currentPublicAlbumAccount")!=="GuestAccount" && localStorage.getItem("currentAccount")!==localStorage.getItem("currentPublicAlbumAccount")){
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
    this.pictureService.pushPublicPictureToAlbum(localStorage.getItem("currentAccount"), localStorage.getItem("currentPublicAlbum"), this.f.pictureName.value,this.fileToUpload.base64Encoding,this.fileToUpload.pictureExtension)
      .subscribe(data => {
        if(data != 0){
          this.loading=false;
          this.alertService.error("Account does not exist, please try again or register a new account.");
        } else {
          //handle successful login here
          this.pictureService.getPublicPicturesOfAlbum(localStorage.getItem("currentPublicAlbumAccount"), localStorage.getItem("currentPublicAlbum")).subscribe(
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
    if(localStorage.getItem("currentPublicAlbumAccount")!=="GuestAccount" && localStorage.getItem("currentAccount")!==localStorage.getItem("currentPublicAlbumAccount")){
      this.alertService.error("You do not have permission to delete pictures from this album.");
      window.scroll(0,0);
      return;
    }
    this.loading=true;
    this.pictureService.deletePublicPictureFromAlbum(localStorage.getItem("currentAccount"), localStorage.getItem("currentPublicAlbum"), pictureName).subscribe(
      result => {
        if(result != 0){
          this.alertService.error("Picture was not deleted");
          this.loading=false;
        } else {
          this.alertService.success("Picture was deleted");
          //refresh picture list after deletion
          this.pictureService.getPublicPicturesOfAlbum(localStorage.getItem("currentPublicAlbumAccount"), localStorage.getItem("currentPublicAlbum")).subscribe(
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
