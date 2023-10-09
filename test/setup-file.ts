/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { GetOption, Http, PostOption } from "client-ext-animevsub-helper"
import { parseDom } from "raiku-pgs/thread"

type Response<Type extends GetOption["responseType"]> = Omit<
  Awaited<ReturnType<typeof Http.get>>,
  "data"
> & {
  data: Type extends "json"
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    : Type extends "arraybuffer"
    ? ArrayBuffer
    : string
}
function get<
  ReturnType extends GetOption["responseType"] | undefined
>(
  options: Omit<GetOption, "responseType"> & {
    responseType?: ReturnType
  }
): Promise<Response<ReturnType>> {
  return fetch(
    options.url,
    {
      headers: options.headers
    }
  ).then(async (res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, functional/no-let
    let data: any
    switch (options.responseType) {
      case "arraybuffer":
        data = await res.arrayBuffer()
        break
      case "json":
        data = JSON.parse(await res.text())
        break
      default:
        data = await res.text()
    }
    return {
      data,
      status: res.status,
      headers: Object.fromEntries([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(res.headers as unknown as any).entries()
      ]),
      url: res.url
    }
  })
}

export function post<
  ReturnType extends GetOption["responseType"] | undefined
>(
  options: Omit<PostOption, "responseType"> & {
    responseType?: ReturnType
  }
): Promise<Response<ReturnType>> {
  return fetch(options.url,
    {
      method: "post",
      headers: options.headers
    }
  ).then(async (res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, functional/no-let
    let data: any
    switch (options.responseType) {
      case "arraybuffer":
        data = await res.arrayBuffer()
        break
      case "json":
        data = JSON.parse(await res.text())
        break
      default:
        data = await res.text()
    }
    return {
      data,
      status: res.status,
      headers: Object.fromEntries([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(res.headers as unknown as any).entries()
      ]),
      url: res.url
    }
  })
}

// eslint-disable-next-line functional/immutable-data
Object.assign(self, { parseDom, get, post })
