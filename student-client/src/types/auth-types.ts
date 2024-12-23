
export type LoginUserType = {
    email: string;
    password: string;
}
export type SignupUserType =  {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
}

export type SignupUserErrorsType ={
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    confirm_password?: string;
}

export type SuccessfullAuthResponse = {
    access_token: string;
    refresh_token: string;
    message: string;
    status: string;
}