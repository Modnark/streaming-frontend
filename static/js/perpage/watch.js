const watchPageVideo = document.getElementById('WatchPage_VideoPlayer');

function loadVideo() {
    if(Hls.isSupported()) {
        const publicKey = watchPageVideo.dataset.publickey;
        const hls = new Hls();
        hls.loadSource(`https://stream.modnark.xyz/streams/${publicKey}_dat.m3u8`);
        hls.attachMedia(watchPageVideo);
        hls.on(Hls.Events.MANIFEST_PARSED, () => watchPageVideo.play());
    }
}

loadVideo();