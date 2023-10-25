import { defineApi } from "raiku-pgs/plugin"
import type { API, Comments, ID } from "raiku-pgs/plugin"
import { Rankings, Servers } from "src/constants"
import { index } from "src/fetch"
import { getComic } from "src/fetch/get-comic"
import { getComicChapter } from "src/fetch/get-comic-chapter"
import { getListChapters } from "src/fetch/get-list-chapters"
import { search } from "src/fetch/search"
import { searchQuickly } from "src/fetch/search-quickly"

class Plugin implements API {
  public readonly Rankings = Rankings
  public readonly Servers = Servers

  async setup() {
    if (AppInfo.extension) {
      await setReferrers({
        "#hentaivn": CURL
      })
    }
  }

  async index() {
    return index()
  }

  async getComic(zlug: string) {
    return getComic(zlug)
  }

  async getComicChapter<Fast extends boolean>(zlug: ID, chap: ID, fast: Fast) {
    return getComicChapter(zlug, chap, fast)
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getComicComments(
    comicId: number,
    orderByNews: boolean,
    chapterId = -1,
    parentId = 0,
    page: number,
    comicKey: string
  ) {
    return {
      comments: [],
      comments_count: 0,
      comments_pages: 0
    } as Comments
  }

  async getListChapters(mangaId: ID, mangaParam: string) {
    return getListChapters(mangaId, mangaParam)
  }

  searchQuickly(keyword: string, page: number) {
    return searchQuickly(keyword, page)
  }

  async search(keyword: string, page: number) {
    return search(keyword, page)
  }

  async getRanking(type: string, page: number) {
    const rank = Rankings.find((item) => item.value === type)
    if (!rank) throw new Error("not_found")

    return general(rank.match, page)
  }

  async getCategory(type: string, page: number) {
    const match = type.match(/-(\d+)$/)

    if (!match) throw new Error("not_found")

    return general(
      `the-loai-${type.slice(0, match.index)}-${match[1]}.html`,
      page
    )
  }
}

defineApi(Plugin)
