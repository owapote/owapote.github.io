import { GetLocalStorage } from "@util/localStorageWrapper";
import { SelectableLanguageValues } from "../src/websiteModule";
import type { SelectableLanguage } from "../src/websiteModule";

type TranslateByPageFn<T> = (json: T, language: SelectableLanguage) => void;
export type TranslationItem = { id: string; translations: Record<SelectableLanguage, string> };

export class MainTemplate{

    ApplyTranslationsById(
        items: readonly TranslationItem[],
        language: SelectableLanguage,
    ): void {
        for (const { id, translations } of items) {
            const element = document.querySelector<HTMLElement>(`#${id}`);
            if (element) element.textContent = translations[language];
        }
    }   

    async LoadHeaderTranslate<T>(
        TranslateByPage: TranslateByPageFn<T>, 
        url: string, language: SelectableLanguage
    ): Promise<void> {
        try {
            //jsonより、HTMLに挿入
            const response = await fetch(url);
            if(!response.ok) throw new Error(`${response.status}Error ${url}の取得に失敗しました:${response.statusText}`);
            const json = await response.json() as T;
            TranslateByPage(json,language);
        } catch (error) {
            console.error("headerのTranslateに失敗しました:", error);
        }
    }

    /**
     * 言語を切り替える
     * @param TranslateByPage 
     * @param url 
     */
    ChangeLanguage<T>(TranslateByPage: TranslateByPageFn<T>, url: string): void{
        let language;

        //初期設定
        language = GetLocalStorage<SelectableLanguage>("userLanguage", SelectableLanguageValues.Japanese);
        if(!language) language = SelectableLanguageValues.Japanese;
        else {
            const selector = document.querySelector<HTMLSelectElement>("#languageSelector");
            if(selector) selector.value = language;
        }

        this.LoadHeaderTranslate(TranslateByPage,url,language);
    }
}