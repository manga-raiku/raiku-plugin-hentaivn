import type { General } from "raiku-pgs/plugin"

export function parserGeneral(html: string): General {
  // eslint-disable-next-line functional/no-throw-statements
  if (html.includes("404 Not Found</h1>")) throw new Error("not_found")

  const $ = parseDom(html)

  const name = $("h1.bar-title-list").text().replace("Danh sách truyện: ", "")
  const description = $(".block-item").eq(0).find("p").eq(0).text().trim()

  const curPage = parseInt($(".pagination > li > b").text().trim()) || 1
  const maxPage = parseInt($(".pagination > li").eq(-3).text().trim()) || 1

  const items = $(".main .block-item .item")
    .toArray()
    .map((item) => {
      const $item = $(item)

      return parseItem($, $item)
    })

  const filters: General["filters"] = []

  return { name, description, curPage, maxPage, items, filters }
}

export async function general(path: string, page: number) {
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  const url = new URL(path, CURL)
  url.searchParams.set("page", page.toString())

  // eslint-disable-next-line functional/no-let
  let cookie: string | undefined
  if (url.searchParams.get("sort")) {
    cookie =
      // eslint-disable-next-line no-sparse-arrays
      [
        "view=0&view0=1&view2=0&view3=0&view4=0view5=0",,

        "view=0&view0=0&view2=1&view3=0&view4=0view5=0",
        "view=0&view0=0&view2=0&view3=1&view4=0view5=0",
        "view=0&view0=0&view2=0&view3=0&view4=1view5=0",
        "view=0&view0=0&view2=0&view3=0&view4=0view5=1"
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      ][parseInt(url.searchParams.get("sort") + "")] ??
      "view=1&view0=0&view2=0&view3=0&view4=0view5=0"
  }
  // now scam
  const { data } = await get({
    url: url.href,
    headers: cookie ? { "c-cookie": cookie } : undefined
  })

  return parserGeneral(data)
}
