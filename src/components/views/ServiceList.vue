<template>
    <div class="goods-list">
        <div class="list-header" v-show="!showAdd && !showTable">
            <el-input
                v-model="searchInfo"
                style="width:300px;float:left;margin-right:10px;"
                placeholder="请输入服务名或id">
            </el-input>
            <el-button type="primary" @click="searchGoodsById">搜服务id</el-button>
            <el-button type="primary" @click="searchGoodsByName">搜服务名</el-button>
            <el-button type="primary" @click="axiosGetServicesList">全部服务</el-button>
        </div>
        <i class="el-icon-circle-plus-outline add-btn" @click="showAddService" v-show="!showAdd && !showTable"></i>
         <el-table
            :data="servicesList"
            style="width: 100%"
            v-show="!showAdd && !showTable">
            <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand" label-width="120px">
                <el-form-item label="服务ID:" class="item-block">
                    <span>{{ props.row._id }}</span>
                </el-form-item>
                <el-form-item label="服务名称:" class="item-block">
                    <span>{{ props.row.NAME }}</span>
                </el-form-item>
                <el-form-item label="简介:" class="item-block">
                    <span>{{ props.row.DETAIL }}</span>
                </el-form-item>
                <el-form-item label="主图:" class="item-block">
                    <img :src="props.row.IMAGE1" width="50" height="50" :onerror="errorimg">
                </el-form-item>
                <el-form-item label="详情图1">
                    <img :src="props.row.IMAGE2" width="50" height="50" :onerror="errorimg">
                </el-form-item>
                <el-form-item label="详情图2:">
                    <img :src="props.row.IMAGE3" width="50" height="50" :onerror="errorimg">
                </el-form-item>
                 <el-form-item label="详情图3:">
                    <img :src="props.row.IMAGE4" width="50" height="50" :onerror="errorimg">
                </el-form-item>
                <el-form-item label="详情图4:">
                    <img :src="props.row.IMAGE5" width="50" height="50" :onerror="errorimg">
                </el-form-item>
                <el-form-item label="所属类别:" class="item-block">
                    <span>{{ props.row.CATEGORY_NAME }}</span>
                </el-form-item>
                <el-form-item label="是否为推荐服务:" class="item-block">
                    <span>{{ props.row.IS_RECOMMEND? '是' : '否' }}</span>
                </el-form-item>
                </el-form>
            </template>
            </el-table-column>
            <el-table-column
            label="服务ID"
            prop="_id">
            </el-table-column>
            <el-table-column
            label="服务名称"
            prop="NAME">
            </el-table-column>
            <el-table-column
            label="操作">
           <template slot-scope="scope">
                <el-button @click="updateGoods(scope.row)" type="text" size="small">编辑</el-button>
                <el-button type="text" size="small" @click="deleteGoods(scope.row._id)">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        <add-service @showListClick="showListClick" v-show="showAdd"></add-service>
        <service-table @showListClick="showListClick" v-show="showTable" :service="service" :categorySubArr="categorySubArr"></service-table>
    </div>
</template>

<script>
    import AddService from '@/components/views/AddService'
    import ServiceTable from '@/components/views/ServiceTable'
    import axios from 'axios'
    import url from '@/serviceAPI.config.js'
    export default {
        data() {
            return {
                servicesList: [],
                showAdd:false,
                showTable:false,
                searchInfo:'',
                service:{},
                categorySubArr:[],
                errorimg:'this.src="http://zyn2019.oss-cn-shenzhen.aliyuncs.com/mpet/nopicture.jpg"',
            }
        },
        components:{
            AddService,
            ServiceTable
        },
        created(){
            this.axiosGetServicesList()
        },
        methods: {
            searchGoodsById(){
                if(this.searchInfo==''){
                    this.$message({
                        type:'info',
                        message:'内容不能为空'
                    })
                }else{
                    axios({
                        url:url.findServiceByID,
                        method:'post',
                        data:{
                            id:this.searchInfo
                        }
                    })
                    .then(response=>{
                        if(response.data.code == 200 && response.data.message){
                            this.servicesList = response.data.message
                            if(this.servicesList.length > 0){
                                this.$message({
                                    type:'success',
                                    message:'查找成功'
                                })
                            }else{
                                this.$message({
                                    type:'info',
                                    message:'无此服务'
                                })
                            }
                        }else{
                            this.$message({
                                type:'info',
                                message:'拉取数据失败'
                            })
                            this.servicesList = []
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
            searchGoodsByName(){
                if(this.searchInfo==''){
                    this.$message({
                        type:'info',
                        message:'内容不能为空'
                    })
                }else{
                    axios({
                        url:url.findServiceByName,
                        method:'post',
                        data:{
                            name:this.searchInfo
                        }
                    })
                    .then(response=>{
                        if(response.data.code == 200 && response.data.message){
                            this.servicesList = response.data.message
                            if(this.servicesList.length > 0){
                                this.$message({
                                    type:'success',
                                    message:'查找成功'
                                })
                            }else{
                                this.$message({
                                    type:'info',
                                    message:'无此服务'
                                })
                            }
                        }else{
                            this.$message({
                                type:'info',
                                message:'拉取数据失败'
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
            showListClick() {
                this.showAdd = false
                this.showTable = false
                this.axiosGetServicesList()
            },
            showAddService(){
                this.showAdd = true
                this.showTable = false
            },
            axiosGetServicesList(){
                this.searchInfo = ''
                axios({
                    url:url.getAllService,
                    method:'get',
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.servicesList = response.data.message
                    }else{
                        this.$message({
                            type:'info',
                            message:'拉取数据失败'
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
            deleteGoods(id){
                this.$confirm('确认删除此服务?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                    this.axiosDeleteGoods(id)
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            axiosDeleteGoods(id){
                axios({
                    url:url.deleteOneGoods,
                    method:'post',
                    data:{
                        id:id
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.axiosGetServicesList()
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }else{
                        this.$message({
                            type:'info',
                            message:'删除失败!'
                        })
                    }
                })
                .catch(error=>{
                    console.log(error)
                    this.$message({
                            type:'info',
                            message:error
                        })
                })
            },
            updateGoods(service){
                this.showTable = true
                this.showAdd = false
                this.service = service
                this.axiosGetcategorySubArr(this.service.CAT_ID)
            },
            axiosGetcategorySubArr(id){
                axios({
                    url:url.getCategorySubList,
                    method:'post',
                    data:{
                        categoryId:id
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.categorySubArr = response.data.message
                        console.log(123)
                        console.log(this.categorySubArr)
                    }else{
                        console.log('数据拉取失败')
                    }
                })
                .catch(error=>{
                    console.log(321)
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