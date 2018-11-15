import { Component, OnInit } from '@angular/core';
import { Process, Machine } from '../../machine/machine.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MachineService } from '../../machine/machine.service';
import { AlertService } from '../alert.service';
import { Router } from '@angular/router';
import { AlertPolicy } from '../alertpolicy.model';
import { IntegrationService } from '../../integrations/integration.service';
import { SlackIntegration } from '../../integrations/integration.model';

@Component({
  selector: 'app-new-process-alert',
  templateUrl: './new-process-alert.component.html',
  styleUrls: ['./new-process-alert.component.css']
})
export class NewProcessAlertComponent implements OnInit {

  newProcessAlertForm: FormGroup;
  machines: Machine[];
  processes: Process;
  selectedMachine: Machine;
  selectedMachineId: String;
  integrations: SlackIntegration[]

  constructor(
    private machineService: MachineService,
    private alertService: AlertService,
    private router: Router,
    private formBuilder: FormBuilder,
    private integrationService: IntegrationService
  ) {

    this.newProcessAlertForm = this.formBuilder.group({
      'machineId': ['', [Validators.required]],
      'item': ['', [Validators.required]],
      'threshold': ['', [Validators.required]],
      'priority': ['', [Validators.required]],
      'integrations': ['']
    })
   }

   onChange() {
    this.machineService.getMachineById(this.selectedMachineId)
      .subscribe((machine: Machine) => this.selectedMachine = machine)
  }

  ngOnInit() {
    this.machineService.getAllMachines()
    .subscribe((machines: Array<Machine>) => this.machines = machines)
    this.integrationService.getAllIntegrations()
    .subscribe((integrations: Array<SlackIntegration>) => this.integrations = integrations)
  }

  submitForm(newProcessAlertForm: AlertPolicy) {
    newProcessAlertForm.type = "process";
    this.alertService.postAlertPolicy(newProcessAlertForm)
      .subscribe(newProcessAlertForm => {
        this.router.navigate(['alertpolicies/'])
      });
  }

}