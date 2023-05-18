import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { GenericComponent } from '../../../../shared/components/generic.component';
import { LOGIN_PLACEHOLDER, LOGIN_ERROR_TIP, FORM_LABELS } from '../../../../shared/constants/form.constants';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IPC, MESSAGE_TYPE } from 'src/app/shared/constants/helper.constants';
import { Subscription } from 'rxjs';
import { LOCAL_STORAGE } from '../../../../shared/constants/local-storage.contants';
import { NzModalService } from 'ng-zorro-antd/modal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'sos-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends GenericComponent {
  validateForm!: UntypedFormGroup;

  emailPlaceholder: string = LOGIN_PLACEHOLDER.email;
  emailErrorTip: string = LOGIN_ERROR_TIP.email;

  passwordPlaceholder: string = LOGIN_PLACEHOLDER.password;
  passwordErrorTip: string = LOGIN_ERROR_TIP.password;
  passwordVisible = false; // temporary placement

  signInLabel = FORM_LABELS.signIn;
  loginSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    public authService: AuthService,
    message: NzMessageService,
    modal: NzModalService) {
      super(message, modal);
    this.windowsSize = {width: 475, height: 532};
  }

  override ngOnInit(): void {
    this.setWindowSize();
    this.validateForm = this.formBuilder.group({
      userNameOrEmailAddress: [null, [Validators.required]],
      password: [null, [Validators.required]],
      rememberClient: [true],
      isFromDesktopApp: [true]
    });
    this.logout();
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.submitWait = true;
      this.validateForm.disable();
      localStorage.setItem(LOCAL_STORAGE.REMEMBER_ME, this.validateForm.get('rememberClient')?.value);
      this.loginSubscription = this.authService.authenticateLogin(this.validateForm.value)
      .subscribe({
        next: response => {
          this.ipcRenderer.send(IPC.START_SYNC_SERVICE);
          this.submitWait = false;
          this.validateForm.enable();
          let currentUser = this.authService.currentUserValue;
          if (currentUser.userLicences.length > 1) {
            this.router.navigate(['/auth/select-organization']);
          } else {
            let organizationId = currentUser.userLicences[0].organizationId;
            this.authService.loggedIn.next(true);
            this.authService.organizationId.next(organizationId);
            localStorage.setItem(LOCAL_STORAGE.ORGANIZATION_ID, organizationId.toString());
            this.router.navigate(['/sync']);
          }
        },
        error: response => {
          var error = response.error.error;
          this.submitWait = false;
          this.validateForm.enable();

          var errMessage = error.message;

          if(error.code == 7) { //email not confirmed
            errMessage = `Email not confirmed. Please click <a href='${environment.accountServerUiUrl}/confirm-email' target='_blank'>here</a> to confirm your email.`;
          }

          this.showMessage(MESSAGE_TYPE.error, errMessage);
        }
      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  logout(){
    this.authService.logout();
  }

  override ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }

}
