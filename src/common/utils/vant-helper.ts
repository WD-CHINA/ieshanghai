/**
 * Vant 组件辅助工具
 */

/** Tag 组件的类型 */
export type TagType = "primary" | "success" | "danger" | "warning" | "default"

/** Button 组件的类型 */
export type ButtonType = "primary" | "success" | "danger" | "warning" | "default"

/** Button 组件的大小 */
export type ButtonSize = "large" | "normal" | "small" | "mini"

/** 活动状态枚举 */
export enum ActivityStatus {
  /** 待审核 */
  Pending = 1,
  /** 待修改 */
  ToModify = 2,
  /** 按计划 */
  AsPlanned = 3,
  /** 已完成 */
  Completed = 4,
  /** 已下架 */
  Offline = 5,
  /** 已取消 */
  Cancelled = 6,
  /** 已作废 */
  Voided = 7
}

/** 活动类型枚举 */
export enum ActivityType {
  /** 预约活动 */
  Booking = 1,
  /** 常规活动 */
  Regular = 2,
  /** 团队活动 */
  Team = 4
}

/** 场地使用状态枚举 */
export enum VenueUseStatus {
  /** 待审核 */
  Pending = 1,
  /** 已通过 */
  Approved = 2,
  /** 已拒绝 */
  Rejected = 3
}

/** 预约状态枚举 */
export enum BookingStatus {
  /** 待审核 */
  Pending = 0,
  /** 已通过 */
  Approved = 1,
  /** 已拒绝 */
  Rejected = 2,
  /** 已签到 */
  CheckedIn = 3,
  /** 未参加 */
  NoShow = 4
}

/**
 * 获取活动状态对应的标签类型
 * @param status 活动状态
 * @returns Tag 组件类型
 */
export function getActivityStatusTagType(status: number): TagType {
  const typeMap: Record<number, TagType> = {
    [ActivityStatus.Pending]: "warning",
    [ActivityStatus.ToModify]: "danger",
    [ActivityStatus.AsPlanned]: "success",
    [ActivityStatus.Completed]: "default",
    [ActivityStatus.Offline]: "default",
    [ActivityStatus.Cancelled]: "default",
    [ActivityStatus.Voided]: "default"
  }
  return typeMap[status] || "default"
}

/**
 * 获取活动状态颜色
 * @param status 活动状态
 * @returns 颜色值
 */
export function getActivityStatusColor(status: number): string {
  const colorMap: Record<number, string> = {
    [ActivityStatus.Pending]: "#ff976a",
    [ActivityStatus.ToModify]: "#ee0a24",
    [ActivityStatus.AsPlanned]: "#07c160",
    [ActivityStatus.Completed]: "#969799",
    [ActivityStatus.Offline]: "#969799",
    [ActivityStatus.Cancelled]: "#969799",
    [ActivityStatus.Voided]: "#969799"
  }
  return colorMap[status] || "#969799"
}

/**
 * 获取场地使用状态对应的标签类型
 * @param status 场地使用状态
 * @returns Tag 组件类型
 */
export function getVenueUseStatusTagType(status: number): TagType {
  const typeMap: Record<number, TagType> = {
    [VenueUseStatus.Pending]: "warning",
    [VenueUseStatus.Approved]: "success",
    [VenueUseStatus.Rejected]: "danger"
  }
  return typeMap[status] || "default"
}

/**
 * 获取场地使用状态颜色
 * @param status 场地使用状态
 * @returns 颜色值
 */
export function getVenueUseStatusColor(status: number): string {
  const colorMap: Record<number, string> = {
    [VenueUseStatus.Pending]: "#ff976a",
    [VenueUseStatus.Approved]: "#07c160",
    [VenueUseStatus.Rejected]: "#ee0a24"
  }
  return colorMap[status] || "#969799"
}

/**
 * 获取预约状态对应的标签类型
 * @param status 预约状态
 * @returns Tag 组件类型
 */
export function getBookingStatusTagType(status: number): TagType {
  const typeMap: Record<number, TagType> = {
    [BookingStatus.Pending]: "warning",
    [BookingStatus.Approved]: "success",
    [BookingStatus.Rejected]: "danger",
    [BookingStatus.CheckedIn]: "primary",
    [BookingStatus.NoShow]: "default"
  }
  return typeMap[status] || "default"
}
