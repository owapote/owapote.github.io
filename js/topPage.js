import { MainTemplate } from "./interface/mainTemplate.js";
import { YouTubeAPI }   from "./youtubeAPI.js";

export class TopPage extends MainTemplate{
    ChangeContentsLanguage(){
        function TranslateByPage(json,language){
            $("#welcomeText").text(json["welcomeText"][language]);
            $("#youtubeShortsGeoguessrText").text(json["youtubeShortsGeoguessrText"][language]);
            $("#recentTopicsText").text(json["recentTopicsText"][language]);
        }
        super.ChangeLanguage(TranslateByPage,"./../json/topPage.json");
    }
}