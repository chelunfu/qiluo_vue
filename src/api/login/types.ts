export interface UserLoginType {
  username: string
  password: string
}

export interface UserType {
  username: string
  password: string
  role: string
  roleId: string
}

export interface UserLoginParamType {
  username: string
  password: string
  captchaid: string
  captcha: string
  client_id: string
}

export interface UserTokenType {
  token: string
  token_type: string
  exp: number
  exp_in: number
}

export interface UserInfoType {
  username: string
  nickname: string
  email: string
  phone: string
  avatar: string
}

export interface CodeData {
  captcha_on_off: boolean
  img: string
  uuid: string
}
