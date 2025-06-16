<div id="youtube-videos"></div>

export class YouTubeAPI{
    constructor(){
        this.apiKey = 'API_KEY';          //[GPT] YouTube Data APIのAPIキーを設定
    }

    //[GPT] APIリクエストを送信し、動画データを取得
    //  playlistId：再生リストのID
    //  maxResults：取得する動画の最大件数
    InsertYouTubePlayListVideo(playlistId, maxResults){
    //[GPT] YouTube Data APIのURLを構築
    this.apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=
                  ${maxResults}&playlistId=${playlistId}&key=${this.apiKey}`;

    fetch(this.apiUrl)
        .then(response => response.json())
        .then(data => {
            //[GPT] 動画表示用のコンテナを取得
            this.container = document.getElementById('youtube-videos');

            //[GPT] 各動画に対してiframeを作成して埋め込む
            data.items.forEach(item => {
                this.videoId = item.snippet.resourceId.videoId;

                this.iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${videoId}`;
                iframe.frameBorder = "0";
                iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                iframe.allowFullscreen = true;

                container.appendChild(iframe);
            });
        })
        .catch(error => {
            console.error('[GPT] YouTube APIの取得に失敗しました:', error);
        });
    }
}