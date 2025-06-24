export class ViewModelBase{
    constructor(selectedLanguage){
        this.selectedLanguage = selectedLanguage;
    }

    async Load(){
        throw new Error("派生クラスで実装をしてね");
    }
}