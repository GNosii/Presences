var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var presence = new Presence({
    clientId: "463097721130188830",
    mediaKeys: true
}), strings = presence.getStrings({
    play: "presence.playback.playing",
    pause: "presence.playback.paused",
    live: "presence.activity.live"
});
var pattern = "•";
var truncateAfter = function (str, pattern) {
    return str.slice(0, str.indexOf(pattern));
};
presence.on("UpdateData", () => __awaiter(this, void 0, void 0, function* () {
    var video = document.querySelector(".video-stream");
    if (video !== null && !isNaN(video.duration) && document.location.pathname.includes("/watch")) {
        var oldYouTube = null;
        var YouTubeTV = null;
        var YouTubeEmbed = null;
        var title;
        document.querySelector(".watch-title") !== null
            ? (oldYouTube = true)
            : (oldYouTube = false);
        document.querySelector(".player-video-title") !== null
            ? (YouTubeTV = true)
            : (YouTubeTV = false);
        document.location.pathname.includes("/embed")
            ? (YouTubeEmbed = true)
            : (YouTubeEmbed = false);
        if (!oldYouTube && !YouTubeTV) {
            if (YouTubeEmbed) {
                title = document.querySelector("div.ytp-title-text > a");
            }
            else {
                title =
                    document.location.pathname !== "/watch"
                        ? document.querySelector(".ytd-miniplayer .title")
                        : document.querySelector("h1 yt-formatted-string.ytd-video-primary-info-renderer");
            }
        }
        else {
            if (oldYouTube) {
                if (document.location.pathname == "/watch")
                    title = document.querySelector(".watch-title");
            }
            else if (YouTubeTV) {
                title = document.querySelector(".player-video-title");
            }
        }
        var uploaderTV, uploaderMiniPlayer, uploader2, edited, uploaderEmbed;
        edited = false;
        uploaderTV = document.querySelector(".player-video-details");
        uploaderEmbed = document.querySelector("div.ytp-title-expanded-heading > h2 > a");
        uploaderMiniPlayer = document.querySelector("yt-formatted-string#owner-name");
        if (uploaderMiniPlayer !== null) {
            if (uploaderMiniPlayer.innerText == "YouTube") {
                edited = true;
                uploaderMiniPlayer.setAttribute("premid-value", "Listening to a playlist");
            }
        }
        uploader2 = document.querySelector("#owner-name a");
        var uploader = uploaderMiniPlayer !== null && uploaderMiniPlayer.innerText.length > 0
            ? uploaderMiniPlayer
            : uploader2 !== null && uploader2.innerText.length > 0
                ? uploader2
                : document.querySelector("#upload-info yt-formatted-string.ytd-channel-name a") !== null
                    ? document.querySelector("#upload-info yt-formatted-string.ytd-channel-name a")
                    : uploaderEmbed !== null && YouTubeEmbed && uploaderEmbed.innerText.length > 0
                        ? uploaderEmbed
                        : uploaderTV = truncateAfter(uploaderTV.innerText, pattern), timestamps = getTimestamps(Math.floor(video.currentTime), Math.floor(video.duration)), live = Boolean(document.querySelector(".ytp-live")), ads = Boolean(document.querySelector(".ytp-ad-player-overlay")), presenceData = {
            details: title.innerText,
            state: edited == true
                ? uploaderMiniPlayer.getAttribute("premid-value")
                : uploaderTV !== null
                    ? uploaderTV
                    : uploader.innerText,
            largeImageKey: "yt_lg",
            smallImageKey: video.paused ? "pause" : "play",
            smallImageText: video.paused
                ? (yield strings).pause
                : (yield strings).play,
            startTimestamp: timestamps[0],
            endTimestamp: timestamps[1]
        };
        presence.setTrayTitle(video.paused ? "" : title.innerText);
        if (video.paused || live) {
            delete presenceData.startTimestamp;
            delete presenceData.endTimestamp;
            if (live) {
                presenceData.smallImageKey = "live";
                presenceData.smallImageText = (yield strings).live;
            }
        }
        if (ads) {
            presenceData.details = "Currently watching an ad";
            delete presenceData.state;
        }
        if (video && title !== null && uploader !== null) {
            presence.setActivity(presenceData, !video.paused);
        }
    }
    else if (document.location.hostname == "www.youtube.com") {
        let presenceData = {
            largeImageKey: "yt_lg"
        };
        var search;
        var user;
        var browsingStamp = Math.floor(Date.now() / 1000);
        if (document.location.pathname.includes("/results")) {
            search = document.querySelector("#search-input > div > div:nth-child(2) > input");
            if (search == null) {
                search = document.querySelector("#search-input > input");
            }
            presenceData.details = "Searching for:";
            presenceData.state = search.value;
            presenceData.smallImageKey = "search";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/channel") || document.location.pathname.includes("/user")) {
            user = document.querySelector("#channel-name");
            if (user.innerText == "") {
                user = document.querySelector("#channel-header-container > a > div > h1 > yt-formatted-string");
            }
            if (document.location.pathname.includes("/videos")) {
                presenceData.details = "Browsing through videos";
                presenceData.state = "of channel: " + user.textContent;
                presenceData.startTimestamp = browsingStamp;
            }
            else if (document.location.pathname.includes("/playlists")) {
                presenceData.details = "Browsing through playlists";
                presenceData.state = "of channel: " + user.innerText;
                presenceData.startTimestamp = browsingStamp;
            }
            else if (document.location.pathname.includes("/community")) {
                presenceData.details = "Viewing community posts";
                presenceData.state = "of channel: " + user.innerText;
                presenceData.startTimestamp = browsingStamp;
            }
            else if (document.location.pathname.includes("/about")) {
                presenceData.details = "Reading about channel:";
                presenceData.state = user.innerText;
                presenceData.smallImageKey = "reading";
                presenceData.startTimestamp = browsingStamp;
            }
            else if (document.location.pathname.includes("/search")) {
                search = document.URL.split("search?query=")[1];
                presenceData.details = "Searching through channel: " + user.innerText;
                presenceData.state = "for: " + search;
                presenceData.smallImageKey = "search";
                presenceData.startTimestamp = browsingStamp;
            }
            else {
                presenceData.details = "Viewing channel:";
                presenceData.state = user.innerText;
                presenceData.startTimestamp = browsingStamp;
            }
        }
        else if (document.location.pathname.includes("/feed/trending")) {
            title = document.querySelector("#title");
            if (title !== null) {
                presenceData.details = "Viewing trending " + title.innerText;
                presenceData.startTimestamp = browsingStamp;
            }
            else {
                presenceData.details = "Viewing what's trending";
                presenceData.startTimestamp = browsingStamp;
            }
        }
        else if (document.location.pathname.includes("/feed/subscriptions")) {
            presenceData.details = "Browsing through";
            presenceData.state = "their subscriptions";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/feed/library")) {
            presenceData.details = "Browsing through";
            presenceData.state = "their library";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/feed/history")) {
            presenceData.details = "Browsing through";
            presenceData.state = "their history";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/feed/purchases")) {
            presenceData.details = "Browsing through";
            presenceData.state = "their purchases";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/playlist")) {
            presenceData.details = "Viewing playlist:";
            title = document.querySelector("#text-displayed");
            if (title == null) {
                title = document.querySelector("#title > yt-formatted-string > a");
            }
            presenceData.state = title.innerText;
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/premium")) {
            presenceData.details = "Reading about";
            presenceData.state = "Youtube Premium";
            presenceData.smallImageKey = "reading";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/gaming")) {
            presenceData.details = "Browsing through";
            presenceData.state = "Youtube Gaming";
            presenceData.smallImageKey = "reading";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/account")) {
            presenceData.details = "Viewing their account";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/reporthistory")) {
            presenceData.details = "Viewing their report history";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/intl")) {
            presenceData.details = "Reading about:";
            title = document.querySelector("head > title");
            presenceData.state = title.innerText.replace(" - YouTube", "");
            presenceData.smallImageKey = "reading";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.URL == "https://www.youtube.com/") {
            presenceData.details = "Browsing the main page...";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/upload")) {
            presenceData.details = "Uploading something...";
            presenceData.startTimestamp = browsingStamp;
            presenceData.smallImageKey = "writing";
        }
        else if (document.location.pathname.includes("/view_all_playlists")) {
            presenceData.details = "Viewing all their playlists";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/my_live_events")) {
            presenceData.details = "Viewing their live events";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/live_dashboard")) {
            presenceData.details = "Viewing their live dashboard";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/audiolibrary")) {
            presenceData.details = "Viewing the audio library";
            presenceData.startTimestamp = browsingStamp;
        }
        if (presenceData.details == null) {
            presence.setTrayTitle();
            presence.setActivity();
        }
        else {
            presence.setActivity(presenceData);
        }
    }
    else if (document.location.hostname == "studio.youtube.com") {
        let presenceData = {
            largeImageKey: "yt_lg",
            smallImageKey: "studio",
            smallImageText: "Youtube Studio"
        };
        var search;
        var user;
        var browsingStamp = Math.floor(Date.now() / 1000);
        if (document.location.pathname.includes("/videos")) {
            presenceData.details = "Viewing their videos";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/video")) {
            title = document.querySelector("#entity-name");
            presenceData.startTimestamp = browsingStamp;
            if (document.location.pathname.includes("/edit")) {
                presenceData.details = "Editing video:";
                presenceData.state = title.innerText;
            }
            else if (document.location.pathname.includes("/analytics")) {
                presenceData.details = "Viewing analytics of video:";
                presenceData.state = title.innerText;
            }
            else if (document.location.pathname.includes("/comments")) {
                presenceData.details = "Viewing comments of video:";
                presenceData.state = title.innerText;
            }
            else if (document.location.pathname.includes("/translations")) {
                presenceData.details = "Viewing translations of video:";
                presenceData.state = title.innerText;
            }
        }
        else if (document.location.pathname.includes("/analytics")) {
            presenceData.details = "Viewing their";
            presenceData.state = "channel analytics";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/comments")) {
            presenceData.details = "Viewing their";
            presenceData.state = "channel comments";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/translations")) {
            presenceData.details = "Viewing their";
            presenceData.state = "channel translations";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/channel")) {
            presenceData.details = "Viewing their dashboard";
            presenceData.startTimestamp = browsingStamp;
        }
        if (presenceData.details == null) {
            presence.setTrayTitle();
            presence.setActivity();
        }
        else {
            presence.setActivity(presenceData);
        }
    }
}));
presence.on("MediaKeys", (key) => {
    switch (key) {
        case "pause":
            var video = document.querySelector(".video-stream");
            video.paused ? video.play() : video.pause();
            break;
        case "nextTrack":
            document.querySelector(".ytp-next-button").click();
            break;
        case "previousTrack":
            document.querySelector(".ytp-prev-button").click();
            break;
    }
});
function getTimestamps(videoTime, videoDuration) {
    var startTime = Date.now();
    var endTime = Math.floor(startTime / 1000) - videoTime + videoDuration;
    return [Math.floor(startTime / 1000), endTime];
}
