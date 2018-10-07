import { Component, OnInit } from '@angular/core';
import { CredentialService } from '../credential.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Credential } from '../credential.model';

@Component({
  selector: 'app-new-credential',
  templateUrl: './new-credential.component.html',
  styleUrls: ['./new-credential.component.css']
})
export class NewCredentialComponent implements OnInit {

  newCredentialForm: FormGroup;

  constructor(private credentialSerice: CredentialService,
    private formBuilder: FormBuilder,
    private router: Router) {
    this.newCredentialForm = this.formBuilder.group({
      'username': ['', [Validators.required]],
      'password': ['', [Validators.required]],
      'credentialName': ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  submitForm(newCredential: Credential) {
    this.credentialSerice.postCredential(newCredential)
      .subscribe(newCredential => {
        this.router.navigate(['credentials/' + newCredential._id])
      });
  }

}