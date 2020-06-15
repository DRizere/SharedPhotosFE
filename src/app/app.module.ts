import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateAccountPageComponent } from './create-account-page/create-account-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AlertComponent } from './alert/alert.component';
import { AlbumPageComponent } from './album-page/album-page.component';
import { SingularAlbumPageComponent } from './singular-album-page/singular-album-page.component';
import { GroupManagementComponent } from './group-management/group-management.component';
import { GroupViewerComponent } from './group-viewer/group-viewer.component';
import { YourGroupsComponent } from './your-groups/your-groups.component';
import { SingularGroupManagementComponent } from './singular-group-management/singular-group-management.component';
import { GroupAlbumComponent } from './group-album/group-album.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { PublicAlbumPageComponent } from './public-album-page/public-album-page.component';
import { SingularPublicAlbumPageComponent } from './singular-public-album-page/singular-public-album-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    CreateAccountPageComponent,
    LoginPageComponent,
    AlertComponent,
    AlbumPageComponent,
    SingularAlbumPageComponent,
    GroupManagementComponent,
    GroupViewerComponent,
    YourGroupsComponent,
    SingularGroupManagementComponent,
    GroupAlbumComponent,
    AboutPageComponent,
    PublicAlbumPageComponent,
    SingularPublicAlbumPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
