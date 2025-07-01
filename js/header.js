import { TopPage } from "./page/topPage.js";
import { DescriptionPage } from "./page/description.js";
import { InterestListPage } from "./page/interestList.js";
import { ContactFormPage } from "./page/contactForm.js";
import { SelectableLanguage } from "./websiteModule.js";
import { MenuKind } from "./websiteModule.js";
import { HashBinding } from "./hashBinding.js";
import { ColorThemeToggleComponent } from "./components/colorThemeToggleComponent.js";
import { LanguageSelectorComponent } from "./components/languageSelectorComponent.js";
import { OwapoteNewsComponent } from "./components/owapoteNewsComponents.js";
import { HeaderNavComponent } from "./components/headerNavComponent.js";
import { YouTubeAPI }   from "./youtubeAPI.js";

const binder = new HashBinding();
const youtubeAPI = new YouTubeAPI();

const PlaylistIds  = Object.freeze({
    YukariGeoGuessrShorts : "PLYKfT5xUBiECfMwMC2bsAGemA9TAnGzdg",
});

const PageName  = Object.freeze({
    TopPage : "topPage",
    DescriptionPage : "description",
    InterestListPage : "interestList",
    ContactFormPage : "contactForm",
});

//type=module対策
window.InitHeaderEvent = InitHeaderEvent;
window.AddToChangeContentWithButton = AddToChangeContentWithButton;

//ヘッダーの初期化
function InitHeaderEvent(){
    const language = localStorage.getItem("userLanguage") || SelectableLanguage.Japanese
    document.documentElement.lang = language;

    //Vue.jsでbinding
    binder.ShowComponent(ColorThemeToggleComponent, "#colorThemeToggleButton");
    binder.ShowComponent(LanguageSelectorComponent, "#languageSelector");
    binder.ShowComponent(HeaderNavComponent, "#headerPageJumpButtons");

    AddToChangeContentWithButton(MenuKind.TopPage);
    youtubeAPI.GetYouTubePlayListVideo(PlaylistIds.YukariGeoGuessrShorts, 3);
}

//ボタンに応じて表示内容を切り替える
function AddToChangeContentWithButton(menuNum){

    const targetHTML = document.getElementById("mainTemplate");
    const targetCSS = document.getElementById("loadCSSForContent");

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
            usePathHTML += PageName.TopPage.toString();
            usePathCSS +=  PageName.TopPage.toString();
            pageClass = new TopPage();
            break;
        case MenuKind.Description:
            usePathHTML += PageName.DescriptionPage.toString();
            usePathCSS +=  PageName.DescriptionPage.toString();
            pageClass = new DescriptionPage();
            break;
        case MenuKind.InterestList:
            usePathHTML += PageName.InterestListPage.toString();
            usePathCSS +=  PageName.InterestListPage.toString();
            pageClass = new InterestListPage();
            break;
        case MenuKind.ContactForm:
            usePathHTML += PageName.ContactFormPage.toString();
            usePathCSS +=  PageName.ContactFormPage.toString();
            pageClass = new ContactFormPage();
            break;
        default:
            usePathHTML += PageName.TopPage.toString();
            usePathCSS +=  PageName.TopPage.toString();
            pageClass = new TopPage();
            break;
    }
    //拡張子を付与
    usePathHTML += extensionHTML;
    usePathCSS  += extensionCSS;

    localStorage.setItem("nowContent", menuNum);
    
    fetch(usePathHTML)
        .then(response =>{
            if(!response.ok) throw new Error("HTMLの読み込みに失敗しました:",targetHTML);
            return response.text();
        })
        .then(html=>{
            targetHTML.innerHTML = html;
            pageClass.ChangeContentsLanguage();

            //HACK:トップページ限定の操作
            if(menuNum == MenuKind.TopPage){
                //スライドショーの表示
                Vue.createApp({}).mount("#topPageSlideShow");
                //最近のできごとを表示
                binder.ShowComponent(OwapoteNewsComponent, "#owapoteNews");
                youtubeAPI.AppendIframesToContainer(PlaylistIds.YukariGeoGuessrShorts, "youtubeShortsGeoGuessrContents");
            }
        })
        .catch(error=>{
            console.error("HTMLの挿入中にエラーが発生しました:",error);
        })
    targetCSS.href = usePathCSS;
}