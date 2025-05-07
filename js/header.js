const SelectableLanguage = Object.freeze({
    Japanese: "jp",
    English: "en",
    TokiPona: "tokipona",
});

//ヘッダーのボタンなどのイベントを追加
function InitHeaderEvent(){
    AddToChangeColorModeEvent();
    AddToChangeLanguageEvent();
}

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
        });

        //jsonより、HTMLに挿入
        Translate = (json) => {
            $(document).ready(function () {
                $("#headerText").text(json["headerText"][language]);
                $("#topPageNav").text(json["topPageNav"][language]);
                $("#discriptionNav").text(json["discriptionNav"][language]);
                $("#interestListNav").text(json["interestListNav"][language]);
                $("#contactFormNav").text(json["contactFormNav"][language]);
            });
        }
    });
}

//ボタンに応じて表示内容を切り替える
function AddToChangeContentWithButton(num){
    var target = document.getElementById("mainTemplate");
    while(target.firstChild){
        target.removeChild(target.firstChild);
    }
    var path;
    switch(num){
        case 0:
            path = "./html/topPage.html";
            break;
        case 1:
            path = "./html/discription.html";
            break;
        case 2:
            path = "./html/interestList.html";
            break;
        case 3:
            path = "./html/contactForm.html";
            break;
        default:
            path = "./html/topPage.html";
            break;
    }
    $(target).load(path);
    target.appendChild(createDiv);
}