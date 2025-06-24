import { ViewModelBase } from "./interface/viewModelTemplate.js";

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