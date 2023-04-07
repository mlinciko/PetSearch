import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { IDxFormItems } from 'src/app/models/models';
import { Utils } from 'src/app/utils/ulits.class';
import { initRegistryFormData, IRegistryPayload, TRegistryData } from '../../models/models';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.scss']
})
export class RegistryComponent implements OnInit {
  @ViewChild('form') form!: DxFormComponent;
  formItems!: IDxFormItems;
  formData: TRegistryData = initRegistryFormData;
  rememberMe: boolean | any = false;

  backIcon = faArrowLeft;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initFormItems()
  }

  initFormItems(): void {
    this.formItems = [
      {
        editorType: 'dxTextBox',
        dataField: 'email',
        label: { text: 'Email', visible: false },
        editorOptions: {
          labelMode: 'floating'
        },
        validationRules: [Utils.requiredRule()],
      }, 
      {
        editorType: 'dxTextBox',
        dataField: 'first_name',
        label: { text: 'First Name', visible: false },
        editorOptions: {
          labelMode: 'floating'
        },
        validationRules: [Utils.requiredRule()],
      },
      {
        editorType: 'dxTextBox',
        dataField: 'last_name',
        label: { text: 'Last Name', visible: false },
        editorOptions: {
          labelMode: 'floating'
        },
        validationRules: [Utils.requiredRule()],
      },
      {
        editorType: 'dxTextBox',
        dataField: 'tel',
        label: { text: 'Phone Number', visible: false },
        editorOptions: {
          labelMode: 'floating'
        },
        validationRules:[
          {
            type: "custom",
            reevaluate: false,
            message: "Invalid telephone number",
            validationCallback: (e: any): boolean => {
              if (e.value) {
                const tel = e.value;
                if (tel.match(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/))
                  return true;
                else return false
              }
              return true;
            },
          },
        ]
      },
      {
        editorType: 'dxTextBox',
        dataField: 'password',
        label: { text: 'Password', visible: false },
        editorOptions: {
          labelMode: 'floating',
          mode: 'password', 
          onValueChanged: (e: any) => {
            if (this.form.instance.getEditor("password_confirm")?.option("value")) {
              if (e.value !== this.form.instance.getEditor("password_confirm")?.option("value"))
                this.form.instance.getEditor("password_confirm")?.option("validationStatus", "invalid")
              else this.form.instance.getEditor("password_confirm")?.option("validationStatus", "valid")
            }
          }
        },
        validationRules: [Utils.requiredRule(), Utils.passwordLengthRule()],
      },
      {
        editorType: 'dxTextBox',
        dataField: 'password_confirm',
        label: { text: 'Confirm password', visible: false },
        editorOptions: {
          labelMode: 'floating',
          mode: 'password', 
          onValueChanged: (e: any) => {
            if (this.form.instance.getEditor("password")?.option("value")) {
              if (e.value !== this.form.instance.getEditor("password")?.option("value"))
                this.form.instance.getEditor("password_confirm")?.option("validationStatus", "invalid")
              else this.form.instance.getEditor("password_confirm")?.option("validationStatus", "valid")
            }
          } 
        },
        validationRules: [Utils.requiredRule(), Utils.passwordLengthRule()],
      },
    ]
  }

  submitForm(): void {
    if (this.form.instance.validate().isValid){
      const formData = { ...this.formData } as Partial<TRegistryData>;
      delete formData.password_confirm
      this.auth.registry(formData as IRegistryPayload, this.rememberMe)
      .subscribe(
        (res) => {
          if (res.status) {
            this.router.navigate(["/"])
          }
        }
      )
    } 
  }

}
