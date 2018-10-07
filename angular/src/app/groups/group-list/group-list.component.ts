import { Component, OnInit } from '@angular/core';
import { GroupService } from '../group.service'
import { Group } from '../group.model'
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-grouplist',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {

  groups: Group[]

  constructor(private groupService: GroupService) { }

  ngOnInit() {
    this.groupService.getAllGroups()
      .subscribe((groups: Array<Group>) => this.groups = groups);
  }

}