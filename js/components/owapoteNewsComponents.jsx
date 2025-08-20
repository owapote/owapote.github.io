import { SetBaseFunction } from "../interface/componentTemplate.js";
import React from "react";
import ReactDOM from "react-dom";

let _owapoteNewsCache = null;

function OwapoteNewsComponent(){
    const [owapoteNews, SetOwapoteNews] = React.useState([]);
    const [activeNews , SetActiveNews]  = React.useState(null);   //今開いているニュース
    const [isClosing  , SetIsClosing]   = React.useState(false);

    const language   = localStorage.getItem("userLanguage")   || "jp";        
    const colorTheme = localStorage.getItem("userColorTheme") || "lightMode";

    //初期設定
    React.useEffect(()=>{
        //繰り返し使用
        if(_owapoteNewsCache){
            SetOwapoteNews(_owapoteNewsCache);
        }else{
            //初回アクセス時
            (async function LoadFallback(){
                try {
                    const response = await fetch("./../json/owapoteNews.json");
                    const data = await response.json();
                    //idを自動で振り分ける
                    const newsMap = data.owapoteNews.map((item,index)=>{
                        return{
                            ...item,
                            "id": index + 1
                        };
                    });
                    //LoadOwapoteNews()でも使えるように
                    _owapoteNewsCache = newsMap;
                    SetOwapoteNews(newsMap);
                } catch (error) {
                    console.error("owapoteNews.jsonの取得に失敗しました:", error);
                }
            })();
        }
    }, []);

    //newsを降順で出す
    const reversedOwapoteNews = React.useMemo(() => {
        return [...owapoteNews].reverse();
    },[owapoteNews]);

    const OpenOwapoteNewsModal = (news) =>{
        SetActiveNews(news);
        SetIsClosing(false);
        document.body.classList.add("modal-active");
    };

    const CloseOwapoteNewsModal = () =>{
        SetIsClosing(true);
        setTimeout(()=>{
            SetActiveNews(null);
            SetIsClosing(false);
            document.body.classList.remove("modal-active");
        },500);
    };

    return (
        <>
            <div>
                {reversedOwapoteNews.map((item) => (
                    <div key={item.id}>
                        <button onClick={() => OpenOwapoteNewsModal(item)} className="owapoteNewsContent">
                            <section className="owapoteNewsContentBackGround">
                                <img src={item.imagePath[colorTheme]} alt="" />
                                <section>
                                    <h2>{item.title[language]}</h2>
                                    <p>{item.description[language]}</p>
                                </section>
                            </section>
                        </button>
                    </div>
                ))}
            </div>
            {activeNews && ReactDOM.createPortal(
                <div id="modalWrapperSketch" className={isClosing?"out":""}>
                    <div className="modalBackground" onClick={CloseOwapoteNewsModal}>
                        
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <h2>{activeNews.title[language]}</h2>
                            <p>{activeNews.description[language]}</p>
                            <svg className="modal-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none">
                                <rect x="0" y="0" fill="none" width="100%" height="100%" rx="3" ry="3"></rect>
                            </svg>
                        </div>
                    </div>
                </div>, document.getElementById("owapoteNewsModalRoot")
            )}
        </>
    );
}

async function LoadOwapoteNews(){
    try {
        const response = await fetch("./../json/owapoteNews.json");
        const data = await response.json();
        //idを自動で振り分ける
        const newsMap = data.owapoteNews.map((item,index)=>{
            return{
                ...item,
                "id": index + 1
            };
        });
        _owapoteNewsCache = newsMap;
    } catch (error) {
        console.error("owapoteNews.jsonの取得に失敗しました:", error);
    }
};

export default SetBaseFunction(OwapoteNewsComponent, LoadOwapoteNews);