import { TopPageReloadSetting } from "../page/topPage.js";
import { SelectableLanguage } from "../websiteModule.js";
import { SetBaseFunction } from "../interface/componentTemplate.js";
import React from "react";

function LanguageSelectorComponent(){
    const language = localStorage.getItem("userLanguage") ||"jp";

    //初期設定
    React.useEffect(()=>{
        document.documentElement.lang = language;
    }, []);

    //イベント
    const onChange = async(event) => {
        const newLang = event.target.value;
        if (Object.values(SelectableLanguage).includes(newLang)) {
            document.documentElement.lang = newLang;
            SetUserLanguageAndReload(newLang);
        } else {
            alert("This language cannot be selected: " + newLang);
        }
    }

    //設定と反映
    function SetUserLanguageAndReload(nextLang){
        localStorage.setItem("userLanguage", nextLang);

        const menuNum  = localStorage.getItem("nowContent");
        const allFlags = Object.values(TopPageReloadSetting).reduce((acc, val) => acc | val, 0);
        AddToChangeContentWithButton(menuNum, allFlags);
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
