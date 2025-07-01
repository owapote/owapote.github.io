import { MainTemplate } from "./../interface/mainTemplate.js";

export class DescriptionPage extends MainTemplate{
    ChangeContentsLanguage(){
        function TranslateByPage(json,language){
            document.getElementById("aboutOwapoteText").textContent = json["aboutOwapoteText"][language];
        }
        super.ChangeLanguage(TranslateByPage,"./../json/page/description.json");
    }
}