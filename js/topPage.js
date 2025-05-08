import { MainTemplate } from "./interface/mainTemplate.js";

export class TopPage extends MainTemplate{
    ChangeContentsLanguage(){
        function TranslateByPage(json,language){
            $("#welcomeText").text(json["welcomeText"][language]);
        }
        super.ChangeLanguage(TranslateByPage,"./../json/topPage.json");
    }
}