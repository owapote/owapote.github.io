import { TopPage } from "./page/topPage.js";
import { DescriptionPage } from "./page/description.js";
import { InterestListPage } from "./page/interestList.js";
import { ContactFormPage } from "./page/contactForm.js";
import { TopPageReloadSetting } from "./page/topPage.js";
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

//マッピングをしておく
const TopPageContentsReloaders = [
    {
        flag: TopPageReloadSetting.ShowSlideShow,
        reloadFunc: () => Vue.createApp({}).mount("#topPageSlideShow")
    },{
        flag: TopPageReloadSetting.ShowNews,
        reloadFunc: () => binder.ShowComponent(OwapoteNewsComponent, "#owapoteNews")
    },{
        flag: TopPageReloadSetting.ShowYouTubeContents,
        reloadFunc: () => youtubeAPI.AppendIframesToContainer(PlaylistIds.YukariGeoGuessrShorts, "youtubeShortsGeoGuessrContents")
    }
];

//type=module対策
window.InitHeaderEvent = InitHeaderEvent;
window.AddToChangeContentWithButton = AddToChangeContentWithButton;
window.getPagePath = getPagePath;
window.ReloadTopPageContents = ReloadTopPageContents;

//ヘッダーの初期化
function InitHeaderEvent(){
    const language = localStorage.getItem("userLanguage") || SelectableLanguage.Japanese
    document.documentElement.lang = language;

    //Vue.jsでbinding
    binder.ShowComponent(ColorThemeToggleComponent, "#colorThemeToggleButton");
    binder.ShowComponent(LanguageSelectorComponent, "#languageSelector");
    binder.ShowComponent(HeaderNavComponent, "#headerPageJumpButtons");

    //TopPageReloadSettingのフラグを全て立てる
    const allFlags = Object.values(TopPageReloadSetting).reduce((acc, val) => acc | val, 0);
    AddToChangeContentWithButton(MenuKind.TopPage, allFlags);
    youtubeAPI.GetYouTubePlayListVideo(PlaylistIds.YukariGeoGuessrShorts, 3);
}

/**
 * ボタンに応じて表示内容を切り替える
 * @param {*} menuNum MenuKind、もしくはその範囲内の整数
 * @param {*} topPageReloadSetting ビット管理している
 */
function AddToChangeContentWithButton(menuNum, topPageReloadSetting){
    const targetHTML = document.getElementById("mainTemplate");
    const targetCSS = document.getElementById("loadCSSForContent");

    const usePathHTML = "./html/page/";
    const usePathCSS = "./css/page/";
    const extensionHTML = ".html";
    const extensionCSS = ".css";
    //各ページのHTMLとCSSの相対パスを取得
    const pagePathHTML = getPagePath(menuNum, usePathHTML, extensionHTML);
    const pagePathCSS  = getPagePath(menuNum, usePathCSS , extensionCSS);

    const pageClass = (PageFactory[menuNum] || PageFactory[MenuKind.TopPage])();
    
    fetch(pagePathHTML)
        .then(response =>{
            if(!response.ok) throw new Error("HTMLの読み込みに失敗しました:",targetHTML);
            return response.text();
        })
        .then(html=>{
            //if(menuNum == localStorage.getItem("nowContent")){
                targetHTML.innerHTML = html;
            pageClass.ChangeContentsLanguage();
            //}

            //HACK:トップページ限定の操作
            if(menuNum == MenuKind.TopPage){
                ReloadTopPageContents(topPageReloadSetting);
            }
        })
        .catch(error=>{
            console.error("HTMLの挿入中にエラーが発生しました:",error);
        });
    //CSSの適用シートを変更
    targetCSS.href = pagePathCSS;
    
    localStorage.setItem("nowContent", menuNum);
}

/**
 * TopPage内のコンテンツを再読み込みする
 * @param {*} topPageReloadSetting ビット管理している
 */
function ReloadTopPageContents(topPageReloadSetting){
    for(const item of TopPageContentsReloaders){
        if(topPageReloadSetting & item.flag){
            item.reloadFunc();
        }
    }
}

/**
 * 各MenuKindに応じたHTMLやCSSのパスを出力する
 * @param {*} menuNum MenuKind、もしくはその範囲内の整数
 * @param {*} usePath ファイルまでのパス
 * @param {*} fileExtension 拡張子
 * @returns 相対パス
 */
function getPagePath(menuNum, usePath, fileExtension){
    var retPath = usePath;

    //memo:falsyでないことが大前提
    if(PageName[menuNum]){
        retPath += PageName[menuNum];
    }else{
        console.error("menuNum is not found.");
    }
    //拡張子を付与
    retPath += fileExtension;
    return retPath;
}