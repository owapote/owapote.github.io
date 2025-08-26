import { MainTemplate, TranslationItem } from "../interface/mainTemplate";
import type { SelectableLanguage } from "ts/src/websiteModule";

//jsonの型に合わせる
type MyPastimeTranslationsJson = { myPastimeTranslations: TranslationItem[] };

export class MyPastimePage extends MainTemplate{
    ChangeContentsLanguage(): void{
        const TranslateByPage = (json: MyPastimeTranslationsJson, language: SelectableLanguage) => {
            super.ApplyTranslationsById(json.myPastimeTranslations, language);
        }

        super.ChangeLanguage(TranslateByPage,"./../json/page/myPastime.json");
    }
}