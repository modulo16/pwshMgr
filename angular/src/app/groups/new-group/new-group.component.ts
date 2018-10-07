import { Component, OnInit } from '@angular/core';
import { GroupService } from '../group.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Group } from '../group.model';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.css']
})
export class NewGroupComponent implements OnInit {

  newGroupForm: FormGroup;

  constructor(private groupService: GroupService,
    private formBuilder: FormBuilder,
    private router: Router) {
      this.newGroupForm = this.formBuilder.group({
        'name': ['', [Validators.required]]
      });
     }

  ngOnInit() {
  }

  submitForm(newGroup: Group) {
    this.groupService.postGroup(newGroup)
      .subscribe(newGroup => {
        this.router.navigate(['groups/' + newGroup._id])
      });
  }


}
