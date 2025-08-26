import { GetLocalStorage, SetLocalStorage } from "@util/localStorageWrapper";
import { SetBaseFunction } from "../interface/componentTemplate";
import { TopPageReloadSetting } from "../page/topPage";
import { ColorTheme, ColorThemeValues, MenuKind, MenuKindValues } from "../src/websiteModule";
import React from "react";

function ColorThemeToggleComponent(){
    //初期設定 mounted
    React.useEffect(() => {
        const button = document.querySelector("#colorThemeToggleButton");
        const colorTheme = GetLocalStorage<ColorTheme>("userColorTheme","lightMode");
        if (colorTheme === ColorThemeValues.DarkMode) {
            button?.classList.add("is-night");
            document.body.classList.add(ColorThemeValues.DarkMode);
            SetUserColorThemeAndReload(ColorThemeValues.DarkMode);
        }

        //ページが読み込まれた瞬間はカラーテーマのtransitionをさせないようにしている
        setTimeout(function() {
            document.body.classList.add("enableTransition");
        }, 100);

        //静的HTMLに対してイベント登録
        if (button) {
            button.addEventListener("click", onChange);
        }

        //beforeUnmount
        return () => {
            if (button) {
                button.removeEventListener("click", onChange);
            }
        };
    }, []);

    //イベント
    const onChange = () : void => {
        const button = document.getElementById("colorThemeToggleButton");
        const colorTheme = GetLocalStorage<ColorTheme>("userColorTheme","lightMode");

        if (colorTheme === ColorThemeValues.DarkMode) {
            button?.classList.remove("is-night");
            document.body.classList.remove(ColorThemeValues.DarkMode);
            SetUserColorThemeAndReload(ColorThemeValues.LightMode);
        } else {
            button?.classList.add("is-night");
            document.body.classList.add(ColorThemeValues.DarkMode);
            SetUserColorThemeAndReload(ColorThemeValues.DarkMode);
        }
    };

    //設定と反映
    function SetUserColorThemeAndReload(nextTheme: string){
        SetLocalStorage("userColorTheme", nextTheme);

        const menuNum  = GetLocalStorage<MenuKind>("nowContent", MenuKindValues.TopPage);
        const allFlags = Object.values(TopPageReloadSetting).reduce((acc, val) => acc | val, 0);
        window.AddToChangeContentWithButton(menuNum, allFlags);
    }
    return null;
}

export default SetBaseFunction(ColorThemeToggleComponent,()=>{});