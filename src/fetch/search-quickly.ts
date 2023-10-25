/* eslint-disable camelcase */
import type { QuicklyItem } from "raiku-pgs/plugin"

import { search } from "./search"

export function searchQuickly(
  keyword: string,
  page: number
): Promise<QuicklyItem[]> {
  return search(keyword, page).then((result) => {
    return result.items.map((item): QuicklyItem => {
      const { route, name, image, last_chapters, othername, tags } = item

      return {
        route,
        name,
        image,
        last_chapter: last_chapters[0].name,
        othername,
        tags
      }
    })
  })
}
