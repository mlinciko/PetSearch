import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DxFormComponent } from 'devextreme-angular';
import { IDxFormItems } from 'src/app/models/models';
import { ICreateAnnouncement, initialCreateAnnouncement } from '../../models/create-announcement.interface';
import { AnnouncementService } from '../../services/announcement.service';
import { CommonService } from 'src/app/services/common.service';
import { IAnnouncement } from '../../models/announcement.interface';
import { Utils } from 'src/app/utils/ulits.class';
import * as _ from 'lodash';
import { ImageService } from 'src/app/services/image.service';
import { Observable, combineLatest } from 'rxjs';
import { UploadAnnImagesComponent } from '../upload-ann-images/upload-ann-images.component';

@Component({
  selector: 'app-edit-announcement',
  templateUrl: './edit-announcement.component.html',
  styleUrls: ['./edit-announcement.component.scss'],
  providers: [CommonService],
})
export class EditAnnouncementComponent implements OnInit {
  @ViewChild('form') form!: DxFormComponent;
  formItems!: IDxFormItems;
  formData: ICreateAnnouncement | any = _.cloneDeep(initialCreateAnnouncement);

  announcementId: number | null;

  @ViewChild('uploader') uploader!: UploadAnnImagesComponent;
  files: File[] = []

  constructor(
    private route: ActivatedRoute,
    private annService: AnnouncementService,
    private common: CommonService,
    private imageService: ImageService,
  ) {
    const id = this.route.snapshot.paramMap?.get("id")
    this.announcementId = id ? +id : null;
   }

  ngOnInit(): void {
    this.loadAnnouncement();
    this.initFormItems();
  }

  loadAnnouncement(): void {
    if (!this.announcementId) {
      return;
    }
    this.annService.getAnnouncementById(this.announcementId)
    .subscribe(
      (ann: IAnnouncement) => {
        this.loadImages(ann.images);
        this.formData = _.merge(this.formData, ann);
        _.forEach(Object.keys(this.formData), 
          (key) => {
            if (!initialCreateAnnouncement.hasOwnProperty(key)) {
              delete this.formData[key]
            }
        })
      }
    )
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

  loadImages(images: string[]): void {
    if (!images.length) {
      return;
    }
    const imagesObservable: Observable<any>[] = [];
    images.forEach((image) => imagesObservable.push(this.imageService.getImageBlob(image)))
    combineLatest(imagesObservable)
    .subscribe(
      (blobs) => {
        let generatedFiles: File[] = [];
        blobs.forEach(
          (blob, index) => {
            generatedFiles.push(new File([blob], images[index], blob))
          }
        )
        this.files = generatedFiles;
      }
    )
  }

  submitForm(): void {
    this.uploader.validate();
    if (this.form.instance.validate().isValid && this.uploader.isValid()){
      this.annService.updateAnnouncement(
        {...this.formData, announcement_id: this.announcementId}
      )
      .subscribe(
        (res) => {
          this.uploader.onSubmit(res.announcement_id);
        }
      )
    } 
  }

}
