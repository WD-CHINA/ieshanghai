import type * as Activity from "./type"
import { request } from "@/http/axios"

/** 获取活动排期列表 */
export function getActivityListApi(data: Activity.ActivityListRequestData) {
  return request<Activity.ActivityListResponseData>({
    url: "/Api/H5Api.Activity.GetActivityList",
    method: "post",
    data
  })
}

/** 获取活动排期详情 */
export function getActivityDetailApi(data: { Id: number }) {
  return request<ApiResponseData<Activity.ActivityItem>>({
    url: "/Api/H5Api.Activity.GetActivityDetail",
    method: "post",
    data
  })
}

/** 提交活动排期 */
export function submitActivityApi(data: Activity.SubmitActivityRequestData) {
  return request<Activity.SubmitActivityResponseData>({
    url: "/Api/H5Api.Activity.SubmitActivity",
    method: "post",
    data
  })
}

/** 获取场地列表 */
export function getPlaceListApi(data: { SpaceId: number, FieldId: number, Usage: string }) {
  return request<ApiResponseData<{ PlaceList: Activity.PlaceItem[] }>>({
    url: "/Api/H5Api.Place.GetPlaceList",
    method: "post",
    data
  })
}

/** 获取服务类型列表 */
export function getServiceTypeListApi(data: { SpaceId: number }) {
  return request<ApiResponseData<{ ServiceTypeList: Activity.ServiceTypeItem[] }>>({
    url: "/Api/H5Api.Place.GetServiceTypeList",
    method: "post",
    data
  })
}
