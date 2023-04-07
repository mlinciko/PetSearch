import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from "@angular/material/tooltip";



@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule
  ],
  exports: [
    MatTooltipModule,
  ]
})
export class MaterialModule { }
