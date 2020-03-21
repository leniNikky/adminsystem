<template>
    <div class="goods-list">
        <div class="list-header" v-show="!showAdd && !showTable">
            <el-input
                v-model="searchInfo"
                style="width:300px;float:left;margin-right:10px;"
                placeholder="请输入商品名或id">
            </el-input>
            <el-button type="primary" @click="searchGoodsById">搜商品id</el-button>
            <el-button type="primary" @click="searchGoodsByName">搜商品名</el-button>
            <el-button type="primary" @click="axiosGetGoodsList">全部商品</el-button>
        </div>
        <i class="el-icon-circle-plus-outline add-btn" @click="showAddGoods" v-show="!showAdd && !showTable"></i>
         <el-table
            :data="goodsList"
            style="width: 100%"
            v-show="!showAdd && !showTable">
            <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand" label-width="120px">
                <el-form-item label="商品ID:" class="item-block">
                    <span>{{ props.row._id }}</span>
                </el-form-item>
                <el-form-item label="商品名称:" class="item-block">
                    <span>{{ props.row.NAME }}</span>
                </el-form-item>
                <el-form-item label="原价:" class="item-block">
                    <span>{{ props.row.ORI_PRICE }}</span>
                </el-form-item>
                <el-form-item label="销售价:" class="item-block">
                    <span>{{ props.row.PRESENT_PRICE }}</span>
                </el-form-item>
                <el-form-item label="库存:" class="item-block">
                    <span>{{ props.row.AMOUNT }}</span>
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
                <el-form-item label="是否为推荐商品:" class="item-block">
                    <span>{{ props.row.IS_RECOMMEND? '是' : '否' }}</span>
                </el-form-item>
                </el-form>
            </template>
            </el-table-column>
            <el-table-column
            label="商品 ID"
            prop="_id">
            </el-table-column>
            <el-table-column
            label="商品名称"
            prop="NAME">
            </el-table-column>
            <el-table-column
            label="操作">
           <template slot-scope="scope">
                <el-button @click="updateGoods(scope.row)" type="text" size="small">编辑</el-button>
                <el-button type="text" size="small" @click="deleteGoods(scope.row._id)">删除</el-button>
                <el-button type="text" size="small" v-if="scope.row.STATE == 1" @click="shangxiajia(scope.row._id,0)">下架</el-button>
                <el-button type="text" size="small" v-if="scope.row.STATE == 0" @click="shangxiajia(scope.row._id,1)">上架</el-button>
            </template>
            </el-table-column>
        </el-table>
        <add-goods @showListClick="showListClick" v-if="showAdd"></add-goods>
        <goods-table @showListClick="showListClick" v-show="showTable" :goods="goods" :categorySubArr="categorySubArr"></goods-table>
    </div>
</template>

<script>
    import AddGoods from '@/components/views/AddGoods'
    import GoodsTable from '@/components/views/GoodsTable'
    import axios from 'axios'
    import url from '@/serviceAPI.config.js'
    export default {
        data() {
            return {
                goodsList: [],
                showAdd:false,
                showTable:false,
                searchInfo:'',
                goods:{},
                categorySubArr:[],
                errorimg:'this.src="http://zyn2019.oss-cn-shenzhen.aliyuncs.com/mpet/nopicture.png"'
            }
        },
        components:{
            AddGoods,
            GoodsTable
        },
        created(){
            this.axiosGetGoodsList()
        },
        methods: {
            shangxiajia(id,state){
                axios({
                    url:url.changeGoodsState,
                    method:'post',
                    data:{
                        id:id,
                        state:state
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.deleteXiajiaGoodsofCart(id)
                         this.axiosGetGoodsList()
                         this.$message({
                            type:'success',
                            message:state == 0 ? '商品下架成功' : '商品上架成功'
                        })
                    }else{
                        this.$message({
                            type:'info',
                            message:state == 0 ? '商品下架失败' : '商品上架失败'
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
            deleteXiajiaGoodsofCart(id){
                axios({
                    url:url.deleteGoodsOfNone,
                    method:'post',
                    data:{
                        goodsId:id
                    }
                })
            },
            searchGoodsById(){
                if(this.searchInfo==''){
                    this.$message({
                        type:'info',
                        message:'内容不能为空'
                    })
                }else{
                    axios({
                        url:url.findGoodsByID,
                        method:'post',
                        data:{
                            id:this.searchInfo
                        }
                    })
                    .then(response=>{
                        if(response.data.code == 200 && response.data.message){
                            this.goodsList = response.data.message
                        }else{
                            this.$message({
                                type:'info',
                                message:'无此商品'
                            })
                            this.goodsList = []
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
                        url:url.findGoodsByName,
                        method:'post',
                        data:{
                            name:this.searchInfo
                        }
                    })
                    .then(response=>{
                        if(response.data.code == 200 && response.data.message){
                            this.goodsList = response.data.message
                        }else{
                            this.$message({
                                type:'info',
                                message:'无此商品'
                            })
                            this.goodsList = []
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
                this.axiosGetGoodsList()
            },
            showAddGoods(){
                this.showAdd = true
                this.showTable = false
            },
            axiosGetGoodsList(){
                this.searchInfo = ''
                axios({
                    url:url.getAllGoods,
                    method:'get',
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.goodsList = response.data.message
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
                this.$confirm('确认删除此商品?', '提示', {
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
                        this.deleteXiajiaGoodsofCart(id)
                        this.axiosGetGoodsList()
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
            updateGoods(goods){
                 this.goods = goods
                 axios({
                    url:url.getCategorySubList,
                    method:'post',
                    data:{
                        categoryId:this.goods.CAT_ID
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.categorySubArr = response.data.message
                        console.log(this.categorySubArr)
                    }else{
                        console.log('数据拉取失败')
                    }
                })
                .catch(error=>{
                    console.log(error)
                })
                setTimeout(()=>{
                    this.showTable = true
                    this.showAdd = false
                    console.log(this.categorySubArr)
                },1000)
                //this.axiosGetcategorySubArr(this.goodsInfo.CAT_ID)
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
                    }else{
                        console.log('数据拉取失败')
                    }
                })
                .catch(error=>{
                    console.log(error)
                })
            },
        },
    }
</script>

<style lang='less' scoped>
    .goods-list{
        padding: 10px;
        height: 100%;
        overflow-x:hidden;
        overflow-y: scroll;
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