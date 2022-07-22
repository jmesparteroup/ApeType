export interface newUser {
  email: string;
  firstName: string;
  lastName: string;
  userPassword: string;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    userPassword: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

export enum LoginState {
    LOGGED_IN,
    LOGGED_OUT,
}

export interface Login {
  state:LoginState
  user?:string;
  role?:string;
}
