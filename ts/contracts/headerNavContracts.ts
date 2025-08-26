import type { MenuKind, SelectableLanguage } from "../src/websiteModule";

export type HeaderNavItem = {
    menuKind: MenuKind;
    translations: Record<SelectableLanguage, string>;
};

export type HeaderNavData = { headerNavItems: HeaderNavItem[] };
