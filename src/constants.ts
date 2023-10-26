import type { Ranking, Server } from "raiku-pgs/plugin"

import { parseLoadServer } from "./logic/parse-load-server"

export const CURL = "https://hentaivn.tv"
export const Rankings: Ranking[] = [
  {
    value: "ngay",
    match: "danh-sach.html?sort=0",
    name: {
      vi: "Ngày"
    }
  },
  {
    value: "week",
    match: "danh-sach.html?sort=1",
    name: {
      vi: "Tuần"
    }
  },
  {
    value: "month",
    match: "danh-sach.html?sort=2",
    name: { vi: "Tháng" }
  },
  {
    value: "all",
    match: "danh-sach.html?sort=3",
    name: { vi: "Tất" }
  },
  {
    value: "hot",
    match: "danh-sach.html?sort=4",
    name: { vi: "Thịnh hành" }
  }
]
export const Servers: Server[] = [
  {
    name: "Server 1",
    has: () => true,
    parse: (conf) => {
      return post({
        url: "https://hentaivn.tv/ajax_load_server.php",
        data: {
          server_id: conf.ep_id,
          server_type: "1"
        }
      }).then((res) =>
        parseLoadServer(res.data).map((item) =>
          AppInfo.extension ? `${item.src}#hentaivn_extra` : item.src
        )
      )
    }
  },
  {
    name: "Server 2",
    has: () => true,
    parse: (conf) => {
      return post({
        url: "https://hentaivn.tv/ajax_load_server.php",
        data: {
          server_id: conf.ep_id,
          server_type: "2"
        }
      }).then((res) =>
        parseLoadServer(res.data).map((item) =>
          AppInfo.extension ? `${item.src}#hentaivn_extra` : item.src
        )
      )
    }
  }
]
