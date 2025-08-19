import { MenuKind } from "../websiteModule.js";
import { TopPageReloadSetting } from "../page/topPage.js";
import { SetBaseFunction } from "../interface/componentTemplate.js";
import React from "react";

let _headerNavCache = null;

function HeaderNavComponent() {
    const [headerNav, SetHeaderNav] = React.useState([]);

    const language = localStorage.getItem("userLanguage") ||"jp";        

    React.useEffect(()=>{
        if(_headerNavCache){
            SetHeaderNav(_headerNavCache);
        }else{
            (async function LoadFallback(){
                try {
                    const response = await fetch("./../json/header.json");
                    const data = await response.json();
                    
                    _headerNavCache = data;
                    SetHeaderNav(data);
                } catch (error) {
                    console.error("header.jsonの取得に失敗しました:", error);
                }
            })();
        }
    }, []);

    const OnClick = (menuKind) =>{
        //TopPageReLoadSettingのフラグを全て立てる
        const allFlags = Object.values(TopPageReloadSetting).reduce((acc, val) => acc | val, 0);
        AddToChangeContentWithButton(menuKind, allFlags);
    }

    return(
        <>
            <button onClick={()=>OnClick(MenuKind.TopPage)}>         {headerNav?.topPageNav?.[language]}     </button>
            <button onClick={()=>OnClick(MenuKind.DescriptionPage)}> {headerNav?.descriptionNav?.[language]} </button>
            <button onClick={()=>OnClick(MenuKind.InterestListPage)}>{headerNav?.interestListNav?.[language]}</button>
            <button onClick={()=>OnClick(MenuKind.ContactFormPage)}> {headerNav?.contactFormNav?.[language]} </button>
        </>
    );
}

async function LoadHeaderNav(){
    try {
        const response = await fetch("./../json/header.json");
        const data = await response.json();

        _headerNavCache = data;
    } catch (error) {
        console.error("header.jsonの取得に失敗しました:", error);
    }
};

export default SetBaseFunction(HeaderNavComponent, LoadHeaderNav);