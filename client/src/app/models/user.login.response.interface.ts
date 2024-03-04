//Model to store the returned User Data after successful login in the backend
export interface UserLoginResponse {
  UserId: number;
  message: string;
  FirstName: string;
  LastName: string;
  Email: string;
  ProfilePictureUri: string;
  userRole: string;
  token: string;
  expiration: Date;
}
