export function search(keyword: string, page: number) {
  return general(`tim-kiem-truyen.html?key=${keyword}`, page)
}
