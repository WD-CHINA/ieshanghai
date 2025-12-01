// 统一处理 Cookie

import { CacheKey } from "@@/constants/cache-key"
import Cookies from "js-cookie"

export function setH5SiteSession(clinetMachineGuid: string) {
  return Cookies.set(CacheKey.CLINET_MACHINE_GUID, clinetMachineGuid)
}

export function getH5SiteSession() {
  return Cookies.get(CacheKey.CLINET_MACHINE_GUID)
}
export function removeH5SiteSession() {
  return Cookies.remove(CacheKey.CLINET_MACHINE_GUID)
}
