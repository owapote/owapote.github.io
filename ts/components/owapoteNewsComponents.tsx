import { GetLocalStorage, SetLocalStorage } from "@util/localStorageWrapper";
import { SetBaseFunction } from "../interface/componentTemplate";
import React from "react";
import { createPortal } from "react-dom";
import { SelectableLanguageValues } from "ts/src/websiteModule";
import type { ColorTheme, SelectableLanguage } from "ts/src/websiteModule";
import { OwapoteNewsData, OwapoteNewsDataRaw, OwapoteNewsItem } from "@contracts/owapoteNewsContracts";
import { FetchJson } from "@util/jsonLoader";

const OWAPOTE_NEWS_URL = "./../json/owapoteNews.json";

let _owapoteNewsCache: OwapoteNewsData | null = null;

function OwapoteNewsComponent(){
    const [owapoteNews, setOwapoteNews] = React.useState<OwapoteNewsData | null>(null);
    const [activeNews , setActiveNews]  = React.useState<OwapoteNewsItem | null>(null);   //今開いているニュース
    const [isClosing  , setIsClosing]   = React.useState(false);

    const language   = GetLocalStorage<SelectableLanguage>("userLanguage", SelectableLanguageValues.Japanese);
    const colorTheme = GetLocalStorage<ColorTheme>("userColorTheme","lightMode");

    //初期設定
    React.useEffect(()=>{
        //繰り返し使用
        if(_owapoteNewsCache){
            setOwapoteNews(_owapoteNewsCache);
        }else{
            //初回アクセス時
            (async function LoadFallback(){
                try {
                    const data = await FetchJson<OwapoteNewsDataRaw>(OWAPOTE_NEWS_URL);
                    //idを自動で振り分ける
                    const newsMap = AssignOwapoteNewsID(data);
                    //LoadOwapoteNews()でも使えるように
                    _owapoteNewsCache = newsMap;
                    setOwapoteNews(newsMap);
                } catch (error) {
                    console.error("owapoteNews.jsonの取得に失敗しました:", error);
                    _owapoteNewsCache = null;
                    setOwapoteNews({ owapoteNews: [] });
                }
            })();
        }

        //beforeUnmountでモーダル解除
        return () => { document.body.classList.remove("modal-active"); };
    }, []);

    //newsを降順で出す
    const reversedOwapoteNews = React.useMemo<OwapoteNewsItem[]>(() => {
        return owapoteNews ? [...owapoteNews.owapoteNews].reverse() : []; //無理なら空配列を返却
    },[owapoteNews]);

    const OpenOwapoteNewsModal = (news: OwapoteNewsItem): void =>{
        setActiveNews(news);
        setIsClosing(false);
        document.body.classList.add("modal-active");
    };

    const CloseOwapoteNewsModal = (): void =>{
        setIsClosing(true);
        setTimeout(()=>{
            setActiveNews(null);
            setIsClosing(false);
            document.body.classList.remove("modal-active");
        },500);
    };

    const modalRoot = document.querySelector<HTMLElement>("#owapoteNewsModalRoot");

    return (
        <>
            <div>
                {reversedOwapoteNews.map((item: OwapoteNewsItem) => (
                    <div key={item.id}>
                        <button onClick={() => OpenOwapoteNewsModal(item)} className="owapoteNewsContent">
                            <section className="owapoteNewsContentBackGround">
                                <img src={item.imagePath[colorTheme]} alt="" />
                                <section>
                                    <h2>{item.title[language]}</h2>
                                    <p>{item.translations[language]}</p>
                                </section>
                            </section>
                        </button>
                    </div>
                ))}
            </div>
            {activeNews && modalRoot && createPortal(
                <div id="modalWrapperSketch" className={isClosing?"out":""}>
                    <div className="modalBackground" onClick={CloseOwapoteNewsModal}>
                        
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <h2>{activeNews.title[language]}</h2>
                            <p>{activeNews.translations[language]}</p>
                            <svg className="modal-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none">
                                <rect x="0" y="0" fill="none" width="100%" height="100%" rx="3" ry="3"></rect>
                            </svg>
                        </div>
                    </div>
                </div>, modalRoot
            )}
        </>
    );
}

/**
 * 各ニュースに応じて、IDの自動振り分けを行う(1から始まる連番)
 * @param rawData OwapoteNewsDataRaw型のデータ(fetchしたデータ)
 * @returns OwapoteNewsData型(id追加バージョンの型)
 */
function AssignOwapoteNewsID(rawData: OwapoteNewsDataRaw): OwapoteNewsData {
    return { 
        owapoteNews: rawData.owapoteNewsItem.map((item, index)=>({
            ...item,
            "id": index + 1
        }))
    }
};

async function LoadOwapoteNews(){
    try {
        const data = await FetchJson<OwapoteNewsDataRaw>(OWAPOTE_NEWS_URL);
        //idを自動で振り分ける
        const newsMap = AssignOwapoteNewsID(data);
        _owapoteNewsCache = newsMap;
    } catch (error) {
        console.error("owapoteNews.jsonの取得に失敗しました:", error);
        _owapoteNewsCache = null;
    }
};

export default SetBaseFunction(OwapoteNewsComponent, LoadOwapoteNews);