const SelectableLanguage = Object.freeze({
    Japanese: "jp",
    English: "en",
    TokiPona: "tokipona",
});

$(function(){
    let language;
    let isDayMode = true;

    language = localStorage.getItem("userLanguage");
    if(language == null) language = SelectableLanguage.Japanese;
    else $("#languageSelector").val(language);

    $.ajax({
        url: "./../json/topPage.json",
        dataType: "json",
        type: "GET",
    }).done(function (data){
        Translate(data);
    });

    let colorTheme = localStorage.getItem("userColorTheme");
    if (colorTheme != null && colorTheme === "nightMode") {
        isDayMode = false;
        $("#colorThemeToggleButton").toggleClass("is-night");
        $(document.body).addClass("darkMode");
    }

    setTimeout(function(){
        $(document.body).addClass("enableTransition");
    },100);

    //言語設定
    $("#languageSelector").change(function() {
        let getLanguage = $("option:selected").val();
        
        if(Object.values(SelectableLanguage).includes(getLanguage)){
            language = getLanguage;
            localStorage.setItem("userLanguage",language);

            $.ajax({
                url: "./../json/topPage.json",
                dataType: "json",
                type: "GET",
            }).done(function (data){
                Translate(data);
            });
        }else{
            alert("This language cannot selected:"+SelectableLanguage[getLanguage]);
        }
    });

    //カラーテーマの切り替え
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

    //言語を変換する
    Translate = (json) => {
        $(document).ready(function () {
            $("#headerText").text(json["headerText"][language]);
            $("#topPageNav").text(json["topPageNav"][language]);
            $("#discriptionNav").text(json["discriptionNav"][language]);
            $("#interestListNav").text(json["interestListNav"][language]);
            $("#contactFormNav").text(json["contactFormNav"][language]);
            $("#contentText").text(json["contentText"][language]);
        });
    }
});

