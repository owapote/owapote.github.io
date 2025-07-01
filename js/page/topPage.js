import { SelectableLanguage } from "../websiteModule.js";
import { MainTemplate } from "./../interface/mainTemplate.js";

export class TopPage extends MainTemplate{
    ChangeContentsLanguage(){
        function TranslateByPage(json,language){
            document.getElementById("welcomeText").textContent = json["welcomeText"][language];
            document.getElementById("youtubeShortsGeoguessrText").textContent = json["youtubeShortsGeoguessrText"][language];
            document.getElementById("recentTopicsText").textContent = json["recentTopicsText"][language];
        }
        super.ChangeLanguage(TranslateByPage,"./../json/page/topPage.json");
    }
}