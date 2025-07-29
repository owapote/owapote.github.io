import { ComponentBaseMixin } from "../interface/componentTemplate.js";
import { MenuKind } from "../websiteModule.js";
import { TopPageReLoadSetting } from "./../page/topPage.js";
import { SelectableLanguage } from "../websiteModule.js";

export const HeaderNavComponent = {
    mixins:[ComponentBaseMixin],
    data(){
        return {
            headerNav:[],
            MenuKind,       //[GPT]外部定数もバインドに使う
        };
    },
    async mounted(){
        await this.Load();
    },
    methods:{
        async Load(){
            try {
                const responce = await fetch("./../json/header.json");
                const data = await responce.json();

                this.headerNav = data;
            } catch (error) {
                console.error("header.jsonの取得に失敗しました:", error);
            }
        },
        onClick(menuKind){
            //TopPageReLoadSettingのフラグを全て立てる
            const allFlags = Object.values(TopPageReLoadSetting).reduce((acc, val) => acc | val, 0);
            AddToChangeContentWithButton(menuKind, allFlags);
        }
    }
}