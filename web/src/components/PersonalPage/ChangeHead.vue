<template>
    <div>
        <!--上传文件-->
        <div id="videoUploadContainer">
            <div>上传头像</div>
            <div class="clearfix">
                <a-upload :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
                    <a-button>
                        <a-icon type="upload"/>
                        Select File
                    </a-button>
                </a-upload>

                <a-button
                    type="primary"
                    :disabled="fileList.length === 0"
                    :loading="uploading"
                    style="margin-top: 16px"
                    @click="handleUpload"
                >
                    {{ uploading ? 'Uploading' : 'Start Upload' }}
                </a-button>
            </div>
        </div>

    </div>
</template>

<script>
import {uploadHead} from '@/api/api'
import {serverAdress} from '@/config'
import {mapGetters, mapState, mapMutations} from "vuex";

export default {
    components: {},
    data() {
        return {
            serverAdress: serverAdress,
            name3D: null,
            fileList: [],
            uploading: false,
            resData: []
        }
    },
    methods: {

        // 上传至页面
        beforeUpload(file) {
            this.fileList = [...this.fileList, file];
            return false;
        },

        // 页面删除
        handleRemove(file) {
            const index = this.fileList.indexOf(file);
            const newFileList = this.fileList.slice();
            newFileList.splice(index, 1);
            this.fileList = newFileList;
        },

        // 上传服务器
        handleUpload() {
            const {fileList} = this;
            const formData = new FormData();
            fileList.forEach(file => {
                formData.append(this.getUserInf.id, file);
            });
            formData.append('videoIntroduce', '11');
            this.uploading = true;

            uploadHead(formData).then(response => {
                this.$message.success(response.statusText);
                this.uploading = false;
                this.fileList = []
                this.resData = response.data

                const head = response.data[0]
                const user = this.getUserInf
                user.headIcon = head
                this.$store.commit('setUserInf', user)
            })
        },
    },
    computed: {
        ...mapGetters(["getUserInf"])
    },
    mounted() {

    },
    beforeDestroy: function () {
        console.log('清除3D内存!')
    }
}
</script>

<style lang="less">
#3DContainer {

    background-color: #00B7FF;
    width: calc(50vw);

    .designePicture {
        width: 50%;
        height: 50%;
    }

    label {
        position: relative;
    }

    #fileinp {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
    }

    #fileinp0 {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
    }

    #btn {
        margin-right: 5px;
    }

    #text {
        color: red;
    }

}

#videoUploadContainer {
    background-color: #00B7FF;
    width: calc(50vw);
}

</style>
