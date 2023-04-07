import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-account-root',
  templateUrl: './account-root.component.html',
  styleUrls: ['./account-root.component.scss']
})
export class AccountRootComponent implements OnInit {

  constructor(
    protected account: AccountService,
  ) { }

  ngOnInit(): void {
  }

}
