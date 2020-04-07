import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../AccountService/account.service';
import { AlertService } from '../AlertService/alert.service';

@Component({
  selector: 'app-create-account-page',
  templateUrl: './create-account-page.component.html',
  styleUrls: ['./create-account-page.component.css']
})
export class CreateAccountPageComponent implements OnInit {

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
      password: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required]
    });

    if(localStorage.getItem("accountName") != null){
      this.alertService.success("You are still logged in");
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

    this.accountService.checkAccountExistance(this.f.username.value)
      .subscribe(existance => {
        if(existance === 1){
          this.alertService.error("An account with that username already exists.");
        } else {
          this.accountService.createAccount(this.f.username.value, this.f.name.value, this.f.email.value, this.f.password.value)
            .subscribe(account => {
              this.accountService.login(this.f.username.value, this.f.password.value)
                .subscribe(loginRes => {
                  if(loginRes == null){
                    this.loading=false;
                    this.alertService.error("Account creation failed.");
                  } else {
                    //handle successful login here
                    this.loading=false;
                    this.router.navigate(["albums"]);
                  }
                })
            },
            error => {
              console.error(error);
            });
        }
      });
  }

}
