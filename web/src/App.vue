<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style>
@import "./components/0main.less";
#app {
    width: 100%;
    height: 100%;
}

html, body {
    width: 100%;
    height: 100%;
}
</style>
