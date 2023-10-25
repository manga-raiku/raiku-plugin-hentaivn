import { join } from "path"

import AutoImport from "unplugin-auto-import/vite"
import { defineConfig } from "vite"

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      package: join(__dirname, "package.ts"),
      plugin: join(__dirname, "plugin.ts"),
      "package.json": join(__dirname, "package.json"),
      src: join(__dirname, "src"),
      constants: join(__dirname, "./src/constants")
    }
  },
  define: {
    __NOW__: Date.now()
  },
  plugins: [
    AutoImport({
      dirs: ["./src/logic", "./src/fetch"],
      imports: [
        {
          "raiku-pgs/plugin": [
            "parseTimeAgo",
            "normalizeChName",
            "removeExt",
            "parseQuery"
          ],
          package: ["sourceId"],
          constants: ["CURL"]
        }
      ]
    })
  ]
})
