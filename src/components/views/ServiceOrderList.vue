<template>
    <div class="goods-order">
        <div class="list-header">
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
            >
            <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand" label-width="120px">
                <el-form-item label="订单ID:" class="item-block">
                    <span>{{ props.row._id }}</span>
                </el-form-item>
                <el-form-item label="预约时间:" class="item-block">
                    <span>{{ props.row.orderTime | dateTimeFormat }}</span>
                </el-form-item>
                <el-form-item label="订单状态:" class="item-block">
                    <span>{{ status(props.row.orderStatus) }}</span>
                </el-form-item>
                <el-form-item label="机构名称:" class="item-block">
                    <span>{{ props.row.serviceName }}</span>
                </el-form-item>
                <el-form-item label="预约用户ID:" class="item-block">
                    <span>{{ props.row.userId }}</span>
                </el-form-item>
                <el-form-item label="预留信息:" class="item-block">
                    <span>{{ props.row.userName }}, {{props.row.userPhone}}</span>
                </el-form-item>
                <el-form-item label="预约项目:" class="item-block">
                    <span>{{ props.row.orderContent }}</span>
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
                {{status(scope.row.orderStatus)}}
            </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import url from '@/serviceAPI.config.js'
    import axios from 'axios'
    import { dateTimeFormat }  from '@/filters/dateFilter.js'
    export default {
        data() {
            return {
                orderList: [],
                options:[{
                    value:0,
                    label:'待开始'
                },{
                    value:1,
                    label:'已结束'
                },{
                    value:2,
                    label:'已取消'
                }],
                searchInfo:'',
                value:''
            }
        },
        watch:{
            value(val){
                this.searchInfo = ''
            }
        },
        created(){
            this.findAllOrders()
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
                            return '待开始'
                            break;
                        case 1:
                            return '已结束'
                            break;
                        case 2:
                            return '已取消'
                            break;
                        default:
                            break;
                    }
                }
            }
        },
        methods: {
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
                    url:url.findServiceOrderByID,
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
                    url:url.findServiceOrderByLogistics,
                    method:'post',
                    data:{
                        orderStatus:this.value
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
                    url:url.findAllServiceOrder,
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
            }
        },
    }
</script>

<style lang='less' scoped>
    .goods-order{
        padding: 10px;
        height: 100%;
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