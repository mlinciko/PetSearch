import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DxButtonModule, DxCheckBoxModule, DxDataGridModule, DxFileUploaderModule, DxFormModule, DxGalleryModule, DxLoadIndicatorComponent, DxLoadIndicatorModule, DxLoadPanelModule, DxPopupModule, DxScrollViewModule, DxTextAreaModule, DxTextBoxModule } from 'devextreme-angular';



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
    DxScrollViewModule,
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
    DxScrollViewModule,
  ]
})
export class DevExtremeModule { }
