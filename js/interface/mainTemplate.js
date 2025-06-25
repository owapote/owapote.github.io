import { SelectableLanguage } from "./../websiteModule.js";

export class MainTemplate{

    async LoadHeaderTranslate(TranslateByPage,url,language) {
        try {
            //jsonより、HTMLに挿入
            const Translate = (json) => {
                $(document).ready(function () {
                    TranslateByPage(json,language);
                });
            }

            const response = await $.ajax({
                url: url,
                dataType: "json",
                type: "GET",
            });
            Translate(response);
        } catch (error) {
            console.error("headerのTranslateに失敗しました:", error);
        }
    }

    //言語を切り替える
    ChangeLanguage(TranslateByPage,url){
        $(() => {
            let language;

            //初期設定
            language = localStorage.getItem("userLanguage");
            if(language == null) language = SelectableLanguage.Japanese;
            else $("#languageSelector").val(language);

            this.LoadHeaderTranslate(TranslateByPage,url,language);
        });
    }
}