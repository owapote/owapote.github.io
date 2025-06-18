import { TopPage } from "./topPage.js";
import { DescriptionPage } from "./description.js";
import { InterestListPage } from "./interestList.js";
import { ContactFormPage } from "./contactForm.js";
import { SelectableLanguage } from "./websiteModule.js";
import { MenuKind } from "./websiteModule.js";
import { HashBinding } from "./hashBinding.js";
import { YouTubeAPI }   from "./youtubeAPI.js";

const binder = new HashBinding();
const youtubeAPI = new YouTubeAPI;

const playlistIds  = Object.freeze({
    "YukariGeoGuessrShorts" : "PLYKfT5xUBiECfMwMC2bsAGemA9TAnGzdg",
});

//type=module対策
window.InitHeaderEvent = InitHeaderEvent;
window.AddToChangeContentWithButton = AddToChangeContentWithButton;

//ヘッダーのボタンなどのイベントを追加
function InitHeaderEvent(){
    AddToChangeColorModeEvent();
    AddToChangeLanguageEvent();

    let language = localStorage.getItem("userLanguage");
    if(language == null) language = SelectableLanguage.Japanese;
    document.documentElement.lang = language;

    AddToChangeContentWithButton(MenuKind.TopPage);
    youtubeAPI.GetYouTubePlayListVideo(playlistIds.YukariGeoGuessrShorts, 3);
}

//カラーテーマの切り替え
function AddToChangeColorModeEvent(){
    $(function(){
        let isDayMode = true;

        //初期設定
        let colorTheme = localStorage.getItem("userColorTheme");
        if (colorTheme != null && colorTheme === "nightMode") {
            isDayMode = false;
            $("#colorThemeToggleButton").toggleClass("is-night");
            $(document.body).addClass("darkMode");
        }

        //ページが読み込まれた瞬間はカラーテーマのtransitionをさせないようにしている
        setTimeout(function(){
            $(document.body).addClass("enableTransition");
        },100);

        //イベント
        $("#colorThemeToggleButton").on("click", function() {
            isDayMode = !isDayMode;
            $(this).toggleClass("is-night");
            $(document.body).toggleClass("darkMode");

            if (isDayMode) {
                localStorage.setItem("userColorTheme", "lightMode");
            } else {
                localStorage.setItem("userColorTheme", "nightMode");
            }
        });
    });
}

//言語設定
function AddToChangeLanguageEvent(){
    $(function(){
        let language;

        //jsonより、HTMLに挿入
        const Translate = (json) => {
            $(document).ready(function () {
                $("#headerText").text(json["headerText"][language]);
                $("#topPageNav").text(json["topPageNav"][language]);
                $("#descriptionNav").text(json["descriptionNav"][language]);
                $("#interestListNav").text(json["interestListNav"][language]);
                $("#contactFormNav").text(json["contactFormNav"][language]);
            });
        }
        //初期設定
        language = localStorage.getItem("userLanguage");
        if(language == null) language = SelectableLanguage.Japanese;
        else $("#languageSelector").val(language);
        $.ajax({
            url: "./../json/header.json",
            dataType: "json",
            type: "GET",
        }).done(function (data){
            Translate(data);
        });

        //イベント
        $("#languageSelector").change(function() {
            const num = localStorage.getItem("nowContent");
            let getLanguage = $("option:selected").val();
            
            if(Object.values(SelectableLanguage).includes(getLanguage)){
                language = getLanguage;
                localStorage.setItem("userLanguage",language);

                $.ajax({
                    url: "./../json/header.json",
                    dataType: "json",
                    type: "GET",
                }).done(function (data){
                    Translate(data);
                });
            }else{
                alert("This language cannot selected:" + SelectableLanguage[getLanguage]);
            }

            document.documentElement.lang = language;
            AddToChangeContentWithButton(Number(num));
        });
    });
}

//ボタンに応じて表示内容を切り替える
function AddToChangeContentWithButton(menuNum){

    const targetHTML = document.getElementById("mainTemplate");
    const targetCSS = document.getElementById("loadCSSForContent");

    //memo:ここ、whileにする必要ないかもしれない
    while(targetHTML.firstChild){
        targetHTML.removeChild(targetHTML.firstChild);
    }

    var usePathHTML;
    var usePathCSS;
    var pageClass;
    //HACK:強度が低い
    switch(menuNum){
        case MenuKind.TopPage:
            usePathHTML = "./html/topPage.html";
            usePathCSS="./css/topPage.css";
            pageClass = new TopPage();
            break;
        case MenuKind.description:
            usePathHTML = "./html/description.html";
            usePathCSS="./css/description.css";
            pageClass = new DescriptionPage();
            break;
        case MenuKind.InterestList:
            usePathHTML = "./html/interestList.html";
            usePathCSS="./css/interestList.css";
            pageClass = new InterestListPage();
            break;
        case MenuKind.ContactForm:
            usePathHTML = "./html/contactForm.html";
            usePathCSS="./css/contactForm.css";
            pageClass = new ContactFormPage();
            break;
        default:
            usePathHTML = "./html/topPage.html";
            usePathCSS="./css/topPage.css";
            pageClass = new TopPage();
            break;
    }
    localStorage.setItem("nowContent", menuNum);
    $(targetHTML).load(usePathHTML,function(){
        pageClass.ChangeContentsLanguage();
        //トップページのみ、最近のできごとを表示
        if(menuNum == MenuKind.TopPage){
            binder.ShowOwapoteNews(menuNum);
            youtubeAPI.AppendIframesToContainer(playlistIds.YukariGeoGuessrShorts, "youtubeShortsGeoGuessrContents");
        }
    });
    targetCSS.href = usePathCSS;
}