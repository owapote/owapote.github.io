export const UserSaveDataValues = {
    Language: "userLanguage",
    ColorTheme: "userColorTheme",
    NowContent: "nowContent",
}as const;
type UserSaveData = typeof UserSaveDataValues[keyof typeof UserSaveDataValues];

export function GetLocalStorage<T extends number | string | boolean>(userSaveData: UserSaveData, defaultValue: T): T{
    const item = localStorage.getItem(userSaveData);
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

export function SetLocalStorage<T extends number | string | boolean>(userSaveData: UserSaveData, value: T): void{
    if(typeof value === "number"){
        localStorage.setItem(userSaveData, String(value));
        return;
    }
    if(typeof value === "string"){
        localStorage.setItem(userSaveData, value);
        return;
    }
    if(typeof value === "boolean"){
        localStorage.setItem(userSaveData, value ? "true" : "false");
        return;
    }
    throw new Error(`値を格納できませんでした：${typeof value}`);
}