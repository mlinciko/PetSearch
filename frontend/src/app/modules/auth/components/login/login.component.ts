import { Component, OnInit, ViewChild } from '@angular/core';
import { IDxFormItems } from 'src/app/models/models';
import { Utils } from 'src/app/utils/ulits.class';
import { DxFormComponent } from 'devextreme-angular';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { IAuthResponse, ILoginPayload } from '../../models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('form') form!: DxFormComponent;
  formItems!: IDxFormItems;
  formData: ILoginPayload = {
    email: "",
    password: "",
  };
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
        dataField: 'password',
        label: { text: 'Password', visible: false },
        editorOptions: {
          labelMode: 'floating',
          mode: 'password',  
        },
        validationRules: [Utils.requiredRule()],
      },
    ]
  }

  submitForm(): void {
    if (this.form.instance.validate().isValid){
      this.auth.login(this.formData, this.rememberMe)
      .subscribe((res: IAuthResponse) => {
        if (res.status) {
          this.router.navigate(["/"]);
        }
      })
    } 
  }

}
