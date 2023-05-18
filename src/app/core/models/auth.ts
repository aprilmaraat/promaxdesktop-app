export interface AuthRequest {
  userNameOrEmailAddress: string,
  password: string,
  rememberClient: boolean,
  isFromDesktopApp: boolean
}

export class AuthResponse {
  accessToken: string = '';
  encryptedAccessToken: string = '';
  expireInSeconds: number = 0;
  userId: number = 0;
  userLicences: UserLicense[] = [];
  user: UserResponse = new UserResponse();
}

export class UserLicense {
  licenseKey: string = '';
  organizationId: number = 0;
  organizationName: string = '';
}

export class UserResponse {
  emailAddress: string = '';
  name: string = '';
  surname: string = '';
  userName: string = '';
}