import { TopPageReloadSetting } from "../page/topPage";
import { MenuKind, MenuKindValues, SelectableLanguage, SelectableLanguageValues } from "../src/websiteModule";
import { SetBaseFunction } from "../interface/componentTemplate";
import React from "react";
import { GetLocalStorage, SetLocalStorage } from "@util/localStorageWrapper";

function LanguageSelectorComponent(){
    const language = GetLocalStorage("userLanguage", SelectableLanguageValues.Japanese) ||"jp";

    //初期設定
    React.useEffect(()=>{
        document.documentElement.lang = language;
    }, []);

    //イベント
    const onChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        const newLang = event.currentTarget.value;
        //SelectableLanguage型に変換できるか否か
        const isSelectableLanguage =
            (Object.values(SelectableLanguageValues) as readonly string[]).includes(newLang);

        if (isSelectableLanguage) {
            document.documentElement.lang = newLang;
            SetUserLanguageAndReload(newLang);
        } else {
            alert("This language cannot be selected: " + newLang);
        }
    }

    //設定と反映
    function SetUserLanguageAndReload(nextLang: string){
        SetLocalStorage("userLanguage", nextLang);

        const menuNum  = GetLocalStorage<MenuKind>("nowContent",MenuKindValues.TopPage);
        const allFlags = Object.values(TopPageReloadSetting).reduce((acc, val) => acc | val, 0);
        window.AddToChangeContentWithButton(menuNum, allFlags);
    }

    return(
        <select onChange={onChange} defaultValue={language}>
            <option value="jp">日本語</option>
            <option value="en">English</option>
            <option value="tok">toki pona</option>
        </select>
    );
};

export default SetBaseFunction(LanguageSelectorComponent,()=>{});
