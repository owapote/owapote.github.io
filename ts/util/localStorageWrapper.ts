export function GetLocalStorage<T extends number | string | boolean>(key: string, defaultValue: T): T{
    const item = localStorage.getItem(key);
    if(item == null) return defaultValue;

    if(typeof defaultValue === "number"){
        const num = Number(item);
        if(Number.isFinite(num)) return num as T;   //有限か否か
        return defaultValue;
    }
    if(typeof defaultValue === "boolean"){
        const str = item.trim().toLowerCase();
        if(str === "true")  return true  as T;
        if(str === "false") return false as T;
        return defaultValue;
    }
    return item as T;
}

export function SetLocalStorage<T extends number | string | boolean>(key: string, value: T): void{
    if(typeof value === "number"){
        localStorage.setItem(key, String(value));
        return;
    }
    if(typeof value === "string"){
        localStorage.setItem(key, value);
        return;
    }
    if(typeof value === "boolean"){
        localStorage.setItem(key, value ? "true" : "false");
        return;
    }
    throw new Error(`値を格納できませんでした：${typeof value}`);
}