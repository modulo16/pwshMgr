import { Component, OnInit } from '@angular/core';
import { IntegrationService } from '../integration.service';
import { SlackIntegration } from '../integration.model';

@Component({
  selector: 'app-integration-list',
  templateUrl: './integration-list.component.html',
  styleUrls: ['./integration-list.component.css']
})
export class IntegrationListComponent implements OnInit {

  integrations: SlackIntegration[]

  constructor(private integrationService: IntegrationService) { }


  ngOnInit() {
    this.integrationService.getAllIntegrations()
      .subscribe((integrations: Array<SlackIntegration>) => this.integrations = integrations);
  }

}