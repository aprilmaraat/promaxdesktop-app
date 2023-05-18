import { Component } from '@angular/core';
import { GenericComponent } from '../../../../shared/components/generic.component';
import { REGISTER_STEPS } from 'src/app/shared/constants/form.constants';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzButtonSize } from 'ng-zorro-antd/button';
import Validation from '../../../../shared/utils/validation';
import { AccountRegister } from '../../../../core/models/account';
import { AccountService } from '../../../../core/services/account.service';
import { Router } from '@angular/router';
import { CountryService } from 'src/app/core/services/country.service';
import { Country } from 'src/app/core/models/country';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MESSAGE_TEXT, MESSAGE_TYPE } from '../../../../shared/constants/helper.constants';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'sos-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'] 
})
export class RegisterComponent extends GenericComponent {
  steps = REGISTER_STEPS;
  currentStep: number = 0;
  stepsLength: number = 0;
  windowHeight: number = 720;
  checked: boolean = false;
  nzSize: NzButtonSize = 'large'; // temp
  passwordVisible = false;
  confirmPasswordVisible = false;
  countries: Country[] = [];

  createAccountGroup!: UntypedFormGroup;
  contactInfoGroup!: UntypedFormGroup;
  eulaGroup!: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder, 
    private router: Router,
    private accountService: AccountService,
    private countryService: CountryService,
    message: NzMessageService,
    modal: NzModalService) { 
      super(message, modal);
    this.windowsSize = {width: 727, height: this.windowHeight};
    this.setupForm();
  }

  override ngOnInit(): void {
    this.setWindowSize();
    this.initializeVariables();
  }

  setupForm() {
    this.createAccountGroup = this.formBuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      emailAddress: [null, [Validators.required, Validators.email]],
      confirmEmail: [null, Validators.required],
      password: [null, [Validators.required]],
      confirmPassword: [null, Validators.required]
    },
    {
      validators: [
        Validation.match('password', 'confirmPassword'),
        Validation.match('emailAddress', 'confirmEmail')
      ],
    });
    this.contactInfoGroup = this.formBuilder.group({
      phoneNumber: [null, Validators.required],
      // personalWorkLocation: [null, Validators.required],
      address1: [null, Validators.required],
      address2: [null],
      city: [null, Validators.required],
      userCountry: [null, Validators.required],
      postCode: [null, Validators.required],
      timeZone: [null, Validators.required],

      roleTitle: [null, Validators.required],
      companyName: [null, Validators.required],
      companyStateCountry: [null, Validators.required],
      companySize: [null],
      creativeTeamSize: [null, Validators.required]
    });
    this.eulaGroup = this.formBuilder.group({
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  initializeVariables() {
    this.stepsLength = this.steps.length;
    this.getCountries();
  }

  getCountries() {
    this.countryService.getAllCountries()
    .subscribe({
      next: response => {
          if(response.success) {
            this.countries = response.result as Country[];
          } else {
            // Error code here
            this.showMessage(MESSAGE_TYPE.error, 'Error on `GetAllCountries` API call.');
          }
        },
      error: response => {
        this.showMessage(MESSAGE_TYPE.error, MESSAGE_TEXT.serverDown);
      }
    });
  }



  submitForm() {
    if(this.createAccountGroup.valid && this.contactInfoGroup.valid && this.eulaGroup.valid) {
      this.submitWait = true;
      this.createAccountGroup.disable();
      this.contactInfoGroup.disable();
      this.eulaGroup.disable();
      // Mock code only
      let model: AccountRegister = new AccountRegister();
      model.userInput.name = this.createAccountGroup.controls['firstName'].value;
      model.userInput.surname = this.createAccountGroup.controls['lastName'].value;
      model.userInput.emailAddress = this.createAccountGroup.controls['emailAddress'].value;
      model.userInput.userName = model.userInput.emailAddress;
      model.userInput.password = this.createAccountGroup.controls['password'].value;
      model.userInput.captchaResponse = '';

      model.phoneNumber = this.contactInfoGroup.controls['phoneNumber'].value;
      // Values not final
      model.userAddress.id = 0;
      model.userAddress.address1 = this.contactInfoGroup.controls['address1'].value;
      model.userAddress.address2 = this.contactInfoGroup.controls['address2'].value;
      model.userAddress.city = this.contactInfoGroup.controls['city'].value;
      model.userAddress.countryId = this.contactInfoGroup.controls['userCountry'].value;
      model.userAddress.postCode = this.contactInfoGroup.controls['postCode'].value;
      model.timeZone = this.contactInfoGroup.controls['timeZone'].value;
      model.title = this.contactInfoGroup.controls['roleTitle'].value;

      model.company.organizationName = this.contactInfoGroup.controls['companyName'].value;

      // Values not final
      model.company.address.id = model.userAddress.id;
      model.company.address.address1 = model.userAddress.address1
      model.company.address.address2 = model.userAddress.address2
      model.company.address.city = model.userAddress.city
      model.company.address.countryId = this.contactInfoGroup.controls['companyStateCountry'].value;
      model.company.address.postCode = model.userAddress.postCode;

      model.company.companySize = this.contactInfoGroup.controls['companySize'].value;
      model.company.creativeTeamSize = this.contactInfoGroup.controls['creativeTeamSize'].value;

      this.accountService.register(model)
      .subscribe({
        next: response => {
          this.submitWait = false;
          this.createAccountGroup.enable();
          this.contactInfoGroup.enable();
          this.eulaGroup.enable();
          this.showMessage(MESSAGE_TYPE.success, MESSAGE_TEXT.registerSuccess);
          this.router.navigate(['/auth/login']);
        },
        error: error => {
          this.submitWait = false;
          this.createAccountGroup.enable();
          this.contactInfoGroup.enable();
          this.eulaGroup.enable();
          this.showMessage(MESSAGE_TYPE.error, MESSAGE_TEXT.serverDown);
        }
     });
    }
  }

  // for demo
  previousStep() {
    if(this.currentStep > 0) {
      this.currentStep -= 1;
    } else {
      // else code here
    }
    this.setWindowSizeOnStep(this.currentStep);
  }

  nextStep() {
    if(this.currentStep < this.stepsLength - 1) {
      let canProceed = true;
      if(this.currentStep === 0) {
        Object.values(this.createAccountGroup.controls).forEach(control => {
          if (control.invalid) {
            canProceed = false;
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
        if(canProceed) {
          this.currentStep += 1;
          this.setWindowSizeOnStep(this.currentStep);
        }
      } else if(this.currentStep === 1) {
        Object.values(this.contactInfoGroup.controls).forEach(control => {
          if (control.invalid) {
            canProceed = false;
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
        if(canProceed) {
          this.currentStep += 1;
          this.setWindowSizeOnStep(this.currentStep);
        }
      }
    } else {
      // else code here
    }
  }

  isFormValid() {
    return this.createAccountGroup.valid && this.contactInfoGroup.valid && this.eulaGroup.valid
  }

  setWindowSizeOnStep(step: number){
    switch(step) {
      case 0:
        this.windowHeight = 742; // 720 + 32
        this.windowsSize = {width: 727, height: this.windowHeight};
        this.setWindowSize();
        break;
      case 1:
        this.windowHeight = 653; // 571 + 32
        this.windowsSize = {width: 727, height: this.windowHeight};
        this.setWindowSize();
        break;
      case 2:
        this.windowHeight = 782; // 750 + 32
        this.windowsSize = {width: 727, height: this.windowHeight};
        this.setWindowSize();
        break;
      default:
        this.windowHeight = 792;
        this.windowsSize = {width: 727, height: this.windowHeight};
        this.setWindowSize();
    }
  }

  override ngOnDestroy(): void {
    this.countries = [];
  }

}
