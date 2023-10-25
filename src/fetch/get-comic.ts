/* eslint-disable camelcase */
import type { Comic, RouteAuthor } from "raiku-pgs/plugin"
import { parseAnchor, parseDate } from "raiku-pgs/plugin"
import { findP } from "src/logic/find-p"

import { getListChapters } from "./get-list-chapters"

export function parserComic(html: string): Comic {
  // eslint-disable-next-line functional/no-throw-statements
  if (html.includes("404 Not Found</h1>")) throw new Error("not_found")

  const $ = parseDom(html)

  const $name = $("h1[itemprop=name]").text().trim()
  const name = $name.slice(0, $name.lastIndexOf("-") >>> -1)
  const $ps = $(".page-info > p").toArray()

  const othername = findP($, $ps, "tên khác:").text().trim()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const manga_id = parseInt($("#myInputxx").attr("value")!).toString()
  const updated_at = parseDate($(".page-info > span").last().find("i").text())
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const image = $("img[rel=image_src]").attr("src")!
  const author: Comic["author"] = findP($, $ps, "tác giả:")
    .find("a")
    .toArray()
    .map((anchor) => {
      const { name, path } = parseAnchor($(anchor))
      const route: RouteAuthor = {
        name: "author",
        params: {
          sourceId,
          type: removeExt(path.slice(path.indexOf("=") + 1))
        }
      }

      return { name, route }
    })
  const status = findP($, $ps, "tình trạng:").text()
  const genres = findP($, $ps, "thể loại:")
    .find("a")
    .toArray()
    .map((anchor) => {
      const $item = $(anchor)

      const { name, path } = parseAnchor($item)
      const route = parseRouteGenre(path)
      const description = $item.attr("title") ?? undefined

      return { name, route, description }
    })
  const views = parseInt(findP($, $ps, "lượt xem:").text().replace(/\./g, ""))
  const rate = { cur: 0, max: 0, count: 0 }
  const follows = null
  const likes = parseInt($(".but_like").text().replace(/\./g, ""))
  const description = findP($, $ps, "nội dung:").next().html()?.trim() ?? ""
  const chapters: Comic["chapters"] = []
  const comments: Comic["comments"] = []
  const comments_count = 0
  const comments_pages = 0

  return {
    name,
    othername,
    manga_id,
    updated_at,
    image,
    author,
    status,
    genres,
    views,
    rate,
    follows,
    likes,
    description,
    chapters,
    comments,
    comments_count,
    comments_pages
  }
}

// zlug example: https://zlug-id-comic-123
// restore to https://123-zlug-id-comic

export async function getComic(zlug: string): Promise<Comic> {
  const match = zlug.match(/(\d+)$/)

  if (!match) throw new Error("not_found")

  zlug =
    match[1] + "-doc-truyen-" + zlug.slice(0, ((match.index ?? -1) >>> 0) - 1)

  // now scam
  const [comic, chapters] = await Promise.all([
    get({
      url: `${CURL}/${zlug}.html`
    }).then(({ data }) => parserComic(data)),
    getListChapters(match[1], zlug.slice(match[1].length + 1))
  ])
  // eslint-disable-next-line functional/immutable-data
  Object.assign(comic, { chapters })

  return comic
}
