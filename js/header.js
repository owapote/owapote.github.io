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
    [MenuKind.TopPage] : "topPage",
    [MenuKind.DescriptionPage] : "description",
    [MenuKind.InterestListPage] : "interestList",
    [MenuKind.ContactFormPage] : "contactForm",
});

//Factory Patternを組む
const PageFactory = Object.freeze({
    [MenuKind.TopPage]: () => new TopPage(),
    [MenuKind.DescriptionPage]: () => new DescriptionPage(),
    [MenuKind.InterestListPage]: () => new InterestListPage(),
    [MenuKind.ContactFormPage]: () => new ContactFormPage(),
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
    //mainの子をまっさらにする
    while(targetHTML.firstChild){
        targetHTML.removeChild(targetHTML.firstChild);
    }

    const usePathHTML = "./html/page/";
    const usePathCSS = "./css/page/";
    const extensionHTML = ".html";
    const extensionCSS = ".css";
    //各ページのHTMLとCSSの相対パスを取得
    const pagePathHTML = getPagePath(usePathHTML, extensionHTML, menuNum);
    const pagePathCSS = getPagePath(usePathCSS, extensionCSS, menuNum);

    const pageClass = (PageFactory[menuNum] || PageFactory[MenuKind.TopPage])();

    localStorage.setItem("nowContent", menuNum);
    
    fetch(pagePathHTML)
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
        });
    //CSSの適用シートを変更
    targetCSS.href = pagePathCSS;
}

function getPagePath(usePath, fileExtension, menuNum){
    var retPath = usePath;

    //memo:falsyでないことが大前提
    if(PageName[menuNum]){
        retPath += PageName[menuNum];
    }else{
        console.log(menuNum);
        console.error("menuNum is not found.");
    }
    //拡張子を付与
    retPath += fileExtension;
    return retPath;
}