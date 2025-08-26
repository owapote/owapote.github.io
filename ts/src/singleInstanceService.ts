import { HashBinding } from "../services/hashBinding";
import { YouTubeAPI }  from "../services/youtubeAPI";

//HACK:構造ごとシングルトンにしても良いかもしれない
export const binder = new HashBinding();
export const youtubeAPI = new YouTubeAPI();
