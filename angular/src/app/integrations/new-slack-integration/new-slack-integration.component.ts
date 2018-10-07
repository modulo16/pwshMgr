import { Component, OnInit } from '@angular/core';
import { IntegrationService } from '../integration.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SlackIntegration } from '../integration.model';

@Component({
  selector: 'app-new-slack-integration',
  templateUrl: './new-slack-integration.component.html',
  styleUrls: ['./new-slack-integration.component.css']
})
export class NewSlackIntegrationComponent implements OnInit {

  newSlackIntegrationForm: FormGroup

  constructor(private integrationService: IntegrationService,
  private formBuilder: FormBuilder,
  private router: Router) { 
    this.newSlackIntegrationForm = this.formBuilder.group({
      'name': ['', [Validators.required]],
      'webHook': ['', [Validators.required]]
    })
  }

  ngOnInit() {
  }
  submitForm(newSlackIntegration: SlackIntegration) {
    this.integrationService.postIntegration(newSlackIntegration)
      .subscribe(newSlackIntegration => {
        this.router.navigate(['integrations/' + newSlackIntegration._id])
      });
  }
}
