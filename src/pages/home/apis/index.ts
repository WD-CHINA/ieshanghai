import type * as Auth from "./type"

import { request } from "@/http/axios"

export function getFieldListApi(data: Auth.GetFieldListRequestData) {
  return request<Auth.GetFieldListResponseData>({
    url: "/Api/H5Api.Place.GetFieldList",
    method: "post",
    data
  })
}
