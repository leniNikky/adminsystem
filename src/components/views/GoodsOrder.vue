<template>
    <div>
        <span class="back" @click="goBack"><i class="el-icon-back">返回</i></span>
        <el-button type="primary" size="mini" v-on:click="getpdf(orderInfo._id)">导出PDF</el-button>
        <div class="row" id="pdfDom">
        <h3 class="form-title">订单详情</h3>
        <el-form :model="form" label-width="120px" class="order-form">
            <el-form-item label="订单ID:" class="item">
                <span class="item-left">{{orderInfo._id}}</span>
            </el-form-item>
            <el-form-item label="下单时间:">
                <span class="item-left">{{orderInfo.orderTime | dateTimeFormat}}</span>
            </el-form-item>
            <el-form-item label="订单状态:">
                <span class="item-left">{{ status(orderInfo.logistics) }}</span>
            </el-form-item>
            <el-form-item label="订单总额:">
                <span class="item-left">{{ orderInfo.orderPrice | moneyFormat }}元</span>
            </el-form-item>
            <el-form-item label="下单用户ID:">
                <span class="item-left">{{ orderInfo.userId}}</span>
            </el-form-item>
            <el-form-item label="收货人信息:">
                 <span class="item-left">{{ orderInfo.addressInfo.name }}, {{ orderInfo.addressInfo.tel }}, {{ orderInfo.addressInfo.address }}</span>
            </el-form-item>
            <el-form-item label="订单商品详情">
                <el-table
                    :data="orderInfo.goods"
                    style="width: 100%;clear:both;margin-left:-100px">
                    <el-table-column
                        prop="goodsId"
                        label="商品ID"
                        width="200">
                    </el-table-column>
                    <el-table-column
                        prop="goodsName"
                        label="商品名">
                    </el-table-column>
                    <el-table-column
                        prop="price"
                        label="单价/元">
                    </el-table-column>
                    <el-table-column
                        prop="goodsCount"
                        label="数量/件"
                        width="100">
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
        </div>
    </div>
</template>

<script>
    import { dateTimeFormat }  from '@/filters/dateFilter.js'
    import { toMoney }  from '@/filters/moneyFilter.js'
    export default {
        props:{
            orderInfo:Object
        },
        data() {
            return {
                htmlTitle: this.orderInfo._id+'订单详情'
            }
        },
        computed:{
            status() {
                return function(val){
                    switch (val) {
                        case 0:
                            return '未发货'
                            break;
                        case 1:
                            return '在路上'
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
        filters:{
            dateTimeFormat(date){
                return dateTimeFormat(date)
            },
            moneyFormat(money){
                return toMoney(money)
            }
        },
        methods: {
            goBack(){
                this.$emit('showListClick')
            },
            getpdf(id){
                let title = id + '订单详情'
                this.getPdf('pdfDom',title)
            }
        },
    }
</script>

<style scoped>
    .back{
        float: right;
        text-decoration:underline;
        color: #3a8ee6;
        font-size: .8em;
        cursor: pointer;
    }
    .form-title{
        float: left;
        margin-top: 20px;
    }
    .order-form{
        clear: both;
    }
    .el-form-item{
        margin-bottom:0px;
        border-bottom: 1px solid #d8dfe5;
    }
    .item-left{
        float: left;
    }
</style>