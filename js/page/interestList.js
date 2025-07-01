import { MainTemplate } from "./../interface/mainTemplate.js";

export class InterestListPage extends MainTemplate{
    ChangeContentsLanguage(){
        function TranslateByPage(json,language){
            document.getElementById("interestListText").textContent = json["interestListText"][language];
        }
        super.ChangeLanguage(TranslateByPage,"./../json/page/interestList.json");
    }
}