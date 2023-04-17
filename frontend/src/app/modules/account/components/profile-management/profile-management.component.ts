import { Component, OnInit } from '@angular/core';
import { faPen, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Utils } from 'src/app/utils/ulits.class';
import { IDxFormItems, IUser } from 'src/app/models/models';
import { UserService } from 'src/app/services/user.service';
import * as _ from 'lodash';
import notify from 'devextreme/ui/notify';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { confirm } from "devextreme/ui/dialog";
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-profile-management',
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss']
})
export class ProfileManagementComponent implements OnInit {
  isFormEditing: boolean = false;
  editIcon = faPen;
  noImageIcon = faUserCircle;

  formItems!: IDxFormItems;
  formData!: IUser;

  avatarDialog: boolean = false;
  constructor(
    private userService: UserService,
    private imageService: ImageService,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.userService.user.subscribe(
      (user: IUser) => {
        this.formData = _.cloneDeep(user);
      }
    )
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
    ]
  }

  submitEditingForm(): void {
    this.userService.updateUser(this.formData)
    .subscribe(
      () => {
        notify({ 
          message: "Data has been updated successfully!", 
          type: "success", 
          width: "auto"
        });
        this.cancelEditingForm();
      }
    )
  }

  cancelEditingForm(): void {
    this.isFormEditing = false;
  }

  editForm(): void {
    this.isFormEditing = true;
  }

  deleteProfile(): void {
    this.userService.deleteUser()
    .subscribe(
      () => {
        this.userService.unsetUser();
        this.auth.logoutClient();
        notify({ 
          message: "Profile has been deleted successfully!", 
          type: "success", 
          width: "auto"
        });
      }
    )
  }

  confirmDeleting(): void {
    const result = confirm(
      "<i>Are you sure you want to delete your profile?</i>",
      "Confirm action"
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        this.deleteProfile();
      }
    });
  }

  getUserImage(imagePath: string): string {
    return this.imageService.getFullImagePath(imagePath, "users");
  }

  loadAvatar(): void {
    this.avatarDialog = true;
  }

  closeLoadAvatar(): void {
    this.avatarDialog = false;
  }

}
