import { MenuKind } from "./websiteModule.js";

export class HashBinding {
    constructor() {
        this.hasBound = false;
        this.selectedLanguage = ko.observable(localStorage.getItem("userLanguage"));
        this.owapoteNews = ko.observableArray([]);
    }

    //一回だけapplyBindings
    ApplyBindingsOnce(json, targetNode) {
        if (!this.hasBound) {
            ko.applyBindings(json, targetNode);
            this.hasBound = true;
        }
    }

    //owapoteNewsの表示とbinding
    ShowOwapoteNews(){
        const language = localStorage.getItem("userLanguage");
        $.ajax({
            url: "./../json/owapoteNews.json",
            dataType: "json",
            type: "GET",
        }).done((data) => {
            const targetNode = document.getElementById("owapoteNews");
            this.selectedLanguage(language);
            this.owapoteNews(data.owapoteNews);
            const viewModel = {
                selectedLanguage: this.selectedLanguage,
                owapoteNews: this.owapoteNews
            };
            this.RemoveBinding(targetNode);
            this.ApplyBindingsOnce(viewModel,targetNode);
        });
    }

    //bindingの解除
    RemoveBinding(targetNode){
        if(this.hasBound){
            ko.cleanNode(targetNode);
            this.hasBound = false;
        }
    }
}