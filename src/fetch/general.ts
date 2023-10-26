import type { FilterQuery, FilterURI, General } from "raiku-pgs/plugin"

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
      [
        "view=0;view0=0;view2=0;view3=0;view4=0;view5=1",
        "view=0;view0=0;view2=1;view3=0;view4=0;view5=0",
        "view=0;view0=0;view2=0;view3=1;view4=0;view5=0",
        "view=1;view0=0;view2=0;view3=0;view4=0;view5=0",
        "view=0;view0=1;view2=0;view3=0;view4=0;view5=0"
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      ][parseInt(url.searchParams.get("sort") + "")] ??
      "view=0;view0=0;view2=0;view3=0;view4=0;view5=1"
  }
  // now scam
  const [general, filters] = await Promise.all([
    get({
      url: url.href,
      headers: cookie ? { "c-cookie": cookie } : undefined
    }).then(({ data }) => parserGeneral(data)),
    post({
      url: `${CURL}/tag_box.php`,
      data: {
        tagid: "1"
      }
    }).then(({ data }): General["filters"] => {
      const $ = parseDom(data)

      return [
        <FilterURI>{
          type: "Thể loại",
          select: $("a")
            .toArray()
            .map((item) => {
              const $item = $(item)

              const name = $item.text().trim()
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const route = parseRouteGenre($item.attr("href")!)

              return { name, route }
            })
        },
        <FilterQuery>{
          type: "Sắp xếp",
          key: "sort",
          items: [
            {
              name: "Ngày",
              value: "0"
            },
            {
              name: "Tuần",
              value: "1"
            },
            {
              name: "Tháng",
              value: "2"
            },
            {
              name: "Tất",
              value: "3"
            },
            {
              name: "Thịnh hành",
              value: "4"
            }
          ]
        }
      ]
    })
  ])

  // eslint-disable-next-line functional/immutable-data
  return Object.assign(general, { filters })
}
