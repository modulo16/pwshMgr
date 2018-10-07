import { Component, OnInit } from '@angular/core';
import { CredentialService } from '../credential.service';
import { Credential } from '../credential.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-credential-details',
  templateUrl: './credential-details.component.html',
  styleUrls: ['./credential-details.component.css']
})
export class CredentialDetailsComponent implements OnInit {

  credential: Credential
  id: string

  constructor(private credentialService: CredentialService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.credentialService.getCredentialById(this.id)
    .subscribe(credential => {
      this.credential = credential
    });

  }

  deleteCredential() {
    this.credentialService.deleteCredential(this.credential._id)
      .subscribe()
      this.router.navigate(['credentials'])
  }

}