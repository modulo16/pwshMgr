import { Component, OnInit } from '@angular/core';
import { AlertService } from '../alert.service';
import { AlertPolicyView } from '../alertpolicy.model';

@Component({
  selector: 'app-alert-policy-list',
  templateUrl: './alert-policy-list.component.html',
  styleUrls: ['./alert-policy-list.component.css']
})
export class AlertPolicyListComponent implements OnInit {

  alertPolicies: AlertPolicyView[]

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.getAllAlertPolicies()
      .subscribe((alertPolicies: Array<AlertPolicyView>) => this.alertPolicies = alertPolicies);
  }

}