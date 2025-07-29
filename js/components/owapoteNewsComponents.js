import { ComponentBaseMixin } from "../interface/componentTemplate.js";

export const OwapoteNewsComponent = {
    mixins:[ComponentBaseMixin],
    data(){
        return {
            owapoteNews:[],
            activeNews: null,   //今開いているニュース
            isClosing: false
        };
    },
    async mounted(){
        await this.Load();
    },
    computed: {
        //newsを降順で出す
        reversedOwapoteNews() {
            return [...this.owapoteNews].reverse();
        }
    },
    methods:{
        async Load(){
            try {
                const responce = await fetch("./../json/owapoteNews.json");
                const data = await responce.json();
                //idを自動で振り分ける
                this.owapoteNews = data.owapoteNews.map((item,index)=>{
                    return{
                        ...item,
                        "id": index + 1
                    };
                });
            } catch (error) {
                console.error("owapoteNews.jsonの取得に失敗しました:", error);
            }
        },
        OpenOwapoteNewsModal(news){
            this.activeNews = news;
            this.isClosing = false;
            document.body.classList.add("modal-active");
        },
        CloseOwapoteNewsModal(){
            this.isClosing = true;
            setTimeout(()=>{
                this.activeNews = null;
                this.isClosing=false;
                document.body.classList.remove("modal-active");
            },500);
        },
    }
}