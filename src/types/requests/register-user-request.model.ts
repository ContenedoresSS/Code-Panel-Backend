export interface RegisterUserRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  lastName: string;
  invitationCode?: string;
  identifier?: string;
}
