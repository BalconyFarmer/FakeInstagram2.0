<template>
    <div class="hello">
        <div id="homeHeader">
            <div id="newMenu">
                <a-menu v-model="current" mode="horizontal" theme="dark">
                    <a-menu-item key="mail2" @click="goHome">
                        <a-icon type="appstore"/>
                        Home
                    </a-menu-item>
                </a-menu>
            </div>

            <div id="signInContainer">
                <a class="signIn hover" @click="routeTo('LoginRegist')" v-if="!getUserInf">Sign In</a>

                <img v-else @click="toPersonalInf" @mouseover="showUserDetail()" @mouseleave="hideUserDetail()" class="userIconPic finger" :src="serverAdress + this.getUserInf.headIcon">

                <div class="userDetailed" v-if="showUserDetailFlag" @mouseover="keepUserDetail()"
                     @mouseleave="stopKeepDetail()">

                    <div class="personalInf">
                        <a-button class="btn" type="primary" @click="send" size="small">
                            发布
                        </a-button>
                        <a-button class="btn" type="primary" @click="logOut" size="small">
                            Log Out
                        </a-button>
                    </div>
                </div>
            </div>

        </div>

        <router-view/>
    </div>
</template>

<script>
import LoginRegist from './LoginRegist'
import eventBus from '@/util/eventBus.js';
import {mapGetters, mapState, mapMutations} from "vuex";
import PersonalPage from "./PersonalPage/PersonalPage";
import {serverAdress} from '@/config';
import uploadBigImg from "./uploadBigImg/uploadBigImg";

export default {
    name: 'HomePage',
    components: {
        LoginRegist, PersonalPage, uploadBigImg
    },
    data() {
        return {
            serverAdress: serverAdress,
            showUserDetailFlag: false,
            keepUserDetailFlag: false,
            current: ['mail2'],
            dialogTableVisible: false,
            PersonalPageShow: true

        }
    },
    computed: {
        ...mapGetters(["getUserInf"])
    },
    watch: {
        getUserInf: {
            handler(newValue) {
            },
            deep: true
        }
    },
    methods: {
        send() {
            this.$store.commit('setSendShow', 1)
        },
        routeTo(route) {
            this.$router.push({path: '/' + route}).catch(error => error)
        },

        showUserDetail() {
            this.showUserDetailFlag = true
        },
        hideUserDetail() {
            const self = this
            setTimeout(function () {
                if (!self.keepUserDetailFlag) {
                    self.showUserDetailFlag = false
                }
            }, 100)
        },
        keepUserDetail() {
            this.keepUserDetailFlag = true
        },
        stopKeepDetail() {
            this.keepUserDetailFlag = false
            this.hideUserDetail()
        },
        toPersonalInf() {
            let userInf = {
                show: false,
                inf: null
            }
            this.$store.commit('changeAnotherUser', userInf)
            this.goPersonalPage()
        },
        newWangEditor() {
            this.$router.push({path: '/goWang'}).catch(error => error)
        },
        goHome() {
            this.$router.push({path: '/homeDisplay'}).catch(error => error)
        },
        logOut() {
            // 清楚vuex - > localStorage
            this.$store.commit('clearUserInf')
            // 清除cookie - > session
            const see = this.$cookies.set('USER_SID', null)

            this.showUserDetailFlag = false
            this.$router.push({path: '/LoginRegist'}).catch(error => error)

        },

        goPersonalPage() {
            this.$router.push({path: '/goPersonalPage'}).catch(error => error)
        },
    },

    created() {
    },
    mounted() {
        this.goHome()
    },
    beforeDestroy() {
    }
}
</script>

<style scoped lang="less">

.hello {

    width: 100%;
    height: 100%;

    #homeHeader {

        #signInContainer {

            position: absolute;
            top: 6px;
            left: calc(100vw - 80px);
            z-index: 1000;

            .signIn {
                display: inline-block;
                color: gray;
                font-size: large;
                cursor: pointer;
            }

            .signIn:hover {
                color: white;
            }

            .userIconPic {
                width: 32px;
                height: 32px;
                border-radius: 50%;
            }

            .userDetailed {
                position: relative;
                top: 20px;
                left: -268px;
                width: 300px;
                height: 300px;
                border-style: solid;
                border-color: black;
                border-width: 1px;
                //box-shadow: 2px 2px 2px #bfbfbf;
                background-color: #001529;

                .userIconPicDetail {
                    width: 65px;
                    height: 65px;
                    margin-left: 20px;
                    margin-top: 20px;
                    border-radius: 50%;
                }

                .naIdContainer {
                    /*margin-top: 40px;*/
                    margin-left: 10px;
                    display: inline-block;

                    .userName {
                        display: inline-block;
                        color: #ffffff;
                    }

                    .userId {
                        display: inline-block;
                        color: #ffffff;
                    }
                }

                .personalInf {
                    margin-top: 30px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    .btn {
                        margin-top: 10px;
                        margin-bottom: 10px;
                    }
                }
            }
        }
    }
}

</style>
