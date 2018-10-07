import { Component, OnInit } from '@angular/core';
import { Script } from '../script.model';
import { ScriptService } from '../script.service';

@Component({
  selector: 'app-script-list',
  templateUrl: './script-list.component.html',
  styleUrls: ['./script-list.component.css']
})
export class ScriptListComponent implements OnInit {

  scripts: Script[]

  constructor(private scriptService: ScriptService) { }

  ngOnInit() {
    this.scriptService.getAllScripts()
    .subscribe((scripts: Array<Script>) => this.scripts = scripts);
  }

}
