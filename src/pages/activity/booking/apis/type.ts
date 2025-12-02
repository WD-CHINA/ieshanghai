/** 活动预约列表请求参数 */
export interface BookingListRequestData {
  /** 活动排期编号 */
  ActivityId: number
  /** 页数 (从1开始) */
  page?: number
  /** 每页行数 */
  limit?: number
}

/** 活动预约列表响应数据 */
export type BookingListResponseData = ApiResponseData<{
  count: number
  list: BookingItem[]
}>

/** 活动预约项 */
export interface BookingItem {
  /** 预约记录编号 */
  Id: number
  /** 活动排期编号 */
  ActivityId: number
  /** 用户编号 */
  UserId: number
  /** 联系人 */
  ContactName: string
  /** 联系电话 */
  ContactPhone: string
  /** 预约人数 */
  BookQty: number
  /** 预约时间 (YYYY-MM-DD HH:mm:ss) */
  BookTime: string
  /** 预约备注 */
  BookRemark: string
  /** 预约状态: 0-待审核, 1-已通过, 2-已拒绝, 3-已签到, 4-未参加 */
  Status: number
  /** 预约状态名称 */
  StatusName: string
}

/** 活动预约审核请求参数 */
export interface ApproveBookingRequestData {
  /** 预约记录编号 */
  Id: number
  /** 审核动作: 1-通过, 2-拒绝 */
  Action: number
  /** 审核备注 */
  Remark?: string
}

/** 活动预约审核响应数据 */
export type ApproveBookingResponseData = ApiResponseData<null>
