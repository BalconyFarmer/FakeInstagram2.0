<template>
    <div v-loading="loading" class="hAll">

        <div class="videoAll" v-if="videoList.length">
            <div v-for="item in videoList">

                <div class="videoItem" v-if="item.videopath">
                    <div class="top">
                        <div class="headIcon finger" @click="gotoPer(item.userInf)" v-if="item.userInf">
                            <img style="width: 100%; height: 100%;border-radius: 50%;"
                                 :src="serverAdress + item.userInf.headIcon">
                        </div>
                        <div @click="gotoPer(item.userInf)" class="userName finger" v-if="item.userInf">
                            {{ item.userInf.name }}
                        </div>
                    </div>

                    <div v-if="item.type == 'video'" class="centerPlayVideo">
                        <PlayVideo v-if="item.type == 'video'"
                                   :mySrc="serverAdress + item.videopath"></PlayVideo>
                    </div>

                    <el-image
                        fit="cover"
                        class=""
                        v-if="item.type == 'pic'"
                        style="width: 100%; height: 60%"
                        :src="serverAdress + item.videopath"
                        :preview-src-list="[serverAdress + item.videopath]">
                    </el-image>

                    <div class="bottom">
                        <div class="picName">
                            <span style="font-weight: bold;margin-left: 10px" v-if="item.userInf">{{
                                    item.userInf.name
                                }} : </span>
                            <div style="overflow: auto" v-html="item.videoname"></div>
                        </div>
                        <div v-if="item.contentList.length" v-for="item1 in item.contentList">
                            <span style="font-weight: bold;margin-left: 10px">{{ item1.userName }} : </span>
                            <span class="vdName">{{ item1.content }}</span>
                            <span class="vdName">{{ item1.updatedAt }}</span>
                        </div>
                    </div>

                    <div class="sendChat">
                        <div class="textInner">
                            <el-input
                                type="textarea"
                                :rows="1"
                                placeholder="????????????"
                                v-model="item.textarea">
                            </el-input>
                        </div>

                        <div class="btn">
                            <el-button size="mini" type="primary" icon="el-icon-check"
                                       @click="addContent(item)"></el-button>
                        </div>
                    </div>
                </div>

            </div>


        </div>
        <div v-else>???????????????shi????????????????????????!</div>
        <div class="bottomLoad" v-if="allProLength > videoList.length">
            <button @click="get">
                ??????
            </button>
        </div>

        <el-dialog
            title="????????????"
            :visible.sync="personalDialog"
            width="90%"
        >
            <PersonalPage v-if="personalDialog"></PersonalPage>
        </el-dialog>

        <el-dialog
            title="??????"
            :visible.sync="uploadDialog"
            :before-close="handleClose"
            width="90%"
        >
            <upload-big-img @callback="afterUpload"></upload-big-img>
        </el-dialog>
    </div>
</template>

<script>
import {serverAdress} from '../config'
import {getVideoList, getUserById, videoContentAdd, videoContentQuery} from '@/api/api'
import PersonalPage from "./PersonalPage/PersonalPage";
import PlayVideo from "../commonComponents/PlayVideo";
import {mapGetters, mapState, mapMutations} from "vuex";
import ChangeHead from "./PersonalPage/ChangeHead";
import uploadBigImg from "./uploadBigImg/uploadBigImg";

export default {
    components: {PlayVideo, PersonalPage, ChangeHead, uploadBigImg},
    data() {
        return {
            allMsg: null,
            videoList: [],
            serverAdress: serverAdress,
            personalDialog: false,

            contentPatams: {
                textarea: null,
                projectId: null
            },
            contentList: [],
            loading: false,
            i: 0,
            allProLength: 0,
            uploadDialog: false
        }
    },
    computed: {
        ...mapGetters(["getUserInf", "getsendShow"])
    },
    methods: {
        addContent(contentPatams) {

            if (contentPatams.textarea) {
                let params = {
                    projectId: contentPatams.videoid,
                    userId: this.getUserInf.id,
                    content: contentPatams.textarea,
                    userName: this.getUserInf.name,
                    headIcon: this.getUserInf.headIcon
                }
                videoContentAdd(params).then(res => {
                    if (res.status == 200) {
                        contentPatams.contentList.push(params)
                        this.$forceUpdate()
                    }

                })
            } else {
                this.$message.error('???????????????!');
            }
        },


        async loadAllVideo(pageIndex) {
            this.loading = true

            const formData = {
                pageIndex: pageIndex
            }
            const _res = await getVideoList(formData)

            const list = _res.data
            // this.allProLength = _res.data.allCnt
            this.allProLength = 11

            if (list.length) {
                list.forEach(item => {
                    this.videoList.push(item)
                })
            } else {
            }

            // ??????????????????
            for (let i = 0; i < this.videoList.length; i++) {
                let res = await getUserById(this.videoList[i].userid)

                if (res.data) {
                    this.videoList[i].userInf = res.data
                    this.videoList[i].userInf.headIcon = this.videoList[i].userInf.headIcon.slice(8)
                }
            }

            // ??????????????????
            this.videoList.forEach(item => {
                item.contentList = []
                this.getChat(item)
            })

            this.loading = false

        },

        afterUpload() {
            this.videoList = []
            this.i = 0
            this.get()
        },

        getChat(data) {
            const self = this
            this.contentPatams.projectId = data.videoid
            videoContentQuery({projectId: this.contentPatams.projectId}).then(responce => {
                this.contentList = responce.data
                data.contentList = responce.data
                self.$forceUpdate()
            })
        },
        gotoPer(data) {

            if (data.id == this.getUserInf.id) {
                let userInf = {
                    show: false,
                    inf: null
                }
                this.$store.commit('changeAnotherUser', userInf)
            } else {
                let userInf = {
                    show: true,
                    inf: data
                }
                this.$store.commit('changeAnotherUser', userInf)
            }

            this.personalDialog = true
        },
        async get() {
            await this.loadAllVideo(this.i)
            this.i = this.i + 3
        },
        handleClose() {
            this.$store.commit('setSendShow', false)
        }

    },

    watch: {
        getsendShow: {
            handler(newValue) {
                const see = this.getsendShow
                this.uploadDialog = this.getsendShow
            },
            deep: true,
            immediate: true

        },
        uploadDialog: {
            handler(newValue) {
            },
            deep: true,
            immediate: true

        },
    },
    created() {
    },
    async mounted() {
        await this.get()
    }
}
</script>

<style lang="less">
@value: 0.01;


.videoAll {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .videoItem {
        width: 600px;
        height: 500px;
        margin: 30px;
        border: 1px solid grey;

        .top {
            width: 100%;
            height: 10%;
            position: relative;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            z-index: 9999;

            .headIcon {
                width: 40px;
                height: 40px;
                margin-left: 20px;
            }

            .userName {
                margin-left: 20px;
                color: gray;
                font-size: 4px;
            }

        }

        .centerPlayVideo {
            width: 100%;
            height: 60%;
        }

        .bottom {
            width: 100%;
            height: 23%;
            overflow: auto;
            position: relative;

            .vdName {
                margin-left: 20px;
            }

            .picName {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: flex-start;
            }
        }

        .sendChat {
            width: 100%;
            height: 7%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            .btn {
                height: 100%;
            }

            .textInner {
                width: 90%;
                height: 100%;
            }

            .el-textarea {
                width: 100% !important;
                height: 100% !important;
            }

            .el-textarea__inner {
                width: 100% !important;
                height: 100% !important;
                min-height: 10px !important;
            }

        }
    }

}

.bottomLoad {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
</style>
