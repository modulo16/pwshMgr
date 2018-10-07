import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Application } from '../application.model';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.css']
})
export class ApplicationDetailsComponent implements OnInit {

  application: Application
  
  constructor(
    private applicationService: ApplicationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.applicationService.getApplicationById(this.route.snapshot.params['id'])
      .subscribe(application => this.application = application)
    
  }
  deleteApplication() {
    this.applicationService.deleteApplication(this.application._id)
      .subscribe()
      this.router.navigate(['applications'])
  }
}
