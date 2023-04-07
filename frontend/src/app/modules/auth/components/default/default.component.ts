import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  login(): void {
    console.log("login");
  }

  registry(): void {
    console.log("registry");
  }

}
