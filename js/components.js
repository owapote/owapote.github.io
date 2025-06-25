import { ComponentBaseMixin } from "./interface/componentTemplate.js";

export const OwapoteNewsComponent = {
    mixins:[ComponentBaseMixin],
    data(){
        return {
            owapoteNews:[]
        };
    },
    async mounted(){
        await this.Load();
    },
    methods:{
        async Load(){
            try {
                const data = await $.ajax({
                    url: "./../json/owapoteNews.json",
                    dataType: "json",
                    type: "GET",
                });
                //[GPT]変更: KO時代の .owapoteNews(data.news) は不要！
                //this.owapoteNews(data.owapoteNews);
                this.owapoteNews =data.owapoteNews;
            } catch (error) {
                console.error("owapoteNews.jsonの取得に失敗しました:", error);
            }
        }
    }
}