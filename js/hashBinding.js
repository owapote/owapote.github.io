export class HashBinding {
    constructor() {
        this.hasBoundNodes = new WeakMap(); //targetNode, VueApp
        this.language = Vue.ref(localStorage.getItem("userLanguage"));
        this.colorTheme = Vue.ref(localStorage.getItem("userColorTheme"));
    }

    // 多重バインドされないapplyBindings
    ApplyBindingsToNode(targetNode, componentDefinition) {
        if(this.hasBoundNodes.get(targetNode)){
            const prevApp = this.hasBoundNodes.get(targetNode);
            prevApp.unmount();
        }
        const app = Vue.createApp(componentDefinition);
        app.provide("language",this.language);
        app.provide("colorTheme",this.colorTheme);
        app.mount(targetNode);

        this.hasBoundNodes.set(targetNode, app);
    }

    /**
     * Componentの表示とbinding
     * @param {*} componentModule Componentのクラス
     * @param {*} targetNodeID 設置したい親要素
     */
    async ShowComponent(componentModule, targetNodeID){
        this.language.value = localStorage.getItem("userLanguage");
        this.colorTheme.value = localStorage.getItem("userColorTheme");
        const targetNode = document.querySelector(targetNodeID);

        const componentDefinition = componentModule;
        if(componentDefinition){
            if(componentDefinition.methods && componentDefinition.methods.Load){
                await componentDefinition.methods.Load();
            }
            this.ApplyBindingsToNode(targetNode,componentDefinition);
        }
    }
}