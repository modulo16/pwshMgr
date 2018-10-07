import { Component, OnInit } from '@angular/core';
import { Application } from '../application.model';
import { ApplicationService } from '../application.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-new-application',
  templateUrl: './new-application.component.html',
  styleUrls: ['./new-application.component.css']
})
export class NewApplicationComponent implements OnInit {

  newApplicationForm: FormGroup;
  application: Application

  constructor(private applicationService: ApplicationService, private formBuilder: FormBuilder, private router: Router) { 
    this.newApplicationForm = this.formBuilder.group({
      'name': ['', [Validators.required]],
      'chocoInstallName': ['', [Validators.required]]
    });
  }

  ngOnInit() {}
  

  submitForm(newApplication: Application) {
    this.applicationService.postApplication(newApplication)
      .subscribe(newApplication => {
        this.router.navigate(['applications/' + newApplication._id])
      });
  }

}