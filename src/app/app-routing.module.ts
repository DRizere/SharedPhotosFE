import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateAccountPageComponent } from './create-account-page/create-account-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AlbumPageComponent } from './album-page/album-page.component';
import { GroupManagementComponent } from './group-management/group-management.component';
import { SingularGroupManagementComponent } from './singular-group-management/singular-group-management.component';
import { SingularAlbumPageComponent } from './singular-album-page/singular-album-page.component';
import { YourGroupsComponent } from './your-groups/your-groups.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: CreateAccountPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'albums', component: AlbumPageComponent },
  { path: 'albums/selected', component: SingularAlbumPageComponent },
  { path: 'group-management', component: GroupManagementComponent },
  { path: 'group-management/selected', component: SingularGroupManagementComponent },
  { path: 'groups', component: YourGroupsComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
