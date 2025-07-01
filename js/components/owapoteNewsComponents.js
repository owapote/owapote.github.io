import { ComponentBaseMixin } from "../interface/componentTemplate.js";

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
                const responce = await fetch("./../json/owapoteNews.json");
                const data = await responce.json();
                this.owapoteNews = data.owapoteNews;
            } catch (error) {
                console.error("owapoteNews.jsonの取得に失敗しました:", error);
            }
        }
    }
}