import { Component, OnInit } from '@angular/core';
import { Application } from '../application.model';
import { ApplicationService } from '../application.service';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.css']
})
export class ApplicationListComponent implements OnInit {

  applications: Application[]

  constructor(private applicationService: ApplicationService) { }

  ngOnInit() {

    this.applicationService.getAllApplications()
      .subscribe((applications: Array<Application>) => this.applications = applications)

  }

}
