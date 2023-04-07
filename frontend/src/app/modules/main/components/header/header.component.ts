import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/models/models';
import { ImageService } from 'src/app/services/image.service';
import { UserService } from 'src/app/services/user.service';
import * as _ from "lodash";
import { faUserCircle, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { CATEGORIES } from '../../models/categories';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isUserAuthorized: boolean = false;
  user!: IUser;
  noImageIcon = faUserCircle;
  signinIcon = faSignInAlt;
  constructor(
    protected userService: UserService,
    private imageService: ImageService,
  ) { }

  categories = CATEGORIES;

  ngOnInit(): void {
    this.userService.user.subscribe(
      (user: IUser) => {
        this.isUserAuthorized = this.userService.isUserAuthrized();
        this.user = user;
      }
    )
  }

  getUserImage(imagePath: string): string {
    return this.imageService.getFullImagePath(imagePath);
  }

}
