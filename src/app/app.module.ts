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

@NgModule({
  declarations: [
    AppComponent,
    CreateAccountPageComponent,
    LoginPageComponent,
    AlertComponent,
    AlbumPageComponent,
    SingularAlbumPageComponent,
    GroupManagementComponent,
    GroupViewerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
