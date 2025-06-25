export class HashBinding {
    constructor() {
        this.hasBoundNodes = new WeakMap(); //targetNode, boundFlag
        this.selectedLanguage = ko.observable(localStorage.getItem("userLanguage"));
    }

    // 多重バインドされないapplyBindings
    ApplyBindingsToNode(viewModel, targetNode) {
        if(this.hasBoundNodes.get(targetNode)){
            ko.cleanNode(targetNode);
        }
        ko.applyBindings(viewModel, targetNode);
        this.hasBoundNodes.set(targetNode, true);
    }

    //ViewModelの表示とbinding
    async ShowViewModel(viewModelClass, targetNodeID){
        this.selectedLanguage(localStorage.getItem("userLanguage"));
        const targetNode = document.querySelector(targetNodeID);

        const viewModel = new viewModelClass(this.selectedLanguage);
        if(viewModel){
            await viewModel.Load();
            this.ApplyBindingsToNode(viewModel,targetNode);
        }
    }
}