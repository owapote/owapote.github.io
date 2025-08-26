/**
 * jsonを取得する
 * @param url 
 * @returns fetchしたjson(型はT)
 */
export async function FetchJson<T>(
    url: string, 
): Promise<T>{
    const response = await fetch(url);
    if(!response.ok) throw new Error(`${response.status}Error ${url}の取得に失敗しました:${response.statusText}`);
    const data = await response.json() as T;
    return data;
}