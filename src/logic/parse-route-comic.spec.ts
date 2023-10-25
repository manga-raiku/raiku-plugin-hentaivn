describe("parseRouteComic", () => {
  it("should parse valid docTruyen URL", () => {
    const url = "/1234-doc-truyen-example.html"
    const result = parseRouteComic(url)
    expect(result).toEqual({
      name: "comic",
      params: {
        sourceId,
        comic: "example-1234"
      }
    })
  })

  it("should parse valid xemTruyen URL", () => {
    const url = "/1234-5678-xem-truyen-example-chap-9.html"
    const result = parseRouteComic(url)
    expect(result).toEqual({
      name: "comic chap",
      params: {
        sourceId,
        comic: "example-1234",
        chap: "9-i5678"
      }
    })
  })

  it("should throw error for invalid URL", () => {
    const url = "/invalid-url"
    expect(() => parseRouteComic(url)).toThrow("Invalid URL")
  })

  it("should parse url not exists id chap", () => {
    expect(
      parseRouteComic(
        "/35005-64745-xem-truyen-the-gyaru-i-hang-out-with-lets-me-use-her-pussyme-use-her-pussy-oneshot-khong-che"
      )
    ).toEqual({
      name: "comic chap",
      params: {
        sourceId,
        comic:
          "the-gyaru-i-hang-out-with-lets-me-use-her-pussyme-use-her-pussy-35005",
        chap: "oneshot-khong-che-i64745"
      }
    })
  })
})
