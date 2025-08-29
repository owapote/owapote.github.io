import { GetLocalStorage, UserSaveDataValues } from "@util/localStorageWrapper";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { ColorThemeValues, SelectableLanguageValues } from "ts/src/websiteModule";
import type { SelectableLanguage, ColorTheme } from "ts/src/websiteModule";
import type { LoadFunction } from "../interface/componentTemplate";

//Load関数を持っている型
type ProvidedProps = { language: SelectableLanguage; colorTheme: ColorTheme };
type LoadableComponentModule = React.ComponentType<any> & { Load?: LoadFunction };
type ComponentModule = LoadableComponentModule | { default: LoadableComponentModule };

export class HashBinding {
    private hasBoundNodes: WeakMap<Element,Root>;

    constructor() {
        this.hasBoundNodes = new WeakMap<Element,Root>(); //targetNode, ReactApp
    }

    private AppProvide(): ProvidedProps{
        const language   = GetLocalStorage<SelectableLanguage>(UserSaveDataValues.Language, SelectableLanguageValues.Japanese);
        const colorTheme = GetLocalStorage<ColorTheme>(UserSaveDataValues.ColorTheme,ColorThemeValues.LightMode);
        return { language, colorTheme };
    }

    // 多重バインドされないapplyBindings
    private ApplyBindingsToNode(targetNode: Element, componentDefinition: LoadableComponentModule): void {
        const prevRoot = this.hasBoundNodes.get(targetNode);

        //prevRootがあれば再利用する
        const root = prevRoot || createRoot(targetNode);
        const element = React.createElement(componentDefinition, this.AppProvide());
        root.render(element);

        if (!prevRoot) {
            this.hasBoundNodes.set(targetNode, root);
        }
    }

    /**
     * Componentの表示とbinding
     * @param {*} componentModule Componentのクラス
     * @param {*} targetNodeID 設置したい親要素
     */
    async ShowComponent(componentModule: ComponentModule, targetNodeID: string): Promise<void>{
        const targetNode = document.querySelector(targetNodeID) as Element | null;
        if(!targetNode) return;

        const componentDefinition = (typeof componentModule === "function") ? componentModule : (componentModule && componentModule.default) || null;
        if(!componentDefinition) return;

        //抽象メソッドLoad()の呼び出し
        const possibleLoad = (typeof componentDefinition.Load === "function") ? componentDefinition.Load : null;
        if(possibleLoad){
            await possibleLoad.call(componentDefinition);
        }
        this.ApplyBindingsToNode(targetNode,componentDefinition);
    }
}