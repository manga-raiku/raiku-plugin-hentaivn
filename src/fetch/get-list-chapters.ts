/* eslint-disable camelcase */
import type { API, Chapter, ID, RouteComicChap } from "raiku-pgs/plugin"
import { parseDate } from "raiku-pgs/plugin"

export function parserListChapters(
  html: string
): Awaited<ReturnType<API["getListChapters"]>> {
  // eslint-disable-next-line functional/no-throw-statements
  if (html.includes("404 Not Found</h1>")) throw new Error("not_found")

  const $ = parseDom(html)

  return $("tr")
    .toArray()
    .map((item): Chapter => {
      const $item = $(item)

      const name = normalizeChName($item.find("h2").text())

      const route = parseRouteComic(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $item.find("a").attr("href")!
      ) as RouteComicChap
      const id = route.params.sourceId
      const updated_at = parseDate($item.find("td").last().text())
      const views = null

      return {
        name,
        route,
        id,
        updated_at,
        views
      }
    })
}
export async function getListChapters(mangaId: ID, mangaParam: string) {
  const { data } = await get({
    url: `https://hentaivn.tv/list-showchapter.php?idchapshow=${mangaId}&idlinkanime=${mangaParam}`
  })

  return parserListChapters(data)
}
