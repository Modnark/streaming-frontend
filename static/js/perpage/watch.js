// Globals

// Elements
const watchPageVideo = document.getElementById('WatchPage_VideoPlayer');
const liveIndicatorText = document.getElementById('WatchPage_LiveStatusText');
const liveIndicatorIcon = document.getElementById('WatchPage_LiveStatus');

// Variables
const retryTimeout = 5; // seconds
const maxRetriesAfterStreamConnect = 10;
const channelId = watchPageVideo.dataset.channelid;
let streamPlaying = false;
let hls = undefined;
let retryCount = 0;

function updateIndicator(isLive) {
    liveIndicatorText.style.color = isLive ? red : '#000000';
    liveIndicatorText.innerText = isLive ? 'LIVE' : 'Offline';
    liveIndicatorIcon.style.display = isLive ? 'inline-block' : 'none';
}

function isVideoPlaying() {
    return !!(
        watchPageVideo.currentTime > 0 &&
        !watchPageVideo.paused &&
        !watchPageVideo.ended &&
        watchPageVideo.readyState >= 3
      );    
}

// Get the public key
// TODO: make a /getpublickey api for this, would be much better
async function getPublicKey() {
    const res = await fetch(`/api/stream/v1/get-stream-id/${channelId}`);
    const jsonRes = await res.json();
    if(res.ok)
        return jsonRes.streamId;
    return false;
}

// Get the URL for the stream
async function getStreamUrl() {
    try {
        const publicKey = await getPublicKey();
        if(publicKey)
            return `https://stream.modnark.xyz/streams/${publicKey}_dat.m3u8`;
    } catch(error) {
        console.error(`Error in getStreamUrl() ${error}`);
    }
    return false;
}

// Check if the stream is live
async function isLive() {
    try {
        const res = await fetch(`https://stream.modnark.xyz/api/v1/user/is-live/${channelId}`);
        return res.ok;
    } catch(error) {
        console.error(`Error in isLive() ${error}`);
    }
    return false;
}

// Load the video into the player.
// TODO: only play after play button is clicked, stop doing stuff when stopped
async function loadVideo() {
    if(Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(await getStreamUrl());
        hls.attachMedia(watchPageVideo);
        hls.on(Hls.Events.MANIFEST_PARSED, () => watchPageVideo.play());
    }
}

// Keeps the stream going
async function keepAlive() {
    const streamUrl = await getStreamUrl();
    const isStreamLive = await isLive(streamUrl);

    if(isStreamLive) {
        if(!streamPlaying) {
            streamPlaying = true;
            initPlayer();
        }
        return;
    }

    if(streamPlaying) {
        endLiveStream();
    }
}

// Start playing the video (if live else retry)
async function initPlayer() {
    await loadVideo();
}

// This will be called if the stream stops
function endLiveStream() {
    updateIndicator(false);
    watchPageVideo.style.backgroundImage = 'url("/img/nosig.png")';
    watchPageVideo.style.backgroundSize = 'auto 100%';
    watchPageVideo.style.backgroundPosition = 'center';
    watchPageVideo.style.backgroundRepeat = 'no-repeat';
    watchPageVideo.style.backgroundColor = '#000000';
    watchPageVideo.pause();
    streamPlaying = false;
    
    if(hls)
        hls.destroy();
}

// Start keepalive loop
setInterval(keepAlive, retryTimeout * 1000);
keepAlive(); // Call once