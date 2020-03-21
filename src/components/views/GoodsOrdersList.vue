<template>
    <div class="goods-order">
        <div class="list-header" v-show="ifShowList">
            <el-input
                v-model="searchInfo"
                style="width:300px;float:left;margin-right:10px;"
                placeholder="请输入订单ID">
            </el-input>
            <el-button type="primary" @click="searchOrderByID">搜索</el-button>
            <el-select v-model="value" placeholder="请选择订单状态" class="select-margin">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" @click="searchOrderByStatus">搜索</el-button>
            <el-button type="primary" @click="findAllOrders">全部订单</el-button>
        </div>
        <el-table
            :data="orderList"
            style="width: 100%"
            v-show="ifShowList"
            >
            <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand" label-width="120px">
                <el-form-item label="订单ID:" class="item-block">
                    <span>{{ props.row._id }}</span>
                </el-form-item>
                <el-form-item label="下单时间:" class="item-block">
                    <span>{{ props.row.orderTime | dateTimeFormat }}</span>
                </el-form-item>
                <el-form-item label="订单状态:" class="item-block">
                    <span>{{ status(props.row.logistics) }}</span>
                </el-form-item>
                <el-form-item label="订单总额:" class="item-block">
                    <span>{{ props.row.orderPrice }}</span>
                </el-form-item>
                <el-form-item label="下单用户ID:" class="item-block">
                    <span>{{ props.row.userId }}</span>
                </el-form-item>
                <el-form-item label="收货人信息:" class="item-block">
                    <span>{{ props.row.addressInfo.name }}, {{ props.row.addressInfo.tel }}, {{ props.row.addressInfo.address }}</span>
                </el-form-item>
                </el-form>
            </template>
            </el-table-column>
            <el-table-column
            label="订单ID"
            prop="_id">
            </el-table-column>
            <el-table-column
            label="下单时间">
            <template slot-scope="scope">
                {{scope.row.orderTime | dateTimeFormat}}
            </template>
            </el-table-column>
            <el-table-column
            label="订单状态">
            <template slot-scope="scope">
                {{status(scope.row.logistics)}}
            </template>
            </el-table-column>
            <el-table-column
            label="操作">
           <template slot-scope="scope">
                <el-button @click="seeMore(scope.row)" type="text" size="small">查看详情</el-button>
                <el-button @click="sendGoods(scope.row._id)" type="text" size="small" :disabled="scope.row.logistics != 0">一键发货</el-button>
            </template>
            </el-table-column>
        </el-table>
        <goods-order @showListClick="showListClick" :orderInfo="orderInfo" v-show="!ifShowList"></goods-order>
    </div>
</template>

<script>
    import url from '@/serviceAPI.config.js'
    import axios from 'axios'
    import { dateTimeFormat }  from '@/filters/dateFilter.js'
    import GoodsOrder from '@/components/views/GoodsOrder'
import { setTimeout } from 'timers';
    export default {
        data() {
            return {
                orderList: [],
                options:[{
                    value:0,
                    label:'未发货'
                },{
                    value:2,
                    label:'待收货'
                },{
                    value:3,
                    label:'已收货'
                }],
                searchInfo:'',
                value:'',
                orderInfo:{},
                ifShowList:true
            }
        },
        components:{
            GoodsOrder
        },
        created(){
            this.findAllOrders()
        },
        watch:{
            value(val){
                this.searchInfo = ''
            }
        },
        filters:{
            dateTimeFormat(date){
                return dateTimeFormat(date)
            }
        },
        computed: {
            status() {
                return function(val){
                    switch (val) {
                        case 0:
                            return '未发货'
                            break;
                        case 2:
                            return '待收货'
                            break;
                        case 3:
                            return '已收货'
                            break;
                        default:
                            break;
                    }
                }
            }
        },
        methods: {
            seeMore(orderInfo){
                this.orderInfo = orderInfo
                this.ifShowList = false
            },
            showListClick(){
                this.ifShowList = true
            },
            searchOrderByID(){
                this.value = ''
                if(this.searchInfo==''){
                    this.$message({
                        type:'info',
                        message:'内容不能为空'
                    })
                }else{
                    this.axiosFindOrderByID()
                }
            },
            axiosFindOrderByID(){
                axios({
                    url:url.findOrderByID,
                    method:'post',
                    data:{
                        id:this.searchInfo
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.orderList = []
                        this.orderList = response.data.message
                    }else{
                        this.$message({
                            type:'info',
                            message:'无该订单信息'
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
            searchOrderByStatus(){
                this.searchInfo = ''
                if(this.value=='' && this.value !=0){
                    this.$message({
                        type:'info',
                        message:'请先选择订单状态'
                    })
                }else{
                    this.axiosFindOrderByStatus()
                }
            },
            axiosFindOrderByStatus(){
                axios({
                    url:url.findOrderByLogistics,
                    method:'post',
                    data:{
                        logistics:this.value
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.orderList = []
                        this.orderList = response.data.message
                    }else{
                        this.$message({
                            type:'info',
                            message:'无该类订单信息'
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
            findAllOrders() {
                this.searchInfo = ''
                this.value = ''
                axios({
                    url:url.findAllGoodsOrder,
                    method:'get',
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        this.orderList = response.data.message
                    }else{
                        this.$message({
                            type:'info',
                            message:'暂无订单'
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
            sendGoods(id){
                axios({
                    url:url.sendGoods,
                    method:'post',
                    data:{
                        id:id
                    }
                })
                .then(res=>{
                    if(res.data.code == 200 && res.data.message){
                        this.findAllOrders()
                        this.$message({
                            type:'success',
                            message:'发货成功'
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
    .goods-order{
        padding: 10px;
        max-height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        .item-block{
            float: left;
            clear: both;
        }
        .list-header{
            float: left;
            margin-bottom: 20px;
        }
        .select-margin{
            margin:0 5px;
        }
    }
    .goods-order::-webkit-scrollbar{
        display: none;
    }
</style>