export interface GetFieldListRequestData {
  /** 空间ID */
  SpaceId: string
}

export type GetFieldListResponseData = ApiResponseData<{ FieldList: any[] }>
