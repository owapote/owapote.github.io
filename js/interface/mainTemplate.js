import { SelectableLanguage } from "./../websiteModule.js";

export class MainTemplate{

    async LoadHeaderTranslate(TranslateByPage,url,language) {
        try {
            //jsonより、HTMLに挿入
            const response = await fetch(url);
            const json = await response.json();
            TranslateByPage(json,language);
        } catch (error) {
            console.error("headerのTranslateに失敗しました:", error);
        }
    }

    //言語を切り替える
    ChangeLanguage(TranslateByPage,url){
        let language;

        //初期設定
        language = localStorage.getItem("userLanguage");
        if(!language) language = SelectableLanguage.Japanese;
        else {
            //$("#languageSelector").val(language);
            //と同義
            const selector = document.getElementById("languageSelector");
            if(selector) selector.value = language;
        }

        this.LoadHeaderTranslate(TranslateByPage,url,language);
    }
}