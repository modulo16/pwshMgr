import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../user.model';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  newUserForm: FormGroup;

  constructor(private userSerice: UserService,
    private formBuilder: FormBuilder,
    private router: Router) {
    this.newUserForm = this.formBuilder.group({
      'name': ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  submitForm(newUser: User) {
    this.userSerice.postUser(newUser)
      .subscribe(newUser => {
        this.router.navigate(['users/'])
      });
  }

}