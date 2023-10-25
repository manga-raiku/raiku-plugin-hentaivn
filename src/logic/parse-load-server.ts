export function parseLoadServer(html: string) {
  const $ = parseDom(html)

  const pages = $("img")
    .toArray()
    .map((img) => {
      const $img = $(img)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const src = $img.attr("src")!
      return { src }
    })

  return pages
}
