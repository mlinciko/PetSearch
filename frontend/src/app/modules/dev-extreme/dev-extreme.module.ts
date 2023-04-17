import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DxButtonModule, DxCheckBoxModule, DxDataGridModule, DxFileUploaderModule, DxFormModule, DxGalleryModule, DxLoadIndicatorComponent, DxLoadIndicatorModule, DxLoadPanelModule, DxPopupModule, DxTextAreaModule, DxTextBoxModule } from 'devextreme-angular';



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
    DxFileUploaderModule,
    DxPopupModule,
    DxLoadPanelModule,
  ],
  exports: [
    DxDataGridModule,
    DxButtonModule,
    DxGalleryModule,
    DxFormModule,
    DxTextBoxModule,
    DxCheckBoxModule,
    DxTextAreaModule,
    DxFileUploaderModule,
    DxPopupModule,
    DxLoadPanelModule,
  ]
})
export class DevExtremeModule { }
