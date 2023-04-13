import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/models/models';
import { ImageService } from 'src/app/services/image.service';
import { UserService } from 'src/app/services/user.service';
import { faChevronRight, faPen, faSignInAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { ANNOUNCEMENTS_MENU_ITEMS, CHATS_MENU_ITEMS, PROFILE_MENU_ITEMS } from "../../models/menu-items";
import { IMenuItem } from '../../models/menu-item.interface';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-account-root-menu',
  templateUrl: './account-root-menu.component.html',
  styleUrls: ['./account-root-menu.component.scss']
})
export class AccountRootMenuComponent implements OnInit {
  user!: IUser;
  noImageIcon = faUserCircle;
  arrowIcon = faChevronRight;
  editIcon = faPen;
  menuItems = [
    {
      items: ANNOUNCEMENTS_MENU_ITEMS
    },
    {
      items: CHATS_MENU_ITEMS
    },
    {
      items: PROFILE_MENU_ITEMS
    },
  ]
  constructor(
    private userService: UserService,
    private imageService: ImageService,
    private auth: AuthService,
    private account: AccountService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userService.user.subscribe(
      (user: IUser) => {
        this.user = user;
      }
    )

    this.menuItems.forEach((parentItem) => {
      const activeItem = parentItem.items.find((item) => item.path && this.router.url.includes(item.path))
      if(activeItem) {
        this.selectMenuItem(activeItem);
      }
      return parentItem;
    })
  }

  getUserImage(imagePath: string): string {
    return this.imageService.getFullImagePath(imagePath);
  }

  selectMenuItem(item: IMenuItem): void {
    this.account.activeMenuItem.next(item);
  }

  logoutUser(): void {
    this.auth.logout();
    this.auth.logoutClient();
    this.userService.unsetUser();
  }

  loadAvatar(): void {
    
  }

}
