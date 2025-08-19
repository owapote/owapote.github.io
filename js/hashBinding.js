import React from "react";
import { createRoot } from "react-dom/client";

export class HashBinding {
    constructor() {
        this.hasBoundNodes = new WeakMap(); //targetNode, ReactApp
    }

    AppProvide() {
        const language   = localStorage.getItem("userLanguage")   || "jp";
        const colorTheme = localStorage.getItem("userColorTheme") || "lightMode";
        return { language, colorTheme };
    }

    // 多重バインドされないapplyBindings
    ApplyBindingsToNode(targetNode, componentDefinition) {
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
    async ShowComponent(componentModule, targetNodeID){
        const targetNode = document.querySelector(targetNodeID);
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