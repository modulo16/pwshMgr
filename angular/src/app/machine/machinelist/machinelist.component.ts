import { Component, OnInit } from '@angular/core';
import { MachineService } from '../machine.service'
import { Machine } from '../machine.model'
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-machinelist',
  templateUrl: './machinelist.component.html',
  styleUrls: ['./machinelist.component.css']
})
export class MachinelistComponent implements OnInit {

  machines: Machine[]

  constructor(private machineService: MachineService) { }

  ngOnInit() {
    this.machineService.getAllMachines()
      .subscribe((machines: Array<Machine>) => this.machines = machines);
  }

  runThis(machine){
    if (machine.status == "Offline") {
      return "table-danger"
    }
    if (machine.status == "Online, WinRM unreachable") {
      return "table-danger"
    }
  }
}