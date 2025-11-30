# API 接口规范

## 接口域名

### 基础域名

- **生产环境**: `smelapi.ieshanghai.cn/Api/`
- **开发环境**: 通过 Vite 代理 `/Api` 转发到生产域名

> 注意：接口域名会根据关联的文化空间做相应修改

## 接口通用规范

### 1. 请求方式

- **所有接口均使用 POST 请求**
- 除图片上传和视频上传等特定接口外，参数传递均使用 **JSON 格式**

### 2. 接口地址格式

```
[接口域名] + [接口名]
示例: http://smelapi.ieshanghai.cn/Api/H5Api.Account.Login
```

### 3. 请求头配置

```typescript
{
  "Content-Type": "application/json",
  "s-auth-session": "用户 session (登录后接口必填)"
}
```

### 4. 认证机制

- 登录接口返回 `Guid` 字段作为用户 session
- 需要登录的接口在请求头中携带 `s-auth-session`
- Session 通过 Cookies 存储和管理

## 响应数据结构

### 标准响应格式

```typescript
interface ApiResponseData<T = any> {
  Result: boolean // 调用结果: true-成功, false-失败
  Message: string // 提示信息
  NeedLogin?: boolean // 是否需要登录 (部分接口返回)
  Data?: T // 业务数据 (成功时返回)
  [key: string]: any // 其他业务字段
}
```

### 响应处理规则

- `IsSuccess === true`: 接口调用成功，返回数据
- `IsSuccess === false`: 接口调用失败，清除 session 并跳转登录
- `IsSuccess === undefined`: 非本系统接口，抛出错误

## 接口清单

### 用户认证相关

#### 1. 用户登录

- **接口名**: `H5Api.Account.Login`
- **需要登录**: 否
- **请求参数**:

```typescript
interface LoginRequestData {
  Account: string // 账号 (手机号/用户名)
  Password: string // 密码
  captchaVerifyParam: string // 阿里云图形验证服务参数
}
```

- **返回参数**:

```typescript
interface LoginResponseData {
  Result: boolean
  Message: string
  captchaResult: boolean // 图形验证结果
  Guid?: string // 用户 session (成功时返回)
}
```

#### 2. 用户登出

- **接口名**: `H5Api.Account.LoginOut`
- **需要登录**: 是
- **请求参数**: 无
- **返回参数**: 标准响应格式

### 基础数据相关

#### 3. 获取空间区域列表

- **接口名**: `H5Api.Place.GetFieldList`
- **需要登录**: 是
- **请求参数**:

```typescript
{
  SpaceId: number // 公共文化空间编号, 0-全部
}
```

- **返回数据**:

```typescript
{
  FieldList: Array<{
    Id: number // 区域编号
    FieldName: string // 区域名称
  }>
}
```

#### 4. 获取场地列表

- **接口名**: `H5Api.Place.GetPlaceList`
- **需要登录**: 是
- **请求参数**:

```typescript
{
  SpaceId: number // 公共文化空间编号, 0-全部
  FieldId: number // 空间区域编号, 0-全部
  Usage: string // 用途: Activity-活动排期, PlaceUse-场地使用, All-全部
}
```

- **返回数据**:

```typescript
{
  PlaceList: Array<{
    Id: number // 场地编号
    BuildName: string // 楼名
    FieldName: string // 空间区域名称
    Floor: number // 楼层
    RoomNo: string // 房间号
    Name: string // 场地名称
    NameEn: string // 英文名称
    NameAbb: string // 简称
  }>
}
```

#### 5. 获取服务类型列表

- **接口名**: `H5Api.Place.GetServiceTypeList`
- **需要登录**: 是
- **请求参数**:

```typescript
{
  SpaceId: number // 公共文化空间编号, 0-全部
}
```

- **返回数据**:

```typescript
{
  ServiceTypeList: Array<{
    Id: number // 服务类型编号
    TypeName: string // 服务类型名称
    TypeCode: string // 服务类型编码
  }>
}
```

### 活动排期相关

#### 6. 活动排期列表查询

- **接口名**: `H5Api.Activity.GetActivityList`
- **需要登录**: 是
- **请求参数**:

```typescript
{
  SpaceId: number // 公共文化空间编号, 0-全部
  FieldId: number // 空间区域编号, 0-全部
  PlaceId: number // 场地编号, 0-全部
  ServiceType: number // 服务类型编号, 0-全部
  CanBook: number // 是否可预约: 0-全部, 1-预约活动, 2-常规活动, 4-团队活动
  Keyword: string // 关键字 (活动名称)
  BeginTime: string // 查询开始时间 (YYYY-MM-DD)
  EndTime: string // 查询结束时间 (YYYY-MM-DD)
  page: number // 页数 (从1开始)
  limit: number // 每页行数
}
```

