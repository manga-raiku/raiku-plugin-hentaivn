/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable camelcase */
import type { Chapter, ComicChapter, ID, RouteComic } from "raiku-pgs/plugin"
import { parseAnchor, parsePath } from "raiku-pgs/plugin"

import { getListChapters } from "./get-list-chapters"

export function parserComicChapter(html: string): ComicChapter {
  // eslint-disable-next-line functional/no-throw-statements
  if (html.includes("404 Not Found</h1>")) throw new Error("not_found")

  const $ = parseDom(html)

  const { name, path: pathManga } = parseAnchor($(".bar-title-episode a"))
  const $matchUrl = parsePath(
    // eslint-disable-next-line quotes
    $('meta[property="og:url"]').attr("content")!
  ).match(/\/(\d+)-(\d+)-.*/)

  // eslint-disable-next-line functional/no-throw-statements
  if (!$matchUrl?.[1] || !$matchUrl?.[2]) throw new Error("not_found")

  const [manga_id, ep_id] = [
    parseInt($matchUrl[1]).toString(),
    parseInt($matchUrl[2]).toString()
  ]
  const updated_at = new Date(
    html.match(/"dateModified": "([^\s]+)"/)![1]
  ).getTime()
  // eslint-disable-next-line quotes
  const image = $('meta[itemprop="image"]').attr("content")!
  const path_manga = parseRouteComic(pathManga) as RouteComic
  const pages = $("#image img")
    .toArray()
    .map((img) => {
      const $img = $(img)
      const src = $img.attr("data-src")!
      return { src }
    })

  const comments: ComicChapter["comments"] = []
  const comments_count = 0
  const comments_pages = 0

  return {
    name,
    manga_id,
    ep_id,
    updated_at,
    image,
    path_manga,
    pages,
    comments,
    comments_count,
    comments_pages
  }
}

/** @description can't sort arguments because compare old version */
export async function getComicChapter<Fast extends boolean>(
  zlug: ID,
  chap: ID,
  fast: Fast
): Promise<
  Fast extends true
    ? ComicChapter
    : ComicChapter & {
        readonly chapters: Chapter[]
      }
> {
  const match = zlug.match(/(\d+)$/)

  if (!match) throw new Error("not_found")

  const [mangaId, mangaParam] = [
    match[1],
    zlug.slice(0, ((match.index ?? -1) >>> 0) - 1)
  ]

  if (fast) {
    const { data } = await get({
      url: `https://hentaivn.tv/${mangaId}-${chap.slice(
        (chap.indexOf("-i") >>> 0) + 2
      )}-xem-truyen-${mangaParam}-chap-1.html`
    })

    return parserComicChapter(data) as Fast extends true
      ? ComicChapter
      : ComicChapter & {
          readonly chapters: Chapter[]
        }
  }

  const [comicChapter, chapters] = await Promise.all([
    getComicChapter(zlug, chap, true),
    getListChapters(match[1], mangaParam)
  ])
  return {
    ...comicChapter,
    chapters
  } as Fast extends true
    ? ComicChapter
    : ComicChapter & {
        readonly chapters: Chapter[]
      }
}
