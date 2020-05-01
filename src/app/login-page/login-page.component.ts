import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../AccountService/account.service';
import { AlertService } from '../AlertService/alert.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) { }

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.loggedInCheck();
  }

  loggedInCheck(){
    if(localStorage.getItem("currentAccount") != null && localStorage.getItem("SPDKSessionKey")!=null){
      this.alertService.success("You are still logged in", true);
      this.router.navigate(["albums"]);
    };
  }

  onSubmit(){
    this.submitted = true;

    this.alertService.clear();

    if(this.loginForm.invalid){
      return;
    }

    this.loading = true;

    this.accountService.login(this.f.username.value, this.f.password.value)
      .subscribe(data => {
        if(!data){
          this.loading=false;
          this.alertService.error("Login failed. Maybe your account doesn't exist or you entered the wrong password.");
        } else {
          //handle successful login here
          this.router.navigate(["albums"]);
        }
      },
      error => {
        this.alertService.error(error);
        console.error(error);
      })
  }

  onLoginSuccess(){

  }

}
