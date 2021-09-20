/*
    Youtube Playlist official
    version: 1.0.0
*/
import { YoutubePlaylistInterface } from './interface/playlist.youtube'
const axios = require('axios');
require('dotenv').config()

export class YoutubePlaylist implements YoutubePlaylistInterface {
    private playlist_id:String = '' // Playlist id

    constructor (url:String) {
        let temp_ytpl_id = url.match(/[&?]list=([^&/]+)/i)
        if(temp_ytpl_id && temp_ytpl_id?.length >= 1)
            this.playlist_id = temp_ytpl_id[1]
    }

    getPlId() {
        return this.playlist_id
    }

    async getItem () {
        const data = await axios.get('https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId='+ this.playlist_id +'&key='+process.env.YT_API,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return data.data.items
    }
}