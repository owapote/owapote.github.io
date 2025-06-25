export class HashBinding {
    constructor() {
        this.hasBoundNodes = new WeakMap(); //targetNode, boundFlag
        this.selectedLanguage = Vue.ref(localStorage.getItem("userLanguage"));
    }

    // 多重バインドされないapplyBindings
    ApplyBindingsToNode(componentOptions, targetNode, componentDefinition) {
        if(this.hasBoundNodes.get(targetNode)){
            //ko.cleanNode(targetNode);
            //に相当
            const prevApp = this.hasBoundNodes.get(targetNode);
            prevApp.unmount();
        }
        //ko.applyBindings(viewModel, targetNode);
        //に相当
        const app = Vue.createApp(componentDefinition,componentOptions);
        app.mount(targetNode);

        this.hasBoundNodes.set(targetNode, true);
    }

    //ViewModelの表示とbinding
    async ShowViewModel(componentModule, targetNodeID){
        this.selectedLanguage.value = localStorage.getItem("userLanguage");
        const targetNode = document.querySelector(targetNodeID);

        //const viewModel = new viewModelClass(this.selectedLanguage);
        //に相当する
        const componentDefinition = componentModule;
        const componentOptions = {selectedLanguage: this.selectedLanguage};

        console.log(componentDefinition);
        if(componentDefinition){
            if(componentDefinition.methods && componentDefinition.methods.Load){
                await componentDefinition.methods.Load.call(componentOptions);
            }
            this.ApplyBindingsToNode(componentOptions,targetNode,componentDefinition);
        }

    }
}