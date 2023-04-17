import { Component, OnInit, ViewChild } from '@angular/core';
import { IDxFormItems } from 'src/app/models/models';
import { ICreateAnnouncement, initialCreateAnnouncement } from '../../models/create-announcement.interface';
import { DxFormComponent } from 'devextreme-angular';
import { Utils } from 'src/app/utils/ulits.class';
import { CommonService } from 'src/app/services/common.service';
import { AnnouncementService } from '../../services/announcement.service';
import { UploadAnnImagesComponent } from '../upload-ann-images/upload-ann-images.component';

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.component.html',
  styleUrls: ['./add-announcement.component.scss'],
  providers: [CommonService],
})
export class AddAnnouncementComponent implements OnInit {
  @ViewChild('uploader') uploader!: UploadAnnImagesComponent;
  @ViewChild('form') form!: DxFormComponent;
  formItems!: IDxFormItems;
  formData: ICreateAnnouncement = initialCreateAnnouncement;
  
  constructor(
    private common: CommonService,
    private ann: AnnouncementService,
  ) { }

  ngOnInit(): void {
    this.initFormItems();
  }

  initFormItems(): void {
    this.formItems = [
      {
        itemType: "group",
        caption: "Parameters",
        items: [
          {
            itemType: "group",
            colCount: 3,
            items: [
              {
                editorType: 'dxSelectBox',
                dataField: 'type_id',
                colSpan: 1,
                label: { text: 'Type', visible: false },
                editorOptions: {
                  dataSource: this.common.createSelectSource("type"),
                  labelMode: 'floating',
                  maxLength: 60,
                  valueExpr: "type_id",
                  displayExpr: "name",
                },
                validationRules: [Utils.requiredRule()],
              },
              {
                editorType: 'dxSelectBox',
                dataField: 'pet_id',
                colSpan: 1,
                label: { text: 'Pet', visible: false },
                editorOptions: {
                  dataSource: this.common.createSelectSource("pet"),
                  labelMode: 'floating',
                  maxLength: 60,
                  valueExpr: "pet_id",
                  displayExpr: "name",
                },
                validationRules: [Utils.requiredRule()],
              },
              {
                editorType: 'dxSelectBox',
                dataField: 'city_id',
                colSpan: 1,
                label: { text: 'City', visible: false },
                editorOptions: {
                  dataSource: this.common.createSelectSource("city"),
                  labelMode: 'floating',
                  maxLength: 60,
                  valueExpr: "city_id",
                  displayExpr: "name",
                },
                validationRules: [Utils.requiredRule()],
              }
            ]
          },
        ]
      },
      {
        itemType:"group",
        caption: "Description",
        items: [
          {
            editorType: 'dxTextBox',
            dataField: 'title',
            label: { text: 'Title', visible: false },
            editorOptions: {
              labelMode: 'floating',
              maxLength: 60,
            },
            validationRules: [Utils.requiredRule()],
          }, 
          {
            editorType: 'dxTextArea',
            dataField: 'descr',
            label: { text: 'Description', visible: false },
            editorOptions: {
              labelMode: 'floating',
            },
            validationRules: [Utils.requiredRule()],
          },
        ]
      }
    ]
  }

  submitForm(): void {
    this.uploader.validate();
    if (this.form.instance.validate().isValid && this.uploader.isValid()){
      this.ann.createAnnouncement(this.formData)
      .subscribe(
        (res) => {
          this.uploader.onSubmit(res.announcement_id);
        }
      )
    } 
  }

}
