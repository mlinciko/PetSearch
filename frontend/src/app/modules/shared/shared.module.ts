import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogCardComponent } from './components/catalog-card/catalog-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    CatalogCardComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MaterialModule,
  ],
  exports: [
    CatalogCardComponent
  ]
})
export class SharedModule { }
