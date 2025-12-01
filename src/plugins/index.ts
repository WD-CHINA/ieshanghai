import type { App } from "vue"
import { installConsole } from "./console"
import { installI18n } from "./i18n"

export function installPlugins(app: App) {
  installConsole()
  installI18n(app)
}
