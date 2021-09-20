/*
    Youtube playlist downloader
    version: 1.0.0
*/

// Load dependency
import fs from 'fs'
import YoutubePlaylist from './class/playlist.youtube'
import DLitem from './class/interface/item.dlqueue'
import YtdlDl from './class/dl.ytdl'

// Initial readline
import RL from 'readline'
const readline = RL.createInterface({
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
        const target = '/output/' + await ytpl.getPlaylistTitle()
        if (!fs.existsSync('.'+target)){
            fs.mkdirSync('.'+target);
        }
        if (!fs.existsSync('./tmp/audio'+target)){
            fs.mkdirSync('./tmp/audio'+target);
        }
        if (!fs.existsSync('./tmp/video'+target)){
            fs.mkdirSync('./tmp/video'+target);
        }

        // Loop download
        let Dlqueue:Array<DLitem> = []
        for(let i = 0; i < playlist.length; i++) {
            // Push video to queue
            console.log('Add '+playlist[i].snippet.title+' to queue')
            Dlqueue.push({
                videoName: target +'/'+ playlist[i].snippet.title+'.mp4',
                videoUrl: 'http://www.youtube.com/watch?v='+playlist[i].contentDetails.videoId
            })
        }

        console.log('Start downloading...')
        new YtdlDl(Dlqueue)

    }
    catch(e){
        console.log('Error: ' + e)
    }
    readline.close();
});