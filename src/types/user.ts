export interface IUser {
  _id?: string
  image: string
  name: string;
  email: string;
  password?: string;
  role?: EUserRole;

  emailVerified?:boolean

  isActive?: boolean;
  lastLogin?: Date;
  resetPasswordExpires?: Date;

  createdAt?: string;
  updatedAt?: string;
}

export enum EUserRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  PLAYER = 'player',
  GUEST = 'guest',
}
export enum EUserAccount {
  CREDENTIALS = 'credentials',
  GOOGLE = 'google',
}
 
