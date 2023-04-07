import { Component } from '@angular/core';
import { CATEGORIES } from '../../models/categories';
import * as _ from 'lodash';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  categories = CATEGORIES;
}
