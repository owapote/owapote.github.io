export const ComponentBaseMixin = {
    props:["selectedLanguage"],
    data(){
        return {};
    },
    methods: {
        async Load(){
            throw new Error("派生クラスで実装をしてね");
        }
    }
}