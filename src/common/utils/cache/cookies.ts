// 统一处理 Cookie

import { CacheKey } from "@@/constants/cache-key"
import Cookies from "js-cookie"

export function setClinetMachineGuid(clinetMachineGuid: string) {
  return Cookies.set(CacheKey.CLINET_MACHINE_GUID, clinetMachineGuid)
}

export function getClinetMachineGuid() {
  return Cookies.get(CacheKey.CLINET_MACHINE_GUID)
}
