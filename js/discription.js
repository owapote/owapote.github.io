import { MainTemplate } from "./interface/mainTemplate.js";

export class DiscriptionPage extends MainTemplate{
    ChangeContentsLanguage(){
        function TranslateByPage(json,language){
            $("#aboutOwapoteText").text(json["aboutOwapoteText"][language]);
        }
        super.ChangeLanguage(TranslateByPage,"./../json/discription.json");
    }
}