import { ComponentBaseMixin } from "../interface/componentTemplate.js"
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
            console.log(newLang);
            if (Object.values(SelectableLanguage).includes(newLang)) {
                this.language = newLang;
                localStorage.setItem("userLanguage", newLang);
                document.documentElement.lang = newLang;

                const current = Number(localStorage.getItem("nowContent"));
                AddToChangeContentWithButton(current);
            } else {
                alert("This language cannot be selected: " + newLang);
            }
        }
    }
};