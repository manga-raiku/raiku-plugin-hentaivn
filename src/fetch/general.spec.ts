import { expectFile } from "../../test/setup-file"

describe("general", () => {
  test("/danh-sach.html", () => {
    expectFile("danh-sach", parserGeneral)
  })

  test("/chap-moi", () => {
    expectFile("chap-moi", parserGeneral)
  })
})
