class ViewModelBase{
    constructor(selectedLanguage){
        this.selectedLanguage = selectedLanguage;
    }

    async Load(){
        throw new Error("派生クラスで実装をしてね");
    }
}

export class OwapoteNewsViewModel extends ViewModelBase{
    constructor(selectedLanguage){
        super(selectedLanguage);
        this.owapoteNews = ko.observableArray([]);
    }

    async Load(){
        try {
            const data = await $.ajax({
                url: "./../json/owapoteNews.json",
                dataType: "json",
                type: "GET",
            });
            this.owapoteNews(data.owapoteNews);
        } catch (error) {
            console.error("owapoteNews.jsonの取得に失敗しました:", error);
        }
    }
}

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

    //owapoteNewsの表示とbinding
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