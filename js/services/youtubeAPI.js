export class YouTubeAPI{
    constructor() {
        this.iframeCaches = new Map();
    }

    /**
     * APIリクエストを送信して動画データを取得する(初回のみ)
     * @param {*} playlistId 再生リストのID
     * @param {*} maxResults 取得する動画の最大件数
     */
    GetYouTubePlayListVideo(playlistId, maxResults){
        const worksName = "owapoteweb"; //works名
        const uniqueId = "owapote0914"; //名前+ランダム付与されたID(discord的な)

        //YouTube Data APIのURLを構築
        const apiUrl = `https://${worksName}.${uniqueId}.workers.dev/?maxResults=${maxResults}&playlistId=${playlistId}`;

        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            let iframes = new Array();
            data.items.forEach(item => {
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
        })
        .catch(error => {
            console.error("YouTube APIの取得に失敗しました:", error);
        });
    }

    /**
     * GetYouTubePlayListVideo()で取得した動画をHTMLに追加する
     * @param {*} playlistId 再生リストのID
     * @param {*} containerId タグのID
     * @returns 
     */
    AppendIframesToContainer(playlistId, containerId) {
        const container = document.getElementById(containerId);

        if (!container) return;
        if(!this.iframeCaches.has(playlistId)) return;

        const iframes = this.iframeCaches.get(playlistId);
        iframes.forEach(iframe => {
            container.appendChild(iframe);
        });
    }
}