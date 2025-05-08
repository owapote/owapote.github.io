import { MainTemplate } from "./interface/mainTemplate.js";

export class InterestListPage extends MainTemplate{
    ChangeContentsLanguage(){
        function TranslateByPage(json,language){
            $("#interestListText").text(json["interestListText"][language]);
        }
        super.ChangeLanguage(TranslateByPage,"./../json/interestList.json");
    }
}