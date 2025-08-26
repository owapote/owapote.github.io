import type { ColorTheme, SelectableLanguage } from "../src/websiteModule";

export type OwapoteNewsItemRaw = {
    imagePath: Record<ColorTheme, string>;
    title: Record<SelectableLanguage, string>;
    translations: Record<SelectableLanguage, string>;
};

export type OwapoteNewsItem = OwapoteNewsItemRaw & {
    id: number;
}

export type OwapoteNewsDataRaw = { owapoteNewsItem: OwapoteNewsItemRaw[] };
export type OwapoteNewsData = { owapoteNews: OwapoteNewsItem[] };
