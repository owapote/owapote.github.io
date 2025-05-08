import { TopPage } from "./topPage.js";

const SelectableLanguage = Object.freeze({
    Japanese: "jp",
    English: "en",
    TokiPona: "tokipona",
});

const MenuKind = Object.freeze({
    TopPage: 0,
    Discription: 1,
    InterestList: 2,
    ContactForm: 3,
});

//ヘッダーのボタンなどのイベントを追加
function InitHeaderEvent(){
    AddToChangeColorModeEvent();
    AddToChangeLanguageEvent();

    AddToChangeContentWithButton(MenuKind.TopPage);
}

//type=module対策
window.InitHeaderEvent = InitHeaderEvent;
window.AddToChangeContentWithButton = AddToChangeContentWithButton;

//カラーテーマの切り替え
function AddToChangeColorModeEvent(){
    $(function(){
        let isDayMode = true;

        //初期設定
        let colorTheme = localStorage.getItem("userColorTheme");
        if (colorTheme != null && colorTheme === "nightMode") {
            isDayMode = false;
            $("#colorThemeToggleButton").toggleClass("is-night");
            $(document.body).addClass("darkMode");
        }

        //ページが読み込まれた瞬間はtransitionをさせないようにしている
        setTimeout(function(){
            $(document.body).addClass("enableTransition");
        },100);

        //イベント
        $("#colorThemeToggleButton").on("click", function() {
            isDayMode = !isDayMode;
            $(this).toggleClass("is-night");
            $(document.body).toggleClass("darkMode");

            if (isDayMode) {
                localStorage.setItem("userColorTheme", "lightMode");
            } else {
                localStorage.setItem("userColorTheme", "nightMode");
            }
        });
    });
}

//言語設定
function AddToChangeLanguageEvent(){
    $(function(){
        let language;

        //jsonより、HTMLに挿入
        const Translate = (json) => {
            $(document).ready(function () {
                $("#headerText").text(json["headerText"][language]);
                $("#topPageNav").text(json["topPageNav"][language]);
                $("#discriptionNav").text(json["discriptionNav"][language]);
                $("#interestListNav").text(json["interestListNav"][language]);
                $("#contactFormNav").text(json["contactFormNav"][language]);
            });
        }
        //初期設定
        language = localStorage.getItem("userLanguage");
        if(language == null) language = SelectableLanguage.Japanese;
        else $("#languageSelector").val(language);
        $.ajax({
            url: "./../json/header.json",
            dataType: "json",
            type: "GET",
        }).done(function (data){
            Translate(data);
        });

        //イベント
        $("#languageSelector").change(function() {
            let getLanguage = $("option:selected").val();
            
            if(Object.values(SelectableLanguage).includes(getLanguage)){
                language = getLanguage;
                localStorage.setItem("userLanguage",language);

                $.ajax({
                    url: "./../json/header.json",
                    dataType: "json",
                    type: "GET",
                }).done(function (data){
                    Translate(data);
                });
            }else{
                alert("This language cannot selected:"+SelectableLanguage[getLanguage]);
            }
            const num = localStorage.getItem("nowContent");
            AddToChangeContentWithButton(num);
        });
    });
}

//ボタンに応じて表示内容を切り替える
function AddToChangeContentWithButton(num){
    const targetHTML = document.getElementById("mainTemplate");
    const targetCSS = document.getElementById("loadCSSForContent");

    while(targetHTML.firstChild){
        targetHTML.removeChild(targetHTML.firstChild);
    }

    var usePathHTML;
    var usePathCSS;
    var pageClass;
    switch(num){
        case MenuKind.TopPage:
            usePathHTML = "./html/topPage.html";
            usePathCSS="./css/topPage.css";
            pageClass = new TopPage();
            break;
        case MenuKind.Discription:
            usePathHTML = "./html/discription.html";
            usePathCSS="./css/discription.css";
            pageClass = new TopPage();
            break;
        case MenuKind.InterestList:
            usePathHTML = "./html/interestList.html";
            usePathCSS="./css/interestList.css";
            pageClass = new TopPage();
            break;
        case MenuKind.ContactForm:
            usePathHTML = "./html/contactForm.html";
            usePathCSS="./css/contactForm.css";
            pageClass = new TopPage();
            break;
        default:
            usePathHTML = "./html/topPage.html";
            usePathCSS="./css/topPage.css";
            pageClass = new TopPage();
            break;
    }

    localStorage.setItem("nowContent", num);
    $(targetHTML).load(usePathHTML,function(){
        pageClass.ChangeContentsLanguage();
    });
    targetCSS.href = usePathCSS;
}