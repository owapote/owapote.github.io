import { MainTemplate, TranslationItem } from "../interface/mainTemplate";
import type { SelectableLanguage } from "ts/src/websiteModule";

//jsonの型に合わせる
type DescriptionTranslationsJson = { descriptionTranslations: TranslationItem[] };

export class DescriptionPage extends MainTemplate{
    ChangeContentsLanguage(): void{
        const TranslateByPage = (json: DescriptionTranslationsJson, language: SelectableLanguage) => {
            super.ApplyTranslationsById(json.descriptionTranslations, language);
        }

        super.ChangeLanguage(TranslateByPage,"./../json/page/description.json");
    }
}