import type { RouteComic, RouteComicChap } from "raiku-pgs/plugin"

const docTruyenRegex = /\d+-doc-truyen-/i
const xemTruyenRegex = /\d+-\d+-xem-truyen-/i

export function parseRouteComic(
  url: string,
  comicUrl?: string
): RouteComic | RouteComicChap {
  url = removeExt(url)

  if (docTruyenRegex.test(url)) {
    const match = url.match(/\/(\d+)-doc-truyen-(.+)$/i)

    if (!match || !match[1] || !match[2])
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error("Invalid URL")

    return {
      name: "comic",
      params: {
        sourceId,
        comic: `${match[2]}-${match[1]}`
      }
    }
  } else if (xemTruyenRegex.test(url)) {
    const match = url.match(
      /\/(\d+)-(\d+)-xem-truyen-(.*?)(?:(?:-chap-(\d+))|(?:-(oneshot(?:-.*)?)?))?$/i
    )
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types, functional/no-let
    let chapNameWithComicUrl: string = ""

    if (
      !match ||
      !match[1] ||
      !match[2] ||
      !match[3] ||
      (!match[4] &&
        !match[5] &&
        (!comicUrl ||
          !(chapNameWithComicUrl = url
            .replace(removeExt(comicUrl), "")
            .slice(1))))
    ) {
      console.log("parse-route-comic: " + url)
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error("Invalid URL")
    }

    return {
      name: "comic chap",
      params: {
        sourceId,
        comic: `${match[3]}-${match[1]}`,
        chap: `${match[4] || match[5] || chapNameWithComicUrl}-i${match[2]}`
      }
    }
  }

  // eslint-disable-next-line functional/no-throw-statements
  throw new Error("Invalid URL")
}
