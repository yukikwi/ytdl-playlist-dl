/*
    Youtube playlist downloader
    version: 1.0.0
*/

// Load dependency
const fs = require('fs');
const ytdl = require('ytdl-core');
const ytlist = require('youtube-playlist');

// Initial regax expression
const yt_playlist_re = /[&?]list=([^&]+)/i  // Regax to parse playlist id from url

// Initial readline
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

// Get user input playlist url
readline.question('Enter playlist url (youtube)?', async (url:String) => {
    console.log('Fetch video under given url ('+ url +') ...')
    try{
        // Fetch video in playlist
        const playlist = ( await ytlist(url, 'url') ).data.playlist
        console.log('Recived total '+playlist.length+' videos')

        const target = './output' + url.match(yt_playlist_re)
        // Create download target folder
        if (!fs.existsSync(target)){
            fs.mkdirSync(target);
        }

        // Loop download
        for(let i = 0; i < playlist.length; i++) {
            console.log(playlist[i])
        }
        return true
    }
    catch(e){
        console.log('Error: ' + e)
        return false
    }
});