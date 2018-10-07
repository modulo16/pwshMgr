import { Component, OnInit } from '@angular/core';
import { Job } from '../../jobs/job.model'
import { JobService } from '../../jobs/jobs.service'
import { Observable } from 'rxjs';
import {map} from "rxjs/operators";

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {

  jobs: Job[]

  constructor(private jobService: JobService) { }

  ngOnInit() {
    this.jobService.getAllJobs().subscribe(jobs => this.jobs = jobs)
    }
    
}
