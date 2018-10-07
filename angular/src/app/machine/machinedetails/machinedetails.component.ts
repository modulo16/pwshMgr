import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { MachineService } from '../machine.service';
import { Machine, Job } from '../machine.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../users/user.service';
import { User } from '../../users/user.model'
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationService } from '../../applications/application.service';
import { Application } from '../../applications/application.model';
import { CredentialService } from '../../credentials/credential.service';
import { Credential } from '../../credentials/credential.model';
import * as io from 'socket.io-client';
import { Group } from '../../groups/group.model';
import { GroupService } from '../../groups/group.service';
import { JobService } from '../../jobs/jobs.service';

@Component({
  selector: 'app-machinedetails',
  templateUrl: './machinedetails.component.html',
  styleUrls: ['./machinedetails.component.css']
})
export class MachinedetailsComponent implements OnInit, OnDestroy {
  //for modal
  socket: SocketIOClient.Socket

  modalRef: BsModalRef;
  modalConfig = {
    animated: false,
    class: 'modal-lg',
    ignoreBackdropClick: true
  };

  //for form
  deployForm: FormGroup;
  machine: Machine;
  id: string;
  active = false;
  users: User[]
  applicationToDeploy: String
  applications: Application[]
  credentials: Credential[];
  refreshing: string;
  groups: Group[];
  jobs: Job[];
  showJobsDiv: Boolean

  constructor(
    private machineService: MachineService,
    private route: ActivatedRoute,
    private userService: UserService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private applicationService: ApplicationService,
    private credentialService: CredentialService,
    private router: Router,
    private groupService: GroupService,
    private jobService: JobService
  ) {

    this.socket = io.connect("")
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.machineService.getMachineById(this.id)
      .subscribe(machine => {
        this.machine = machine
      });
    this.socket.emit('room', this.id)
    this.socket.on('machineUpdate', (machine: Machine) => {
      console.log("received update")
      this.machine = machine
    })
  }

  deleteMachine() {
    this.machineService.deleteMachine(this.machine._id)
      .subscribe()
    this.router.navigate(['machines'])
  }

  saveMachine() {
    this.machineService.updateMachine(this.machine)
      .subscribe()
    this.modalRef.hide()
  }

  showJobs() {
    this.machineService.getJobByMachine(this.id)
      .subscribe((jobs: Array<Job>) => this.jobs = jobs)
  }

  hideJobs() {
    this.jobs = null
  }

  changeCredential(template: TemplateRef<any>) {
    this.credentialService.getAllCredentials()
      .subscribe((credentials: Array<Credential>) => this.credentials = credentials)
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  class() {
    if (this.machine.status == "Online") {
      return "table-success"
    }
    if (this.machine.status == "Offline") {
      return "table-danger"
    }
  }

  runThis(service) {
    if (service.status == "Stopped") {
      return "table-danger"
    }
  }

  ngOnDestroy() {
    this.socket.disconnect()
    console.log("disconneted socket")
  }
}