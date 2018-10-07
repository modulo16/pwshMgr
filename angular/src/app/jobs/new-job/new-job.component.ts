import { Component, OnInit } from '@angular/core';
import { JobService } from '../jobs.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Job } from '../job.model';
import { MachineService } from '../../machine/machine.service';
import { Router } from '@angular/router';
import { ApplicationService } from '../../applications/application.service';
import { Application } from '../../applications/application.model';
import { Machine } from '../../machine/machine.model';
import { Group } from '../../groups/group.model';
import { GroupService } from '../../groups/group.service';

@Component({
  selector: 'app-new-job',
  templateUrl: './new-job.component.html',
  styleUrls: ['./new-job.component.css']
})
export class NewJobComponent implements OnInit {

  newJobForm: FormGroup;
  applications: Application[]
  machines: Machine[]

  constructor(
    private jobService: JobService,
    private formBuilder: FormBuilder,
    private machineService: MachineService,
    private applicationService: ApplicationService,
    private groupService: GroupService,
    private router: Router) {

    this.newJobForm = this.formBuilder.group({
      'machine': ['', [Validators.required]],
      'application': ['', [Validators.required]]
    });

  }

  ngOnInit() {
    this.machineService.getAllMachines()
      .subscribe((machines: Array<Machine>) => this.machines = machines)
    this.applicationService.getAllApplications()
      .subscribe((applications: Array<Application>) => this.applications = applications)
  }

  submitForm(newJob: Job) {
    newJob.subJob = false
    this.jobService.postJob(newJob)
      .subscribe(newJob => {
        this.router.navigate(['jobs/' + newJob._id])
      });
  }
}