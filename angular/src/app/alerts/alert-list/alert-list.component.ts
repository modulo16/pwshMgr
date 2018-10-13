import { Component, OnInit } from '@angular/core';
import { AlertService } from '../alert.service';
import { Alert } from '../alert.model';

@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.css']
})
export class AlertListComponent implements OnInit {

  alerts: Alert[]

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.getAllAlerts()
      .subscribe((alerts: Array<Alert>) => this.alerts = alerts);
  }

  runThis(alert) {
    if (alert.priority == "High") {
      return "table-warning"
    }
    if (alert.priority == "Urgent") {
      return "table-danger"
    }
  }

}
