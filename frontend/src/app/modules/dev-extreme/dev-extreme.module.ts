import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DxButtonModule, DxCheckBoxModule, DxDataGridModule, DxFormModule, DxGalleryModule, DxTextAreaModule, DxTextBoxModule } from 'devextreme-angular';



@NgModule({
  imports: [
    CommonModule,
    DxDataGridModule,
    DxButtonModule,
    DxGalleryModule,
    DxFormModule,
    DxTextBoxModule,
    DxCheckBoxModule,
    DxTextAreaModule,
  ],
  exports: [
    DxDataGridModule,
    DxButtonModule,
    DxGalleryModule,
    DxFormModule,
    DxTextBoxModule,
    DxCheckBoxModule,
    DxTextAreaModule,
  ]
})
export class DevExtremeModule { }
