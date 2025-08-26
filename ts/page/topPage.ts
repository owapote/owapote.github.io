import { MainTemplate, TranslationItem } from "../interface/mainTemplate";
import type { SelectableLanguage } from "ts/src/websiteModule";

export const TopPageReloadSetting = {
    None: 1<<0,
    ShowHeaderNav: 1<<1,
    ShowSlideShow: 1<<2,
    ShowYouTubeContents: 1<<3,
    ShowNews: 1<<4,
}as const;

//jsonの型に合わせる
type TopPageTranslationsJson = { topPageTranslations: TranslationItem[] };

export class TopPage extends MainTemplate{
    ChangeContentsLanguage(): void{
        const TranslateByPage = (json: TopPageTranslationsJson, language: SelectableLanguage) => {
            super.ApplyTranslationsById(json.topPageTranslations, language);
        }

        super.ChangeLanguage<TopPageTranslationsJson>(TranslateByPage, "./../json/page/topPage.json");
    }
}