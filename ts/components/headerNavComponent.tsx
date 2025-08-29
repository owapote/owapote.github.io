import type { MenuKind, SelectableLanguage, } from "../src/websiteModule";
import { SelectableLanguageValues } from "../src/websiteModule";
import { TopPageReloadSetting } from "../page/topPage";
import { SetBaseFunction } from "../interface/componentTemplate";
import React, { JSX } from "react";
import { GetLocalStorage, UserSaveDataValues } from "@util/localStorageWrapper";
import type { HeaderNavData, HeaderNavItem } from "@contracts/headerNavContracts";
import { FetchJson } from "@util/jsonLoader";

const HEADER_NAV_URL = "./../json/header.json";

let _headerNavCache: HeaderNavData | null = null;

function HeaderNavComponent(): JSX.Element {
    const [headerNavData, setHeaderNavData] = React.useState<HeaderNavData | null>(null);

    const language = GetLocalStorage<SelectableLanguage>(UserSaveDataValues.Language, SelectableLanguageValues.Japanese);

    React.useEffect(()=>{
        if(_headerNavCache){
            setHeaderNavData(_headerNavCache);
        }else{
            (async function LoadFallback(){
                try {
                    const data = await FetchJson<HeaderNavData>(HEADER_NAV_URL);
                    _headerNavCache = data;
                    setHeaderNavData(data);
                } catch (error) {
                    console.error("header.jsonの取得に失敗しました:", error);
                    _headerNavCache = null;
                    setHeaderNavData({ headerNavItems: [] });
                }
            })();
        }
    }, []);

    const OnClick = (menuKind: MenuKind) =>{
        //TopPageReLoadSettingのフラグを全て立てる
        const allFlags = Object.values(TopPageReloadSetting).reduce((acc, val) => acc | val, 0);
        window.AddToChangeContentWithButton(menuKind, allFlags);
    }

    return(
        <>
            {headerNavData?.headerNavItems.map((item: HeaderNavItem)=>(
                <button key={item.menuKind} onClick={()=>OnClick(item.menuKind)}> 
                    {item.translations[language]}
                </button>
            ))}
        </>
    );
}

/**
 * ヘッダーの読み込みをする
 */
async function LoadHeaderNav(): Promise<void>{
    try {
        const data = await FetchJson<HeaderNavData>(HEADER_NAV_URL);
        _headerNavCache = data;
    } catch (error) {
        console.error("header.jsonの取得に失敗しました:", error);
        _headerNavCache = null;
    }
};

export default SetBaseFunction(HeaderNavComponent, LoadHeaderNav);