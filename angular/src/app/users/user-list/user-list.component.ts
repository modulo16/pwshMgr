import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { UserService } from '../user.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[]

  constructor(private userService: UserService) { }

  ngOnInit() {

    this.userService.getAllUsers()
      .subscribe((users: Array<User>) => this.users = users)

  }

}
