import { MainTemplate } from "./interface/mainTemplate.js";

export class ContactFormPage extends MainTemplate{
    ChangeContentsLanguage(){
        function TranslateByPage(json,language){
            $("#contactMeText").text(json["contactMeText"][language]);
        }
        super.ChangeLanguage(TranslateByPage,"./../json/contactForm.json");
    }
}