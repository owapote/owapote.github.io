import { MainTemplate, TranslationItem } from "../interface/mainTemplate";
import type { SelectableLanguage } from "ts/src/websiteModule";

//jsonの型に合わせる
type ContactFormTranslationsJson = { contactFormTranslations: TranslationItem[] };

export class ContactFormPage extends MainTemplate{
    ChangeContentsLanguage(){
        const TranslateByPage = (json: ContactFormTranslationsJson, language: SelectableLanguage) => {
            super.ApplyTranslationsById(json.contactFormTranslations, language);
        }

        super.ChangeLanguage(TranslateByPage,"./../json/page/contactForm.json");
    }
}