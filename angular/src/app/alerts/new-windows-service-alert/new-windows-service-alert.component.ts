import { Component, OnInit } from '@angular/core';
import { MachineService } from '../../machine/machine.service';
import { AlertService } from '../alert.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Machine } from '../../machine/machine.model';
import { AlertPolicy } from '../alertpolicy.model';
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

  constructor(
    private machineService: MachineService, 
    private alertService: AlertService, 
    private router: Router, 
    private formBuilder: FormBuilder
  ) {

    this.newWindowsServiceAlertForm = this.formBuilder.group({
      'machineId': ['', [Validators.required]],
      'item': ['', [Validators.required]],
      'priority': ['', [Validators.required]]
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

  
  submitForm(newDiskSpaceAlert: AlertPolicy) {
    newDiskSpaceAlert.type = "service";
    newDiskSpaceAlert.threshold = "Stopped";
    this.alertService.postAlertPolicy(newDiskSpaceAlert)
      .subscribe(newDiskSpaceAlert => {
        this.router.navigate(['alertpolicies/'])
      });
  }
}