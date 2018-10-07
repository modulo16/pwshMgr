import { Component, OnInit } from '@angular/core';
import { Process, Machine } from '../../machine/machine.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MachineService } from '../../machine/machine.service';
import { AlertService } from '../alert.service';
import { Router } from '@angular/router';
import { AlertPolicy } from '../alertpolicy.model';

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

  constructor(
    private machineService: MachineService,
    private alertService: AlertService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {

    this.newProcessAlertForm = this.formBuilder.group({
      'machineId': ['', [Validators.required]],
      'item': ['', [Validators.required]],
      'threshold': ['', [Validators.required]]
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
  }

  submitForm(newProcessAlertForm: AlertPolicy) {
    newProcessAlertForm.type = "process";
    this.alertService.postAlertPolicy(newProcessAlertForm)
      .subscribe(newProcessAlertForm => {
        this.router.navigate(['alertpolicies/'])
      });
  }

}