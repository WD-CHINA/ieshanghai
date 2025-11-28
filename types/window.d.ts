/** 阿里云验证码配置 */
interface AliyunCaptchaConfig {
  /** 场景ID。通过步骤一添加验证场景后，您可以在验证码场景列表，获取该场景的场景ID */
  SceneId: string
  /** 必填，身份标。开通阿里云验证码2.0后，您可以在控制台概览页面的实例基本信息卡片区域，获取身份标 */
  prefix: string
  /** 验证码模式。embed表示要集成的验证码模式为嵌入式 */
  mode: "embed"
  /** 页面上预留的渲染验证码的元素，与原代码中预留的页面元素保持一致 */
  element: string
  /** 触发业务请求的元素。button表示单击登录按钮后，触发captchaVerifyCallback函数 */
  button: string
  /** 业务请求(带验证码校验)回调函数 */
  captchaVerifyCallback: (data: string) => void
  /** 业务请求结果回调函数 */
  onBizResultCallback: () => void
  /** 绑定验证码实例函数 */
  getInstance: () => void
  /** 滑块验证码样式，支持自定义宽度和高度，单位为px。其中，width最小值为320 px */
  slideStyle: {
    width: number
    height: number
  }
  /** 验证码语言类型，支持简体中文（cn）、繁体中文（tw）、英文（en） */
  language: "cn" | "tw" | "en"
  /** 完成验证后，是否立即发送验证请求（调用captchaVerifyCallback函数） */
  immediate: boolean
}

declare global {
  interface Window {
    /** 初始化阿里云验证码 */
    initAliyunCaptcha?: (config: AliyunCaptchaConfig) => Promise<void>
  }
}

export {}
