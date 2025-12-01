export interface LoginRequestData {
  /** 账号 */
  Account: string
  /** 密码 */
  Password: string
  captchaVerifyParam: string
}

export type CaptchaResponseData = ApiResponseData<{ Img: string }>

export type LoginResponseData = ApiResponseData<{ Guid: string }>
