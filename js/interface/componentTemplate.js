export const ComponentBaseMixin = {
    inject: ["language"],
    methods: {
        async Load(){
            throw new Error("派生クラスで実装をしてね");
        }
    }
}