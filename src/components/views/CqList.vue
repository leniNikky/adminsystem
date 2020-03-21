<template>
    <div class="goods-list">
        <div class="list-header">
            <el-input
                v-model="searchInfo"
                style="width:300px;float:left;margin-right:10px;"
                placeholder="请输入内容">
            </el-input>
            <el-button type="primary" @click="searchCqByName">搜索</el-button>
            <el-button type="primary" @click="axiosGetCqList">显示全部</el-button>
        </div>
         <el-table
            :data="cqList"
            style="width: 100%"
            >
            <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand" label-width="120px">
                <el-form-item label="宠圈ID:" class="item-block">
                    <span>{{ props.row._id }}</span>
                </el-form-item>
                <el-form-item label="宠圈内容:" class="item-block">
                    <span>{{ props.row.shareContent }}</span>
                </el-form-item>
                <el-form-item label="宠圈图片:" class="item-block">
                    <img :src="props.row.shareImg" width="50" height="50" :onerror="errorimg">
                </el-form-item>
                <el-form-item label="发布者id:" class="item-block">
                    <span>{{ props.row.userId }}</span>
                </el-form-item>
                <el-form-item label="发布者昵称:" class="item-block">
                    <span>{{ props.row.userName }}</span>
                </el-form-item>
                <el-form-item label="发布者头像:" class="item-block">
                    <img :src="props.row.userImg" width="50" height="50" :onerror="errorimg">
                </el-form-item>
                <el-form-item label="发布时间:" class="item-block">
                    <span>{{ props.row.shareDate | dateFormat}}</span>
                </el-form-item>
                </el-form>
            </template>
            </el-table-column>
            <el-table-column
            label="宠圈ID"
            prop="_id">
            </el-table-column>
            <el-table-column
            label="宠圈内容"
            prop="shareContent">
            </el-table-column>
            <el-table-column
            label="操作">
           <template slot-scope="scope">
                <el-button type="text" size="small" @click="deleteCq(scope.row._id)">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import axios from 'axios'
    import url from '@/serviceAPI.config.js'
    import {dateTimeFormat} from '@/filters/dateFilter.js'
    export default {
        data() {
            return {
                cqList: [],
                errorimg:'this.src="http://zyn2019.oss-cn-shenzhen.aliyuncs.com/mpet/nopicture.jpg"',
                searchInfo:'',
                imgUrl:'',
                userName:''
            }
        },
        created(){
            this.axiosGetCqList()
        },
        filters:{
            dateFormat(date){
                return dateTimeFormat(date)
            }
        },
        methods: {
            searchUserImg(id){
                let img = ''
                axios({
                    url:url.searchUserImgByID,
                    method:'post',
                    data:{
                        id:id
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.imgUrl = response.data.message
                    }else{
                        this.imgUrl = this.errorimg
                    }
                })
                .catch(error=>{
                    this.imgUrl = this.errorimg
                })
                img = this.imgUrl
                return img
            },
            searchUserName(id){
                let name = ''
                axios({
                    url:url.searchUserNameByID,
                    method:'post',
                    data:{
                        id:id
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.userName = response.data.message
                    }else{
                        this.userName = ''
                    }
                })
                .catch(error=>{
                    this.userName = ''
                })
                name = this.userName
                return name
            },
            axiosGetCqList(){
                this.searchInfo = ''
                axios({
                    url:url.findAllShare,
                    method:'get'
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.cqList = response.data.message
                    }else{
                        this.$message({
                            type:'info',
                            message:'数据拉取失败'
                        })
                    }
                })
                .catch(error=>{
                    this.$message({
                        type:'info',
                        message:error
                    })
                })
            },
            searchCqByName(){
                axios({
                    url:url.searchCqByName,
                    method:'post',
                    data:{
                        searchInfo:this.searchInfo
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.cqList = response.data.message
                    }else{
                        this.$message({
                            type:'info',
                            message:'数据拉取失败'
                        })
                    }
                })
                .catch(error=>{
                    this.$message({
                        type:'info',
                        message:error
                    })
                })
            },
            deleteCq(id){
                this.$confirm('确认删除此宠圈?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                    this.axiosDeleteCq(id)
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            axiosDeleteCq(id){
                axios({
                    url:url.deteleShare,
                    method:'post',
                    data:{
                        shareId:id
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.axiosGetCqList()
                        this.$message({
                            type:'success',
                            message:'删除成功'
                        })
                    }else{
                        this.$message({
                            type:'info',
                            message:'数据拉取失败'
                        })
                    }
                })
                .catch(error=>{
                    this.$message({
                        type:'info',
                        message:error
                    })
                })

            }
        },
    }
</script>

<style lang='less' scoped>
    .goods-list{
        padding: 10px;
        height: 100%;
        overflow-y: scroll;
        overflow-x:hidden;
        .list-header{
            float: left;
            margin-bottom: 20px;
        }
        .add-btn{
            float: right;
            font-size: 40px;
            color: rgb(64, 158, 255);
            margin-top: -3px;
        }
    }
    .goods-list::-webkit-scrollbar{
        display: none;
    }
    .item-block{
        display: block;
        clear: both;
        margin: 0px;
    }
</style>