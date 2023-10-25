/* eslint-disable camelcase */
import type { API, MetaManga } from "raiku-pgs/plugin"

export async function index(): ReturnType<API["index"]> {
  const [hot, last_update] = await Promise.all([
    general("danh-sach.html?sort=4", 1),
    general("chap-moi.html", 1)
  ])

  return {
    sliders: hot.items.slice(0, 7),
    hot: hot.items.slice(7),
    last_update: last_update.items as MetaManga[]
  }
}
