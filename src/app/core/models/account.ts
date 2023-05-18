export class AccountRegister {
  userInput: UserInput = new UserInput();
  phoneNumber: string = '';
  userAddress: Address = new Address();
  timeZone: string = '';
  title: string = '';
  company: Company = new Company();
}

export class UserInput {
  name: string = '';
  surname: string = '';
  userName: string = '';
  emailAddress: string = '';
  password: string = '';
  captchaResponse: string = '';
}

export class Company {
  organizationName: string = '';
  address: Address = new Address();
  companySize: number = 0;
  creativeTeamSize: number = 0;
}

export class Address {
  id: number = 0;
  address1: string = '';
  address2: string = '';
  city: string = '';
  countryId: number = 0;
  postCode: number = 0;
}