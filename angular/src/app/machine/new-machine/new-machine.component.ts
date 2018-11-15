import { Component, OnInit } from '@angular/core';
import { Machine } from '../machine.model'
import { MachineService } from '../machine.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CredentialService } from '../../credentials/credential.service';
import { Credential } from '../../credentials/credential.model';
import { CustomValidator } from '../../shared/validation';

@Component({
  selector: 'app-new-machine',
  templateUrl: './new-machine.component.html',
  styleUrls: ['./new-machine.component.css']
})

export class NewMachineComponent implements OnInit {

  newMachineForm: FormGroup;
  credentials: Credential[];

  constructor(private credentialService: CredentialService, private machineService: MachineService, private formBuilder: FormBuilder, private router: Router) {
    this.newMachineForm = this.formBuilder.group({
      'ipAddress': ['', [Validators.required,CustomValidator.ipValidator]],
      'credential': ['', [Validators.required]],
      'pollingCycle': ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.credentialService.getAllCredentials()
      .subscribe((credentials: Array<Credential>) => this.credentials = credentials)
  }

  submitForm(newMachine: Machine) {
    this.machineService.postMachine(newMachine)
      .subscribe(newMachine => {
        this.router.navigate(['machines/' + newMachine._id])
      });
  }

}