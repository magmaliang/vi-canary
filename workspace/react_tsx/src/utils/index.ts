/**
 * 获取query string的对象形式
 * @param url 
 * @returns 
 */
export function queryString2Data(url: string) {
  let queryString = url.split("?")[1], rst:any = {};
  if (queryString) {
    queryString.split("&").forEach(x => {
      let arr =  x.split("=");
      rst[arr[0]] = arr[1]
    })
  }

  return rst;
}