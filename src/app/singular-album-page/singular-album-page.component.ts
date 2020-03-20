import { Component, OnInit} from '@angular/core';
import { Picture } from '../picture';
import { AlbumService } from '../AlbumService/album.service';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../AlertService/alert.service';
import { PictureService } from '../PictureService/picture.service';

@Component({
  selector: 'app-singular-album-page',
  templateUrl: './singular-album-page.component.html',
  styleUrls: ['./singular-album-page.component.css']
})
export class SingularAlbumPageComponent implements OnInit {
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
    private alertService: AlertService
    ) { }

  get f() {
    return this.pictureForm.controls;
  }

  ngOnInit(): void { 
    if(localStorage.getItem("currentAlbum")==null){
      this.alertService.error("Please select an album");
      this.router.navigate(["albums"]);
    }
    this.pictureForm = this.formBuilder.group({
      pictureName: ['', Validators.required]
    });

    this.pictureService.getPicturesOfAlbum(localStorage.getItem("currentAlbum")).subscribe(
      pictures => {
        this.pictureList = pictures;
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
    //call to pictureService
    this.loading = true;
    this.pictureService.pushPictureToAlbum(this.f.pictureName.value,this.fileToUpload.base64Encoding,this.fileToUpload.pictureExtension)
      .subscribe(data => {
        if(data != 0){
          this.loading=false;
          this.alertService.error("Account does not exist, please try again or register a new account.");
        } else {
          //handle successful login here
          this.loading=false;
          this.alertService.success("Picture uploaded");
          window.location.reload();
        }
      },
      error => {
        this.alertService.error(error);
        console.error(error);
      })
  }

  deletePicture(pictureName: string){
    this.pictureService.deletePictureFromAlbum(pictureName).subscribe(
      result => {
        if(result != 0){
          this.alertService.error("Picture was not deleted");
        } else {
          this.alertService.success("Picture was deleted");
          //refresh picture list after deletion
          this.pictureService.getPicturesOfAlbum(localStorage.getItem("currentAlbum")).subscribe(
            pictures => {
              this.pictureList = pictures;
            }
          );
        }
      }
    );
  }

}
