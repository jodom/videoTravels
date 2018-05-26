
// Elements
var video = document.getElementById("video");
var path = document.getElementById("path")
var interpolator = svgPathInterpolator(path);
var marker = document.getElementById("marker");
var outputEl = document.getElementById("timer");

// Variables
var DURATION = 0;
var startTime = 0;
var videoPlaying = false;

////////////////////////////YTPLAYERCODE////////////////////////
// player = null, duration = 1;
// this is called once the youtube API is fully loaded
function onYouTubeIframeAPIReady() {
    player = new YT.Player('video', {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// this is called once the player is set up
// we can start interacting with the player now...
function onPlayerReady(event) {
    DURATION = player.getDuration();
    console.log(` Video duration : ${DURATION}`);
    outputEl.textContent = "ready";
}

video.style.borderColor = '#FF6D00';

// this function is called every time the players state changes
function onPlayerStateChange(event) {
    changeBorderColor(event.data);
    if (event.data == YT.PlayerState.PLAYING) {
        videoPlaying = true;
        startTime = Date.now();
        // run animation
        frame();
        outputEl.textContent = "playing";
    }
    if (event.data == YT.PlayerState.PAUSED) {
        // pause animation
        pauseFrame();
        outputEl.textContent = "paused";
    }
}

function changeBorderColor(playerStatus) {
    var color;
    if (playerStatus == -1) {
        color = "#37474F"; // unstarted = gray
    } else if (playerStatus == 0) {
        color = "#FFFF00"; // ended = yellow
    } else if (playerStatus == 1) {
        color = "#33691E"; // playing = green
    } else if (playerStatus == 2) {
        color = "#DD2C00"; // paused = red
    } else if (playerStatus == 3) {
        color = "#AA00FF"; // buffering = purple
    } else if (playerStatus == 5) {
        color = "#FF6DOO"; // video cued = orange
    }
    if (color) {
        video.style.borderColor = color;
    }
}

//////////////////////////////////SVGCODE///////////////////////////

// this function will be called in every frame
function frame() {
    var elapsed = player.getCurrentTime();
    console.log(`animate for ${DURATION - elapsed} seconds`);

    var time = elapsed;

    if (time > DURATION) {
        time = DURATION;
    }

    // TODO: animation too fast, rethink this ...?
    var alpha = time / DURATION;
    var coords = interpolator(alpha);

    marker.setAttribute("cx", coords.x);
    marker.setAttribute("cy", coords.y);

    if (time < DURATION && videoPlaying) {
        window.requestAnimationFrame(frame);
    }
}

function pauseFrame() {
    videoPlaying = false;
    console.log("pause animation");
}

// ------------------------ interpolation function ------------------------

// SVG path interpolator - simply use methods provided by SVG path element!
function svgPathInterpolator(pathElement) {

    var length = path.getTotalLength();

    return function (alpha) {
        alpha = Math.min(1, Math.max(alpha, 0));
        return pathElement.getPointAtLength(alpha * length);
    }
}