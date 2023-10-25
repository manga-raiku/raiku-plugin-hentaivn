import type { RouteGenre } from "raiku-pgs/plugin"

const r = /\/the-loai-(\d+)-(.+)$/i
export function parseRouteGenre(url: string): RouteGenre {
  url = removeExt(url)

  const match = url.match(r)

  if (!match || !match[1] || !match[2])
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error("Invalid URL")

  return {
    name: "genre",
    params: {
      sourceId,
      type: `${match[2]}-${match[1]}`
    }
  }
}
