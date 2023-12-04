import {
  author,
  description,
  homepage,
  name as id,
  pluginName as name,
  version
} from "package.json"
import { definePackage } from "raiku-pgs/plugin"

import favicon from "./favicon.png?inline"

export const sourceId = id
export const meta = definePackage({
  id,
  name,
  favicon,
  version,
  description,
  author,
  homepage,
  isNSFW: true,
  language: "vi",
  get support() {
    return AppInfo.extension || AppInfo.mode === "capacitor"
  },
  supportGetMode: true,
  updatedAt: import.meta.env.DEV ? Date.now() : __NOW__
})
