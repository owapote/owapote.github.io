import { HashBinding } from "../services/hashBinding.js";
import { YouTubeAPI }  from "../services/youtubeAPI.js";

//HACK:構造ごとシングルトンにしても良いかもしれない
export const binder = new HashBinding();
export const youtubeAPI = new YouTubeAPI();
