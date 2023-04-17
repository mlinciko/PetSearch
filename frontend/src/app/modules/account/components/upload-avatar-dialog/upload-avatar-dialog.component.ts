import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import dxFileUploader from 'devextreme/ui/file_uploader';
import { IDxFormItems } from 'src/app/models/models';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/utils/ulits.class';

@Component({
  selector: 'app-upload-avatar-dialog',
  templateUrl: './upload-avatar-dialog.component.html',
  styleUrls: ['./upload-avatar-dialog.component.scss']
})
export class UploadAvatarDialogComponent implements OnInit {
  @Output() onCloseEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild('form') form!: DxFormComponent;
  formItems!: IDxFormItems;
  formData: any = {};

  fieldText = 'Choose a file'
  file: any = {}
  allowedTypes = ['.jpeg', '.jpg', '.png'];
  @ViewChild('fileUploader') fileUploader!: dxFileUploader
  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.initFormItems()
  }

  initFormItems(): void {
    this.formItems = [
      {
        itemType: 'group',
        colCount: 2,
        items: [
          {
            dataField: 'file',
            colSpan: 1,
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
          {
            itemType: 'button',
            colSpan: 1,
            horizontalAlignment: 'left',
            verticalAlignment: 'bottom',
            buttonOptions: {
              stylingMode: 'contained',
              text: 'Upload image',
              type: 'default',
              onClick: (): void => this.onSubmit(),
            },
          },
        ],
      },
    ]
  }

  onValueChanged(e: any): void {
    this.fieldText = ''

    this.file = e.value

    this.file.forEach((item: any) => {
      this.fieldText += `${item.name}, `
    })
    this.formData.file = this.fieldText.substring(0, this.fieldText.length - 2)
  }

  onSubmit(): void {
    this.form.formData.file = this.file[0]
    if (this.form.instance.validate().isValid) {
      this.onCloseEvent.emit();
      this.userService.uploadCurrentUserAvatar(this.file[0])
      .subscribe();
    }
  }

}
