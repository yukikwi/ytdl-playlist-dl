import DLitem from './interface/item.dlqueue'
import fs from 'fs'
import ytdl from 'ytdl-core'

export default class YtdlDl {
    private queue

    constructor (queue:Array<DLitem>){
        this.queue = queue
        this.worker()
    }

    worker () {
        if(this.queue.length !== 0){
            const data = this.queue.shift()
            if(typeof(data) !== 'undefined'){
                // status
                let status = 0
                // Download video
                const downloadVideo = ytdl(data?.videoUrl, {
                    quality: 'highestvideo'
                })
                downloadVideo.pipe(fs.createWriteStream('./tmp/video/'+data?.videoName));

                downloadVideo.on('end', () => {
                    status = status + 1
                    console.log('Video saved')
                    this.isBothend(status, data?.videoName)
                    //this.worker()
                })

                // Download Audio
                const downloadAudio = ytdl(data?.videoUrl, {
                    quality: 'highestaudio'
                })
                downloadAudio.pipe(fs.createWriteStream('./tmp/audio/'+data?.videoName));

                downloadAudio.on('end', () => {
                    status = status + 1
                    console.log('Audio saved')
                    this.isBothend(status, data?.videoName)
                    //this.worker()
                })
            }
            else
                return false
        }
        else
            return true
    }

    isBothend(status:Number, file:string){
        if(status === 2){
            this.ffmpegMerge(file)
            this.worker()
        }
        else
            return false;
    }

    ffmpegMerge (file:string) {
        const pathToFfmpeg = require('ffmpeg-static');
        const { exec } = require("child_process");

        exec(pathToFfmpeg+" -i './tmp/video"+ file +"' -i './tmp/audio"+ file +"' '."+file+"' ", (error:string, stdout:string, stderr:string) => {
            if (error) {
                console.log(`error: ${error}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    }
}