import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-root',
  templateUrl: './auth-root.component.html',
  styleUrls: ['./auth-root.component.scss']
})
export class AuthRootComponent implements OnInit {
  sliderItems = [
    {
      image: "/assets/slider/img01.jpeg",
      title: "Find your furry friend, fast and easy",
    },
    {
      image: "/assets/slider/img02.jpeg",
      title: "Don't give up hope, we're here to help you find your missing pet",
    },
    {
      image: "/assets/slider/img03.jpeg",
      title: "Connecting lost pets with their loving owners, one search at a time",
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
