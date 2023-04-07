import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IMenuItem } from '../models/menu-item.interface';
import { ANNOUNCEMENTS_MENU_ITEMS } from '../models/menu-items';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  activeMenuItem: BehaviorSubject<IMenuItem> = new BehaviorSubject(ANNOUNCEMENTS_MENU_ITEMS[0]);
  constructor() { }
}
