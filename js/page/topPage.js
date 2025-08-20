import { MainTemplate } from "./../interface/mainTemplate.js";

export const TopPageReloadSetting = Object.freeze({
    None: 1<<0,
    ShowHeaderNav: 1<<1,
    ShowSlideShow: 1<<2,
    ShowYouTubeContents: 1<<3,
    ShowNews: 1<<4,
});

export class TopPage extends MainTemplate{
    ChangeContentsLanguage(){
        function TranslateByPage(json,language){
            document.getElementById("welcomeText").textContent = json["welcomeText"][language];
            document.getElementById("youtubeShortsGeoguessrText").textContent = json["youtubeShortsGeoguessrText"][language];
            document.getElementById("yukariGeoGuessrText").textContent = json["yukariGeoGuessrText"][language];
            document.getElementById("owapoteNewsText").textContent = json["owapoteNewsText"][language];
        }
        super.ChangeLanguage(TranslateByPage,"./../json/page/topPage.json");
    }
}