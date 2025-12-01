import type { AxiosInstance, AxiosRequestConfig } from "axios"
import axios from "axios"
import { merge } from "lodash-es"
import { getH5SiteSession, removeH5SiteSession } from "@/common/utils/cache/cookies"

/** 创建请求实例 */
function createInstance() {
  // 创建一个 axios 实例命名为 instance
  const instance = axios.create()
  // 请求拦截器
  instance.interceptors.request.use(
    // 发送之前
    (config) => {
      const h5SiteSession = getH5SiteSession()
      if (h5SiteSession) {
        config.headers.set("s-auth-session", h5SiteSession)
      }
      return config
    },
    // 发送失败
    error => Promise.reject(error)
  )
  // 响应拦截器（可根据具体业务作出相应的调整）
  instance.interceptors.response.use(
    (response) => {
      // apiData 是 api 返回的数据
      const apiData = response.data
      // 二进制数据则直接返回
      const responseType = response.request?.responseType
      if (responseType === "blob" || responseType === "arraybuffer") return apiData
      // 这个 code 是和后端约定的业务 code
      const IsSuccess = apiData.IsSuccess
      // 如果没有 code, 代表这不是项目后端开发的 api
      if (IsSuccess === undefined) {
        return Promise.reject(new Error("非本系统的接口"))
      }
      switch (IsSuccess) {
        case true:
          return apiData
        case false:
          removeH5SiteSession()
          return Promise.reject(apiData)
        default:
          // 不是正确的 code
          return Promise.reject(new Error(apiData.message || "Error"))
      }
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  return instance
}

/** 创建请求方法 */
function createRequest(instance: AxiosInstance) {
  return <T>(config: AxiosRequestConfig): Promise<T> => {
    // 默认配置
    const defaultConfig: AxiosRequestConfig = {
      // 接口地址
      baseURL: import.meta.env.VITE_BASE_URL,
      // 请求头
      headers: {
        "Content-Type": "application/json"
      },
      // 请求体
      data: {},
      // 请求超时
      timeout: 5000,
      // 跨域请求时是否携带 Cookies
      withCredentials: false
    }
    // 将默认配置 defaultConfig 和传入的自定义配置 config 进行合并成为 mergeConfig
    const mergeConfig = merge(defaultConfig, config)
    return instance(mergeConfig)
  }
}

/** 用于请求的实例 */
const instance = createInstance()

/** 用于请求的方法 */
export const request = createRequest(instance)
