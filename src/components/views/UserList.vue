<template>
    <div class="goods-list">
        <div class="list-header" v-show="ifShowList">
            <el-input
                v-model="searchInfo"
                style="width:300px;float:left;margin-right:10px;"
                placeholder="请输入用户ID或昵称">
            </el-input>
            <el-button type="primary" @click="searchUserById">搜用户ID</el-button>
            <el-button type="primary" @click="searchUserByName">搜用户昵称</el-button>
            <el-button type="primary" @click="axiosGetUserList">全部用户</el-button>
        </div>
         <el-table
            :data="userList"
            style="width: 100%"
            v-show="ifShowList">
            <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand" label-width="120px">
                <el-form-item label="用户ID:" class="item-block">
                    <span>{{ props.row._id }}</span>
                </el-form-item>
                <el-form-item label="用户名:" class="item-block">
                    <span>{{ props.row.userName }}</span>
                </el-form-item>
                <el-form-item label="头像:" class="item-block">
                    <img :src="props.row.userImg" width="50" height="50" :onerror="errorimg">
                </el-form-item>
                <el-form-item label="手机号:" class="item-block">
                    <span>{{ props.row.phone }}</span>
                </el-form-item>
                <el-form-item label="注册日期:" class="item-block">
                    <span>{{ props.row.createdDate | dateFormat}}</span>
                </el-form-item>
                <el-form-item label="上次登录时间:" class="item-block">
                    <span>{{ props.row.lastLoginAt | dateFormat}}</span>
                </el-form-item>
                </el-form>
            </template>
            </el-table-column>
            <el-table-column
            label="用户ID"
            prop="_id">
            </el-table-column>
            <el-table-column
            label="用户名"
            prop="userName">
            </el-table-column>
            <el-table-column
            label="操作">
           <template slot-scope="scope">
                <el-button type="text" size="small" @click="seeMore(scope.row._id)">查看更多</el-button>
            </template>
            </el-table-column>
        </el-table>
        <user-table :userInfo="userInfo" @showListClick="showListClick" v-show="!ifShowList"></user-table>
    </div>
</template>

<script>
    import axios from 'axios'
    import url from '@/serviceAPI.config.js'
    import {dateTimeFormat} from '@/filters/dateFilter.js'
    import UserTable from '../views/UserTable'
    export default {
        data() {
            return {
                userList: [],
                errorimg:'this.src="http://zyn2019.oss-cn-shenzhen.aliyuncs.com/mpet/nopicture.png"',
                searchInfo:'',
                userInfo:{},
                ifShowList:true
            }
        },
        components:{
            UserTable
        },
        created(){
            this.axiosGetUserList()
        },
        filters:{
            dateFormat(date){
                return dateTimeFormat(date)
            }
        },
        methods: {
            axiosGetUserList(){
                this.searchInfo = ''
                axios({
                    url:url.findAllUsers,
                    method:'get'
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.userList = response.data.message
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
            seeMore(id){
                axios({
                    url:url.findUserInfo,
                    method:'post',
                    data:{
                        id:id
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.userInfo = response.data.message
                        this.ifShowList = false
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
            showListClick() {
                this.ifShowList = true
                this.axiosGetUserList()
            },
            searchUserById(){
                if(this.searchInfo == ''){
                    this.$message({
                        type:'info',
                        message:'请输入内容'
                    })
                }else{
                    this.axiosSearchUserById()
                }
            },
            searchUserByName(){
                if(this.searchInfo == ''){
                    this.$message({
                        type:'info',
                        message:'请输入内容'
                    })
                }else{
                    this.axiosSearchUserByName()
                }
            },
          
            axiosSearchUserById(){
                axios({
                    url:url.searchUserById,
                    method:'post',
                    data:{
                        searchInfo:this.searchInfo
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.userList = response.data.message
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
            axiosSearchUserByName(){
                axios({
                    url:url.searchUserByName,
                    method:'post',
                    data:{
                        searchInfo:this.searchInfo
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.userList = response.data.message
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
        },
    }
</script>

<style lang='less' scoped>
    .goods-list{
        padding: 10px;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
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