- **返回数据**: 参考接口文档 3.9.3 节

#### 7. 获取活动排期详情

- **接口名**: `H5Api.Activity.GetActivityDetail`
- **需要登录**: 是
- **请求参数**:

```typescript
{
  Id: number // 活动排期编号
}
```

- **返回数据**: 参考接口文档 3.10.3 节

#### 8. 活动排期数据提交

- **接口名**: `H5Api.Activity.SubmitActivity`
- **需要登录**: 是
- **请求参数**:

```typescript
{
  Id: number // 活动排期编号, 0-新增
  ActName: string // 活动名称
  ActNameEn: string // 活动名称英文
  ServiceType: number // 服务类别
  PlaceId: number // 场地编号
  BeginTime: string // 活动开始时间 (YYYY-MM-DD HH:mm:ss)
  EndTime: string // 活动结束时间 (YYYY-MM-DD HH:mm:ss)
  LengthMinutes: number // 活动时长 (分钟)
  ExpectPeople: number // 预计服务人次
  Brief: string // 活动简介
  BriefEn: string // 活动简介英文
  CanBook: number // 活动类型: 1-预约, 2-常规, 4-团队
  CanBookQty: number // 最大可预约数量 (非预约活动传0)
  UserCanBookQty: number // 单用户最大可预约数量 (非预约活动传0)
  BookBeginTime: string // 预约开始时间 (非预约活动传空字符串)
  BookEndTime: string // 预约结束时间 (非预约活动传空字符串)
  BookComment: string // 预约说明
  ListImg: string // 列表图 (图片上传接口返回的 FileName)
  ShowImg: string // 展示图 (图片上传接口返回的 FileName)
}
```

- **返回数据**:

```typescript
{
  ActivityId: number // 活动编号 (成功时返回)
}
```

### 待补充接口

以下接口暂未提供详细说明，待后续补充：

- 图片上传接口
- 视频上传接口
- 活动排期审核接口
- 活动预约列表查询接口
- 活动预约审核接口
- 活动实录提交接口
- 场地使用列表查询接口
- 获取场地使用详情接口
- 场地使用数据提交接口
- 场地使用审核接口

## 接口调用示例

### 1. API 定义 (apis/index.ts)

```typescript
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

/** 提交活动排期 */
export function submitActivityApi(data: Activity.SubmitActivityRequestData) {
  return request<Activity.SubmitActivityResponseData>({
    url: "/Api/H5Api.Activity.SubmitActivity",
    method: "post",
    data
  })
}
```

### 2. 类型定义 (apis/type.ts)

```typescript
/** 活动排期列表请求参数 */
export interface ActivityListRequestData {
  SpaceId: number
  FieldId: number
  PlaceId: number
  ServiceType: number
  CanBook: number
  Keyword: string
  BeginTime: string
  EndTime: string
  page: number
  limit: number
}

/** 活动排期列表响应数据 */
export type ActivityListResponseData = ApiResponseData<{
  count: number
  list: ActivityItem[]
}>

/** 活动项 */
export interface ActivityItem {
  Id: number
  ActName: string
  BeginDateTime: string
  EndDateTime: string
  PlaceName: string
  CanBook: number
  ActStatus: number
  // ... 其他字段
}
```

### 3. 组件中使用

```typescript
<script setup lang="ts">
import { getActivityListApi } from "./apis"

const loading = ref(false)
const activityList = ref([])

const fetchActivityList = async () => {
  try {
    loading.value = true
    const res = await getActivityListApi({
      SpaceId: 0,
      FieldId: 0,
      PlaceId: 0,
      ServiceType: 0,
      CanBook: 0,
      Keyword: "",
      BeginTime: "2025-01-01",
      EndTime: "2025-12-31",
      page: 1,
      limit: 20
    })
    activityList.value = res.list
  }
  catch (error) {
    console.error("获取活动列表失败", error)
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchActivityList()
})
</script>
```

## 错误处理

### 1. 网络错误

- 显示友好的错误提示
- 使用 Vant 的 Toast 或 Dialog 组件

### 2. 登录过期

- 后端返回 `IsSuccess: false` 时自动清除 session
- 跳转到登录页

### 3. 业务错误

- 根据 `Message` 字段显示错误信息
- 特定业务场景需要特殊处理

## 日期格式规范

- **日期**: `YYYY-MM-DD` (如：2025-11-29)
- **日期时间**: `YYYY-MM-DD HH:mm:ss` (如：2025-11-29 14:30:00)
- **时间**: `HH:mm:ss` (如：14:30:00)

使用 Day.js 进行日期处理和格式化。
