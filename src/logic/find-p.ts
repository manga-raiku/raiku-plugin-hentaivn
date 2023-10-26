import type { CheerioAPI, Element } from "cheerio"

export function findP($: CheerioAPI, p: Element[], text: string) {
  const $parent = $(
    p.find((p) => {
      return $(p).find(".info").text().trim().toLowerCase() === text
    })
  )

  $parent.find(".info").eq(0).remove()

  return $parent
}
