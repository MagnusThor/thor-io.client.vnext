

export class VideoConstraints {


    constructor(public bitrate: number, public height: number) {

    }

    public async setVideoParams(sender: RTCRtpSender): Promise<any> {


        await sender.track.applyConstraints({ height: this.height });
        
    //     console.log(`rtpSender track ${sender.track.id} ${sender.track.kind}`);
        
    //     const ratio = sender.track.getSettings().height / this.height;
    //     const params = sender.getParameters();


    //     console.log(params,params.encodings)


    //     if (!params["encodings"][0]) {
    //         params["encodings"] = [{ scaleResolutionDownBy: 0, maxBitrate: 0 }];
    //     }
        
    //     params["encodings"][0].scaleResolutionDownBy = Math.max(ratio, 1);
    //     params["encodings"][0].maxBitrate = this.bitrate;
    

    //   //  sender.setParameters(params);

     //   console.log(sender);

       // if (sender.getParameters()["encodings"][0].scaleResolutionDownBy == 1) {
        
          //  await sender.track.applyConstraints({ height: this.height });
       // }
    }
}