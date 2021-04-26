import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginError = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }
onLogin(form : NgForm){
  const email = form.value.email;
  const password = form.value.password;
  this.authService.login(email, password).subscribe(responseData =>{
    this.router.navigate(['/dashboard']);
  }, loginError =>{
    this.loginError = loginError.error.error.message;
  });
  form.reset();
}
}
