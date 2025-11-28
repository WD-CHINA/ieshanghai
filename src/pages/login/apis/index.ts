import type * as Auth from "./type"
import { request } from "@/http/axios"

/** 获取登录验证码 */
export function getCaptchaApi(params: { captchaId: string }) {
  return request<Auth.CaptchaResponseData>({
    url: `/api/Account.ReloadValidateCode/${params.captchaId}`,
    method: "get"
  })
}

/** 登录并返回 Token */
export function loginApi(data: Auth.LoginRequestData) {
  return request<Auth.LoginResponseData>({
    url: "/api/Account.Login",
    method: "post",
    data
  })
}
