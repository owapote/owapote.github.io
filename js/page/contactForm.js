import { MainTemplate } from "./../interface/mainTemplate.js";

export class ContactFormPage extends MainTemplate{
    ChangeContentsLanguage(){
        function TranslateByPage(json,language){
            $("#contactMeText").text(json["contactMeText"][language]);
            $("#contactMeContent").text(json["contactMeContent"][language]);
        }
        super.ChangeLanguage(TranslateByPage,"./../json/page/contactForm.json");
    }
}