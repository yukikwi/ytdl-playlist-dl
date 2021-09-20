/*
    Youtube playlist downloader
    version: 1.0.0
*/

// Load dependency
const fs = require('fs');
const ytdl = require('ytdl-core');
const { YoutubePlaylist } = require('./class/playlist.youtube')

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
        let ytpl = new YoutubePlaylist(url)
        const playlist:Array<any> = await ytpl.getItem()
        console.log('Recived total '+playlist.length+' videos')

        // Create download target folder
        const target = './output/' + ytpl.getPlId()
        if (!fs.existsSync(target)){
            fs.mkdirSync(target);
        }

        // Loop download
        for(let i = 0; i < playlist.length; i++) {
            console.log('Add '+playlist[i].snippet.title+' to queue')
            await (ytdl('http://www.youtube.com/watch?v='+playlist[i].contentDetails.videoId, {
                quality: 'highest'
            }))
            .pipe(fs.createWriteStream(target +'/'+ playlist[i].snippet.title+'.mp4'));
        }
    }
    catch(e){
        console.log('Error: ' + e)
    }
    readline.close();
});