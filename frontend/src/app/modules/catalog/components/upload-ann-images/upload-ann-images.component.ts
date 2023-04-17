import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { faXmarkCircle } from '@fortawesome/free-regular-svg-icons';
import { DxFormComponent } from 'devextreme-angular';
import dxFileUploader from 'devextreme/ui/file_uploader';
import { IDxFormItems } from 'src/app/models/models';
import { Utils } from 'src/app/utils/ulits.class';
import { AnnouncementService } from '../../services/announcement.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-ann-images',
  templateUrl: './upload-ann-images.component.html',
  styleUrls: ['./upload-ann-images.component.scss']
})
export class UploadAnnImagesComponent implements OnInit {
  @ViewChild('form') form!: DxFormComponent;
  formItems!: IDxFormItems;
  formData: any = {};

  fieldText = 'Select files'
  @Input() set _files(value: File[]) {
    if (value && value.length) {
       this.files = value;
       this.onValueChanged({value})
    }
  }
  files!: File[];
  allowedTypes = ['.jpeg', '.png', '.jpg'];
  @ViewChild('fileUploader') fileUploader!: dxFileUploader

  uploadedImages: any[] = [];

  closeIcon = faXmarkCircle as any;
  constructor(
    private ann: AnnouncementService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initFormItems();
    if (this.files && this.files.length) {
      this.createURLObjects();
    }
  }

  initFormItems(): void {
    this.formItems = [
      {
        itemType: 'group',
        caption: 'Images',
        colCount: 2,
        items: [
          {
            dataField: 'file',
            colSpan: 2,
            editorType: 'dxTextBox',
            cssClass: 'dropzone-external',
            editorOptions: {
              placeholder: this.fieldText,
            },
            label: {
              visible: false,
            },
            validationRules: [
              {
                type: "custom",
                reevaluate: false,
                message: "Invalid file type",
                validationCallback: (e: any): boolean => {
                  if (e.value) {
                    const type = Utils.getFileType(e.value);
                    if (type && this.allowedTypes.includes(`.${type}`)) {
                      return true;
                    }
                  }
                  return false;
                },
              },
              Utils.requiredRule()
            ],
          },
        ],
      },
    ]
  }

  onValueChanged(e: any): void {
    this.files = e.value
    this.fieldText = ''

    this.files.forEach((item: any) => {
      this.fieldText += `${item.name}, `
    })
    this.formData.file = this.fieldText.substring(0, this.fieldText.length - 2)
    this.createURLObjects();
  }

  onSubmit(id: number): void {
    const payload = new FormData();
    this.files.forEach(
      (file) => payload.append(file.name, file)
    )
    payload.append("announcement_id", id.toString())
    this.ann.uploadImages(payload).subscribe(
      (res) => {
        this.router.navigate([`/announcement/view/${id}`])
      }
    )
  }

  isValid(): boolean | undefined {
    return this.form.instance.validate().isValid;
  }

  validate(): void {
    this.form.instance.validate();
  }

  deleteFile(selectedFile: {name: string, file: any}): void {
    this.files = this.files.filter((file) => file.name !== selectedFile.name);
    this.onValueChanged({value: this.files});
  }

  createURLObjects(): void {
    this.uploadedImages = [];
    this.files.forEach(
      (file) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.uploadedImages.push({name: file.name, file: reader.result}); 
        };
      }
    )
  }

}
