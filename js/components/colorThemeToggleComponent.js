import { ComponentBaseMixin } from "../interface/componentTemplate.js"

export const ColorThemeToggleComponent = {
    mixins:[ComponentBaseMixin],
    data(){
        return{
            isDayMode:true,
            colorTheme:localStorage.getItem("userColorTheme") || "lightMode"
        };
    },
    //初期設定
    mounted(){
        const button = document.querySelector("#colorThemeToggleButton");

        if (this.colorTheme === "nightMode") {
            this.isDayMode = false;
            button?.classList.add("is-night");
            document.body.classList.add("darkMode");
        }

        //ページが読み込まれた瞬間はカラーテーマのtransitionをさせないようにしている
        setTimeout(function(){
            document.body.classList.add("enableTransition");
        },100);

        //静的HTMLに対してイベント登録
        if (button) {
            button.addEventListener("click", this.onChange);
        }
    },
    methods: {
        //イベント
        async onChange() {
            this.isDayMode = !this.isDayMode;
            const button = document.getElementById("colorThemeToggleButton");
            if (this.isDayMode) {
                localStorage.setItem("userColorTheme", "lightMode");
                button?.classList.remove("is-night");
                document.body.classList.remove("darkMode");
            } else {
                localStorage.setItem("userColorTheme", "nightMode");
                button?.classList.add("is-night");
                document.body.classList.add("darkMode");
            }
        }
    }
};