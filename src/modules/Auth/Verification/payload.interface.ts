export interface AuthPayload {
  username: string;
}

export interface UserAuthentication {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  isEmployeeManager: boolean;
}
