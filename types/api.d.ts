/** 所有 api 接口的响应数据都应该准守该格式 */
interface ApiResponseData<T> {
  Data: T
  RetCode: number
  ErrorMsg: null
  Sign: null
  ApiKey: null
  IsSuccess: boolean
  NeedSign: boolean
}
