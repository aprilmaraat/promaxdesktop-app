import { Address } from "./account";

export class Organization {
  id: number = 0;
  organizationName: string = '';
  licenseCount: number = 0;
  startDate: string = '';
  expirationDate: string = '';
  ownerID: number = 0;
  addressId: number = 0;
  size: number = 0;
  creativeTeamSize: number = 0;
  isActive: boolean = true;
  isTrial: boolean = true;
  owner: Owner = new Owner();
  address: Address = new Address();
}

export class Owner {
  id: number = 0;
  name: string = '';
  surname: string = ''; 
  userName: string = '';
}