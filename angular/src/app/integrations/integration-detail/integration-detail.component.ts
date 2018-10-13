import { Component, OnInit } from '@angular/core';
import { IntegrationService } from '../integration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SlackIntegration } from '../integration.model';

@Component({
  selector: 'app-integration-detail',
  templateUrl: './integration-detail.component.html',
  styleUrls: ['./integration-detail.component.css']
})
export class IntegrationDetailComponent implements OnInit {

  integration: SlackIntegration
  id: String

  constructor(
    private integrationService: IntegrationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.integrationService.getIntegrationById(this.id)
      .subscribe(integration => {
        this.integration = integration
      });
  }

  deleteIntegration() {
    this.integrationService.deleteIntegration(this.integration._id)
      .subscribe()
    this.router.navigate(['integrations'])
  }
  
}