import { MainTemplate } from "./../interface/mainTemplate.js";

export class ContactFormPage extends MainTemplate{
    ChangeContentsLanguage(){
        function TranslateByPage(json,language){
            document.getElementById("contactMeText").textContent = json["contactMeText"][language];
            document.getElementById("contactMeContent").textContent = json["contactMeContent"][language];
        }
        super.ChangeLanguage(TranslateByPage,"./../json/page/contactForm.json");
    }
}