import { Component, OnInit } from '@angular/core';
import { Script } from '../script.model';
import { ScriptService } from '../script.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-new-script',
  templateUrl: './new-script.component.html',
  styleUrls: ['./new-script.component.css']
})
export class NewScriptComponent implements OnInit {

  newScriptForm: FormGroup;
  script: Script

  constructor(private scriptService: ScriptService, private formBuilder: FormBuilder, private router: Router) { 
    this.newScriptForm = this.formBuilder.group({
      'name': ['', [Validators.required]],
      'scriptBody': ['', [Validators.required]]
    });
  }

  ngOnInit() {}
  

  submitForm(newScript: Script) {
    this.scriptService.postScript(newScript)
      .subscribe(newScript => {
        this.router.navigate(['scripts/' + newScript._id])
      });
  }

}