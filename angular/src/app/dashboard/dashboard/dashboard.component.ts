import { Component, OnInit } from '@angular/core';
import { Dashboard } from '../dashboard.model';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dashboard: Dashboard

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.dashboardService.getCount()
    .subscribe(count => {
      this.dashboard = count
    })
  }
}