import { SelectableLanguage } from "../websiteModule.js";
import { MainTemplate } from "./../interface/mainTemplate.js";

export const TopPageReloadSetting = Object.freeze({
    None: 1<<0,
    ShowSlideShow: 1<<1,
    ShowYouTubeContents: 1<<2,
    ShowNews: 1<<3,
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