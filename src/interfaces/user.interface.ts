export interface INewUser {
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface IUserToken {
    id: string
    email: string
    isVerified: boolean
}