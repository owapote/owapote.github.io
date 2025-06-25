import { TopPage } from "./page/topPage.js";
import { DescriptionPage } from "./page/description.js";
import { InterestListPage } from "./page/interestList.js";
import { ContactFormPage } from "./page/contactForm.js";
import { SelectableLanguage } from "./websiteModule.js";
import { MenuKind } from "./websiteModule.js";
import { HashBinding } from "./hashBinding.js";
import { OwapoteNewsComponent } from "./components.js";
import { YouTubeAPI }   from "./youtubeAPI.js";

const binder = new HashBinding();
const youtubeAPI = new YouTubeAPI();

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

        async function LoadHeaderTranslate() {
            try {
                const response = await $.ajax({
                    url: "./../json/header.json",
                    dataType: "json",
                    type: "GET",
                });
                Translate(response);
            } catch (error) {
                console.error("headerのTranslateに失敗しました:", error);
            }
        }

        //初期設定
        language = localStorage.getItem("userLanguage");
        if(language == null) language = SelectableLanguage.Japanese;
        else $("#languageSelector").val(language);
        LoadHeaderTranslate();

        //イベント
        $("#languageSelector").change(function() {
            const num = localStorage.getItem("nowContent");
            let getLanguage = $("option:selected").val();
            
            if(Object.values(SelectableLanguage).includes(getLanguage)){
                language = getLanguage;
                localStorage.setItem("userLanguage",language);

                LoadHeaderTranslate();
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

    var usePathHTML = "./html/page/";
    var usePathCSS = "./css/page/";
    var pageClass;
    const extensionHTML = ".html";
    const extensionCSS = ".css";

    //HACK:強度が低い
    switch(menuNum){
        case MenuKind.TopPage:
            usePathHTML += "topPage";
            usePathCSS +="topPage";
            pageClass = new TopPage();
            break;
        case MenuKind.Description:
            usePathHTML += "description";
            usePathCSS +="description";
            pageClass = new DescriptionPage();
            break;
        case MenuKind.InterestList:
            usePathHTML += "interestList";
            usePathCSS +="interestList";
            pageClass = new InterestListPage();
            break;
        case MenuKind.ContactForm:
            usePathHTML += "contactForm";
            usePathCSS +="contactForm";
            pageClass = new ContactFormPage();
            break;
        default:
            usePathHTML += "topPage";
            usePathCSS +="topPage";
            pageClass = new TopPage();
            break;
    }
    //拡張子を付与
    usePathHTML += extensionHTML;
    usePathCSS  += extensionCSS;

    localStorage.setItem("nowContent", menuNum);
    $(targetHTML).load(usePathHTML,function(){
        pageClass.ChangeContentsLanguage();
        //トップページのみ、最近のできごとを表示
        if(menuNum == MenuKind.TopPage){
            binder.ShowViewModel(OwapoteNewsComponent, "#owapoteNews");
            youtubeAPI.AppendIframesToContainer(playlistIds.YukariGeoGuessrShorts, "youtubeShortsGeoGuessrContents");
        }
    });
    targetCSS.href = usePathCSS;
}