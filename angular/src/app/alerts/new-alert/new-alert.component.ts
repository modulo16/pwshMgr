import { Component, OnInit } from '@angular/core';
import { MachineService } from '../../machine/machine.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Machine } from '../../machine/machine.model';
import { AlertPolicy } from '../alertpolicy.model';
import { AlertService } from '../alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-alert',
  templateUrl: './new-alert.component.html',
  styleUrls: ['./new-alert.component.css']
})
export class NewAlertComponent implements OnInit {

  newDiskSpaceAlertForm: FormGroup;
  machines: Machine[];
  selectedMachine: Machine;
  selectedMachineId: String;

  constructor(private machineService: MachineService, private router: Router, private formBuilder: FormBuilder, private alertService: AlertService) {
    this.newDiskSpaceAlertForm = this.formBuilder.group({
      'machineId': ['', [Validators.required]],
      'item': ['', [Validators.required]],
      'threshold': ['', [Validators.required]]
    })
   }

   onChange() {
    console.log(this.selectedMachineId)
    this.machineService.getMachineById(this.selectedMachineId)
      .subscribe((machine:Machine) => this.selectedMachine = machine)
      console.log(this.selectedMachine)
  }


  ngOnInit() {
    this.machineService.getAllMachines()
    .subscribe((machines: Array<Machine>) => this.machines = machines)
  }

  submitForm(newDiskSpaceAlert: AlertPolicy) {
    newDiskSpaceAlert.type = "drive";
    this.alertService.postAlertPolicy(newDiskSpaceAlert)
      .subscribe(newDiskSpaceAlert => {
        this.router.navigate(['alertpolicies/'])
      });
  }


}