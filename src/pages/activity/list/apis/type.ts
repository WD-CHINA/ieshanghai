/** 活动排期列表请求参数 */
export interface ActivityListRequestData {
  /** 公共文化空间编号, 0-全部 */
  SpaceId: number
  /** 空间区域编号, 0-全部 */
  FieldId: number
  /** 场地编号, 0-全部 */
  PlaceId: number
  /** 服务类型编号, 0-全部 */
  ServiceType: number
  /** 是否可预约: 0-全部, 1-预约活动, 2-常规活动, 4-团队活动 */
  CanBook: number
  /** 关键字 (活动名称) */
  Keyword: string
  /** 查询开始时间 (YYYY-MM-DD) */
  BeginTime: string
  /** 查询结束时间 (YYYY-MM-DD) */
  EndTime: string
  /** 页数 (从1开始) */
  page: number
  /** 每页行数 */
  limit: number
}

/** 活动排期列表响应数据 */
export type ActivityListResponseData = ApiResponseData<{
  count: number
  list: ActivityItem[]
}>

/** 活动项 */
export interface ActivityItem {
  /** 活动排期编号 */
  Id: number
  /** 文化空间编号 */
  SpaceId: number
  /** 文化空间名称 */
  SpaceName: string
  /** 文化空间地址 */
  SpaceAddress: string
  /** 场地编号 */
  PlaceId: number
  /** 场地名称 */
  PlaceName: string
  /** 场地英文名称 */
  PlaceNameEn: string
  /** 场地简称 */
  PlaceNameAbb: string
  /** 服务项目编号 */
  ServiceId: number
  /** 服务项目名称 */
  ServiceName: string
  /** 服务项目英文名称 */
  ServiceNameEn: string
  /** 服务类别编号 */
  ServiceType: number
  /** 服务类别名称 */
  ServiceTypeName: string
  /** 活动排期名称 */
  ActName: string
  /** 活动排期英文名称 */
  ActNameEn: string
  /** 排期方式枚举: 1-自动生成, 2-手动排期, 9-其他 */
  ScheduleType: number
  /** 排期方式名称 */
  ScheduleTypeName: string
  /** 活动开始日期时间 (YYYY-MM-DD HH:mm:ss) */
  BeginDateTime: string
  /** 活动结束日期时间 (YYYY-MM-DD HH:mm:ss) */
  EndDateTime: string
  /** 活动时长 (分钟) */
  LengthMinutes: number
  /** 活动开始日期 (YYYY-MM-DD) */
  BeginDate: string
  /** 活动开始时间 (HH:mm:ss) */
  BeginTime: string
  /** 活动结束日期 (YYYY-MM-DD) */
  EndDate: string
  /** 活动结束时间 (HH:mm:ss) */
  EndTime: string
  /** 活动时间范围 (YYYY-MM-DD HH:mm:ss～HH:mm:ss) */
  ActTime: string
  /** 活动预约类型枚举: 1-预约, 2-常规, 4-团队 */
  CanBook: number
  /** 活动预约类型名称 */
  CanBookName: string
  /** 最大可预约数量 */
  CanBookQty: number
  /** 已预约数量 */
  BookedQty: number
  /** 单用户可预约数量 */
  UserCanBookQty: number
  /** 预约开始时间 (YYYY-MM-DD HH:mm:ss) */
  BookBeginTime: string
  /** 预约结束时间 (YYYY-MM-DD HH:mm:ss) */
  BookEndTime: string
  /** 预约概要 */
  BookSituation: string
  /** 预约说明 */
  BookComment: string
  /** 活动简介 */
  Brief?: string
  /** 活动简介英文 */
  BriefEn?: string
  /** 活动图片地址 */
  ImgUrl: string
  /** 预计服务人次 */
  ExpectPeople: number
  /** 实际服务人次 */
  ActualPeople: number
  /** 活动状态枚举: 1-待审核, 2-待修改, 3-按计划, 4-已完成, 5-已下架, 6-已取消, 7-已作废 */
  ActStatus: number
  /** 活动状态名称 */
  ActStatusName: string
}

/** 提交活动排期请求参数 */
export interface SubmitActivityRequestData {
  /** 活动排期编号, 0-新增 */
  Id: number
  /** 活动名称 */
  ActName: string
  /** 活动名称英文 */
  ActNameEn: string
  /** 服务类别编号 */
  ServiceType: number
  /** 场地编号 */
  PlaceId: number
  /** 活动开始时间 (YYYY-MM-DD HH:mm:ss) */
  BeginTime: string
  /** 活动结束时间 (YYYY-MM-DD HH:mm:ss) */
  EndTime: string
  /** 活动时长 (分钟) */
  LengthMinutes: number
  /** 预计服务人次 */
  ExpectPeople: number
  /** 活动简介 */
  Brief: string
  /** 活动简介英文 */
  BriefEn: string
  /** 活动类型: 1-预约, 2-常规, 4-团队 */
  CanBook: number
  /** 最大可预约数量 (非预约活动传0) */
  CanBookQty: number
  /** 单用户最大可预约数量 (非预约活动传0) */
  UserCanBookQty: number
  /** 预约开始时间 (非预约活动传空字符串) */
  BookBeginTime: string
  /** 预约结束时间 (非预约活动传空字符串) */
  BookEndTime: string
  /** 预约说明 */
  BookComment: string
  /** 列表图 (图片上传接口返回的 FileName, 未上传传空字符串) */
  ListImg: string
  /** 展示图 (图片上传接口返回的 FileName, 未上传传空字符串) */
  ShowImg: string
}

/** 提交活动排期响应数据 */
export type SubmitActivityResponseData = ApiResponseData<{
  ActivityId: number
}>

/** 场地项 */
export interface PlaceItem {
  Id: number
  BuildName: string
  FieldName: string
  Floor: number
  RoomNo: string
  Name: string
  NameEn: string
  NameAbb: string
}

/** 服务类型项 */
export interface ServiceTypeItem {
  Id: number
  TypeName: string
  TypeCode: string
}
