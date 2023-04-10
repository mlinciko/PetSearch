import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { IDxFormItems } from 'src/app/models/models';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/utils/ulits.class';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  @ViewChild('form') form!: DxFormComponent;
  formItems!: IDxFormItems;
  formData: any = {};
  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.initFormItems();
  }

  initFormItems(): void {
    this.formItems = [
      {
        editorType: 'dxTextBox',
        dataField: 'password',
        label: { text: 'Old password', visible: false },
        editorOptions: {
          labelMode: 'floating',
          mode: 'password', 
        },
        validationRules: [Utils.requiredRule()],
      },
      {
        editorType: 'dxTextBox',
        dataField: 'new_password',
        label: { text: 'New password', visible: false },
        editorOptions: {
          labelMode: 'floating',
          mode: 'password', 
          onValueChanged: (e: any) => {
            if (this.form.instance.getEditor("new_password_confirm")?.option("value")) {
              if (e.value !== this.form.instance.getEditor("new_password_confirm")?.option("value"))
                this.form.instance.getEditor("new_password_confirm")?.option("validationStatus", "invalid")
              else this.form.instance.getEditor("new_password_confirm")?.option("validationStatus", "valid")
            }
          }
        },
        validationRules: [Utils.requiredRule(), Utils.passwordLengthRule()],
      },
      {
        editorType: 'dxTextBox',
        dataField: 'new_password_confirm',
        label: { text: 'Confirm new password', visible: false },
        editorOptions: {
          labelMode: 'floating',
          mode: 'password', 
          onValueChanged: (e: any) => {
            if (this.form.instance.getEditor("new_password")?.option("value")) {
              if (e.value !== this.form.instance.getEditor("new_password")?.option("value")) 
                this.form.instance.getEditor("new_password_confirm")?.option("validationStatus", "invalid")
              else this.form.instance.getEditor("new_password_confirm")?.option("validationStatus", "valid")
            }
          } 
        },
        validationRules: [Utils.requiredRule(), Utils.passwordLengthRule()],
      },
    ]
  }

  submitForm(): void {
    if (this.form.instance.validate().isValid){
      const formData = { ...this.formData };
      delete formData.new_password_confirm
      formData.user_id = this.userService.user.value.user_id
      this.userService.changePassword(formData).subscribe(
        (res) => {
          notify({ message: res, type: "success", width: "auto"});
        }
      )
    } 
  }

}
