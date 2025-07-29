export const ComponentBaseMixin = {
    inject: ["language","colorTheme"],
    methods: {
        async Load(){
            throw new Error("派生クラスで実装をしてね");
        }
    }
}