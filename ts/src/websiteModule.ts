export const SelectableLanguageValues = {
    Japanese: "jp",
    English: "en",
    TokiPona: "tok",
}as const;
export type SelectableLanguage = typeof SelectableLanguageValues[keyof typeof SelectableLanguageValues];

export const ColorThemeValues = {
    LightMode: "lightMode",
    DarkMode: "nightMode",
}as const;
export type ColorTheme = typeof ColorThemeValues[keyof typeof ColorThemeValues];

export const MenuKindValues = {
    TopPage: 0,
    DescriptionPage: 1,
    MyPastimePage: 2,
    ContactFormPage: 3,
}as const;
export type MenuKind = typeof MenuKindValues[keyof typeof MenuKindValues];