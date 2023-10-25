/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Cheerio, CheerioAPI, Element } from "cheerio"
import { parseAnchor, parseNumber } from "raiku-pgs/plugin"
import type {
  Chapter,
  Genre,
  MetaManga,
  RouteComic,
  RouteComicChap
} from "raiku-pgs/plugin"

import { findP } from "./find-p"
import { parseRouteGenre } from "./parse-route-genre"
// Cuc Tinh Y
// Tawawa

export function parseItem($: CheerioAPI, $item: Cheerio<Element>): MetaManga {
  const route = parseRouteComic(
    $item.find("a").eq(0).attr("href")!
  ) as RouteComic
  const image = $item.find("img").attr("data-srcset")!

  const $box = $item.find(".box-description")

  const name = $box.find("a").eq(0).text().trim()
  const ps = $box.find("p").toArray()
  const othername = findP($, ps, "tên khác:").text().trim()
  const tags: Genre[] = findP($, ps, "thể loại:")
    .find(".tag")
    .toArray()
    .map((item) => {
      const $item = $(item)

      const { name, path } = parseAnchor($item)

      const route = parseRouteGenre(path)
      const description = $item.attr("title")

      return { route, name, description }
    })
  const status = null
  const author = null
  const description = ""
  const $last = parseRouteComic(
    $box.find("a").eq(1).attr("href")!,
    $box.find("a").eq(0).attr("href")
  ) as RouteComicChap
  // eslint-disable-next-line camelcase
  const last_chapters: Chapter[] = [
    {
      route: $last,
      name: normalizeChName($box.find("a").eq(1).text()),
      id: $last.params.chap,
      updated_at: null,
      views: null
    }
  ]
  const views = parseNumber(
    findP($, ps, "lượt xem:").text().match(/(\d+)/)?.[1] ?? "0"
  )
  const comments = null
  const likes = parseNumber(
    findP($, ps, "like:").text().match(/(\d+)/)?.[1] ?? "0"
  )
  const label = null

  return {
    route,
    image,
    name,
    othername,
    tags,
    status,
    author,
    description,
    // eslint-disable-next-line camelcase
    last_chapters,
    views,
    comments,
    likes,
    label
  }
}
