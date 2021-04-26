import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  errorMsg = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }
  onSignup(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.authService.signup(email, password).subscribe(responseData => {
      this.router.navigate(['/dashboard']);
    }, error => {
      this.errorMsg = error.error.error.message;
      console.log(error);
    });
    form.reset();
  }
}
