import type * as Booking from "./type"
import { request } from "@/http/axios"

/** 获取活动预约列表 */
export function getBookingListApi(data: Booking.BookingListRequestData) {
  return request<Booking.BookingListResponseData>({
    url: "/Api/H5Api.Activity.GetBookingList",
    method: "post",
    data
  })
}

/** 审核活动预约 */
export function approveBookingApi(data: Booking.ApproveBookingRequestData) {
  return request<Booking.ApproveBookingResponseData>({
    url: "/Api/H5Api.Activity.ApproveBooking",
    method: "post",
    data
  })
}
