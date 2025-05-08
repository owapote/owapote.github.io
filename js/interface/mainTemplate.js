import { SelectableLanguage } from "./../websiteModule.js";

export class MainTemplate{
    //言語を切り替える
    ChangeLanguage(TranslateByPage,url){
        $(function(){
            let language;

            //初期設定
            language = localStorage.getItem("userLanguage");
            if(language == null) language = SelectableLanguage.Japanese;
            else $("#languageSelector").val(language);
            
            //jsonより、HTMLに挿入
            const Translate = (json) => {
                $(document).ready(function () {
                    TranslateByPage(json,language);
                });
            }

            $.ajax({
                url: url,
                dataType: "json",
                type: "GET",
            }).done(function (data){
                Translate(data);
            });
        });
    }
}