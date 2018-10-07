import { Component, OnInit } from '@angular/core';
import { CredentialService } from '../credential.service'
import { Credential } from '../credential.model'
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-credential-list',
  templateUrl: './credential-list.component.html',
  styleUrls: ['./credential-list.component.css']
})
export class CredentialListComponent implements OnInit {

  credentials: Credential[]

  constructor(private credentialService: CredentialService) { }

  ngOnInit() {
    this.credentialService.getAllCredentials()
      .subscribe((credentials: Array<Credential>) => this.credentials = credentials);
  }

}