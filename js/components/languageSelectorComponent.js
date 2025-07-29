import { ComponentBaseMixin } from "../interface/componentTemplate.js"
import { TopPageReLoadSetting } from "./../page/topPage.js";
import { SelectableLanguage } from "../websiteModule.js";

export const LanguageSelectorComponent = {
    mixins:[ComponentBaseMixin],
    //初期設定
    mounted(){
        document.documentElement.lang = this.language.value;
    },
    methods: {
        //イベント
        async onChange(event) {
            const newLang = event.target.value;
            if (Object.values(SelectableLanguage).includes(newLang)) {
                this.language = newLang;
                localStorage.setItem("userLanguage", newLang);
                document.documentElement.lang = newLang;

                const current = Number(localStorage.getItem("nowContent"));
                const allFlags = Object.values(TopPageReLoadSetting).reduce((acc, val) => acc | val, 0);
                AddToChangeContentWithButton(current, allFlags);
            } else {
                alert("This language cannot be selected: " + newLang);
            }
        }
    }
};