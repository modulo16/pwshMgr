import { Component, OnInit } from '@angular/core';
import { MachineService } from '../../machine/machine.service';
import { AlertService } from '../alert.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Machine } from '../../machine/machine.model';
import { AlertPolicy } from '../alertpolicy.model';
import { IntegrationService } from '../../integrations/integration.service';
import { SlackIntegration } from '../../integrations/integration.model';

@Component({
  selector: 'app-new-windows-service-alert',
  templateUrl: './new-windows-service-alert.component.html',
  styleUrls: ['./new-windows-service-alert.component.css']
})

export class NewWindowsServiceAlertComponent implements OnInit {

  newWindowsServiceAlertForm: FormGroup;
  machines: Machine[]
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

    this.newWindowsServiceAlertForm = this.formBuilder.group({
      'machineId': ['', [Validators.required]],
      'item': ['', [Validators.required]],
      'priority': ['', [Validators.required]],
      'integrations': ['', [Validators.required]]
    })
  }

  onChange() {
    console.log(this.selectedMachineId)
    this.machineService.getMachineById(this.selectedMachineId)
      .subscribe((machine: Machine) => this.selectedMachine = machine)
    console.log(this.selectedMachine)
  }

  ngOnInit() {
    this.machineService.getAllMachines()
      .subscribe((machines: Array<Machine>) => this.machines = machines)
    this.integrationService.getAllIntegrations()
      .subscribe((integrations: Array<SlackIntegration>) => this.integrations = integrations)
  }

  submitForm(newDiskSpaceAlert: AlertPolicy) {
    newDiskSpaceAlert.type = "service";
    newDiskSpaceAlert.threshold = "Stopped";
    this.alertService.postAlertPolicy(newDiskSpaceAlert)
      .subscribe(newDiskSpaceAlert => {
        this.router.navigate(['alertpolicies/'])
      });
  }
}