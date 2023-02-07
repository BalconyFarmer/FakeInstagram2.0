
<template>
    <div class="videoAll">
        <video
            id="my-player"
            class="video-js"
            controls="true"
            preload="false"
            style="width:100%;height:300px;object-fit: fill"
            width="100% !important"
            height="100% !important"
            data-setup='{"fluid": true}'>
            <source :src="mySrc" type="video/mp4"></source>
            <source :src="mySrc" type="video/webm"></source>
            <source :src="mySrc" type="video/ogg"></source>
            <p class="vjs-no-js">
                To view this video please enable JavaScript, and consider upgrading to a
                web browser that
                <a href="https://videojs.com/html5-video-support/" target="_blank">
                    supports HTML5 video
                </a>
            </p>
        </video>
    </div>
</template>

<script>
export default {
    name: "PlayVideo.vue",
    props: ['mySrc'],
    data() {
        return {
            // mySrc: "http://localhost:8083/2userStatic/89/videos/video.mp4"
        }
    }
}
</script>

<style scoped>
.videoAll {
    width: 100%;
    height: 100%;
}
</style>
