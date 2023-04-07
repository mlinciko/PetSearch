import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DxButtonModule, DxCheckBoxModule, DxDataGridModule, DxFormModule, DxGalleryModule, DxTextBoxModule } from 'devextreme-angular';



@NgModule({
  imports: [
    CommonModule,
    DxDataGridModule,
    DxButtonModule,
    DxGalleryModule,
    DxFormModule,
    DxTextBoxModule,
    DxCheckBoxModule,
  ],
  exports: [
    DxDataGridModule,
    DxButtonModule,
    DxGalleryModule,
    DxFormModule,
    DxTextBoxModule,
    DxCheckBoxModule,
  ]
})
export class DevExtremeModule { }
