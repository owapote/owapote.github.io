import { SetBaseFunction } from "../interface/componentTemplate.js";
import { TopPageReloadSetting } from "./../page/topPage.js";
import { ColorTheme } from "../websiteModule.js";
import React from "react";

function ColorThemeToggleComponent(){
    //初期設定 mounted
    React.useEffect(() => {
        const button = document.querySelector("#colorThemeToggleButton");
        const colorTheme = localStorage.getItem("userColorTheme") || "lightMode";
        if (colorTheme === ColorTheme.DarkMode) {
            button?.classList.add("is-night");
            document.body.classList.add(ColorTheme.DarkMode);
            SetUserColorThemeAndReload(ColorTheme.DarkMode);
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
    const onChange = async () => {
        const button = document.getElementById("colorThemeToggleButton");
        const colorTheme = localStorage.getItem("userColorTheme") || "lightMode";

        if (colorTheme === ColorTheme.DarkMode) {
            button?.classList.remove("is-night");
            document.body.classList.remove(ColorTheme.DarkMode);
            SetUserColorThemeAndReload(ColorTheme.LightMode);
        } else {
            button?.classList.add("is-night");
            document.body.classList.add(ColorTheme.DarkMode);
            SetUserColorThemeAndReload(ColorTheme.DarkMode);
        }
    };

    //設定と反映
    function SetUserColorThemeAndReload(nextTheme){
        localStorage.setItem("userColorTheme", nextTheme);

        const menuNum  = localStorage.getItem("nowContent");
        const allFlags = Object.values(TopPageReloadSetting).reduce((acc, val) => acc | val, 0);
        AddToChangeContentWithButton(menuNum, allFlags);
    }
    return null;
}

export default SetBaseFunction(ColorThemeToggleComponent,()=>{});