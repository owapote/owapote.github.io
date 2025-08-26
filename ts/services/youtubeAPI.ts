import { FetchJson } from "@util/jsonLoader";

//youtubeAPIから帰ってくる型を定義しておく
type YouTubePlaylistItemsResponse = {
    items: Array<{
        snippet: {
            resourceId: { 
                videoId: string
            };
        };
    }>;
};

export class YouTubeAPI{
    private iframeCaches: Map<string, HTMLIFrameElement[]>;
    constructor() {
        this.iframeCaches = new Map<string, HTMLIFrameElement[]>();
    }

    /**
     * APIリクエストを送信して動画データを取得する(初回のみ)
     * @param {*} playlistId 再生リストのID
     * @param {*} maxResults 取得する動画の最大件数
     */
    async GetYouTubePlayListVideo(playlistId: string, maxResults: number): Promise<void>{
        const worksName = "owapoteweb"; //works名
        const uniqueId = "owapote0914"; //名前+ランダム付与されたID(discord的な)

        //YouTube Data APIのURLを構築
        const apiUrl = `https://${worksName}.${uniqueId}.workers.dev/?maxResults=${maxResults}&playlistId=${playlistId}`;

        const data = await FetchJson<YouTubePlaylistItemsResponse>(apiUrl);

        const iframes: HTMLIFrameElement[] = new Array();
        data.items.forEach(item => {
            //動画のIDを取得
            const videoId = item.snippet.resourceId.videoId;

            //ショート動画の要素を決定
            let iframe = document.createElement('iframe');
            iframe.title = "owapote GeoGuessr";
            iframe.width = "315";
            iframe.height = "560";
            iframe.loading = "lazy";
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            iframe.sandbox = "allow-scripts allow-same-origin allow-presentation";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;

            iframes.push(iframe);
        });

        //キャッシュ化
        this.iframeCaches.set(playlistId,iframes);
        //初回表示
        this.AppendIframesToContainer(playlistId, "youtubeShortsGeoGuessrContents");
    }

    /**
     * GetYouTubePlayListVideo()で取得した動画をHTMLに追加する
     * @param {*} playlistId 再生リストのID
     * @param {*} containerId タグのID
     * @returns v
     */
    AppendIframesToContainer(playlistId: string, containerId: string): void {
        const container = document.querySelector<HTMLDivElement>(`#${containerId}`);

        if (!container) return;
        if(!this.iframeCaches.has(playlistId)) return;

        const iframes = this.iframeCaches.get(playlistId);
        if(!iframes) return;    //undefined対策

        container.textContent = "";
        const fragment = document.createDocumentFragment();
        iframes.forEach(iframe => {
            fragment.appendChild(iframe);
        });
        container.appendChild(fragment);
    }
}