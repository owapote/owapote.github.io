import { binder, youtubeAPI } from "./src/singleInstanceService";
import { TopPageReloadSetting } from "./page/topPage";
import type { MenuKind }   from "./src/websiteModule";
import { SelectableLanguageValues, MenuKindValues, SelectableLanguage }   from "./src/websiteModule";
import { PageFactory } from "./src/pageFactory";

//default import
import ColorThemeToggleComponent from "./components/colorThemeToggleComponent";
import LanguageSelectorComponent from "./components/languageSelectorComponent";
import OwapoteNewsComponent      from "./components/owapoteNewsComponents";
import HeaderNavComponent        from "./components/headerNavComponent";
import TopPageSlideShowComponent from "./components/topPageSlideShowComponent";
import { GetLocalStorage, SetLocalStorage, UserSaveDataValues } from "@util/localStorageWrapper";

const PlaylistIds = {
    YukariGeoGuessrShorts : "PLYKfT5xUBiECfMwMC2bsAGemA9TAnGzdg",
}as const;

const PageName = {
    [MenuKindValues.TopPage] : "topPage",
    [MenuKindValues.DescriptionPage] : "description",
    [MenuKindValues.MyPastimePage] : "myPastime",
    [MenuKindValues.ContactFormPage] : "contactForm",
}as const;

//マッピングをしておく
const TopPageContentsReloaders = [
    {
        flag: TopPageReloadSetting.ShowHeaderNav,
        reloadFunc: () => binder.ShowComponent(HeaderNavComponent, "#headerPageJumpButtons")
    },{
        flag: TopPageReloadSetting.ShowSlideShow,
        reloadFunc: () => binder.ShowComponent(TopPageSlideShowComponent, "#topPageSlideShow")
    },{
        flag: TopPageReloadSetting.ShowNews,
        reloadFunc: () => binder.ShowComponent(OwapoteNewsComponent, "#owapoteNews")
    },{
        flag: TopPageReloadSetting.ShowYouTubeContents,
        reloadFunc: () => youtubeAPI.AppendIframesToContainer(PlaylistIds.YukariGeoGuessrShorts, "youtubeShortsGeoGuessrContents")
    }
]as const;

//type=module対策
declare global{
    interface Window{
        InitHeaderEvent: () => void;
        AddToChangeContentWithButton:(menuNum: MenuKind, topPageReloadSetting: number) => void;
        getPagePath:(menuNum: MenuKind, usePath: string, fileExtension: string) => string;
        ReloadTopPageContents:(topPageReloadSetting: number) => void;
    }
};

//type=module対策
window.InitHeaderEvent = InitHeaderEvent;
window.AddToChangeContentWithButton = AddToChangeContentWithButton;
window.ReloadTopPageContents = ReloadTopPageContents;
window.getPagePath = getPagePath;

/**
 * ヘッダーの初期化をする
 */
function InitHeaderEvent(): void{
    const language = GetLocalStorage<SelectableLanguage>(UserSaveDataValues.Language, SelectableLanguageValues.Japanese);
    document.documentElement.lang = language;

    //Vue.jsでbinding
    binder.ShowComponent(ColorThemeToggleComponent, "#colorThemeToggleButton");
    binder.ShowComponent(LanguageSelectorComponent, "#languageSelector");

    //TopPageReloadSettingのフラグを全て立てる
    //数値配列とみなす
    const allFlags = (Object.values(TopPageReloadSetting) as number[]).reduce((acc, val) => acc | val, 0);
    AddToChangeContentWithButton(MenuKindValues.TopPage, allFlags);
    youtubeAPI.GetYouTubePlayListVideo(PlaylistIds.YukariGeoGuessrShorts, 5);
}

/**
 * ボタンに応じて表示内容を切り替える
 * @param {*} menuNum 
 * @param {*} topPageReloadSetting ビット管理している
 */
function AddToChangeContentWithButton(menuNum: MenuKind, topPageReloadSetting: number): void{
    const targetHTML = document.getElementById("mainTemplate");
    const targetCSS  = document.getElementById("loadCSSForContent") as HTMLLinkElement | null;

    if(!targetHTML || !targetCSS) return;

    const usePathHTML   = "./html/page/";
    const usePathCSS    = "./css/page/";
    const extensionHTML = ".html";
    const extensionCSS  = ".css";
    //各ページのHTMLとCSSの相対パスを取得
    const pagePathHTML = getPagePath(menuNum, usePathHTML, extensionHTML);
    const pagePathCSS  = getPagePath(menuNum, usePathCSS , extensionCSS);

    const pageClass = (PageFactory[menuNum] || PageFactory[MenuKindValues.TopPage])();
    
    fetch(pagePathHTML)
        .then(response =>{
            if(!response.ok) throw new Error(`HTMLの読み込みに失敗しました:${targetHTML}`);
            return response.text();
        })
        .then(html=>{
            targetHTML.innerHTML = html;
            pageClass.ChangeContentsLanguage();

            //HACK:トップページ限定の操作
            if(menuNum == MenuKindValues.TopPage){
                ReloadTopPageContents(topPageReloadSetting);
            }
        })
        .catch(error=>{
            console.error("HTMLの挿入中にエラーが発生しました:",error);
        });
    //CSSの適用シートを変更
    targetCSS.href = pagePathCSS;
    
    SetLocalStorage(UserSaveDataValues.NowContent, menuNum.toString());
}

/**
 * TopPage内のコンテンツを再読み込みする
 * @param {*} topPageReloadSetting ビット管理している
 */
function ReloadTopPageContents(topPageReloadSetting: number): void{
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
function getPagePath(menuNum: MenuKind, usePath: string, fileExtension: string): string{
    let retPath = usePath;

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