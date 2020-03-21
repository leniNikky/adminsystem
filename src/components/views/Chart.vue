<template>
    <div class="chart">
        <div class="total-num">
            <div class="total-num-item">
                <div class="item-title">
                    <img src="../../assets/img/user.png">
                    <span>用户数</span>
                </div>
                <div class="item-num user">{{mpetData.userCount}}</div>
            </div>
            <div class="total-num-item">
                <div class="item-title">
                    <img src="../../assets/img/order.png">
                    <span>交易总额</span>
                </div>
                <div class="item-num order">{{mpetData.orderMoney}}</div>
            </div>
            <div class="total-num-item">
                <div class="item-title">
                    <img src="../../assets/img/goods.png">
                    <span>商品服务数</span>
                </div>
                <div class="item-num goods">{{mpetData.goodsCount}}</div>
            </div>
        </div>
        <div class="chart">
             <div id="chartmainpie" style="width:300px; height:400px;float:left;display:block"></div>
             <div id="chartmainbar" style="width:600px; height:400px;float:left;display:block"></div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import url from '@/serviceAPI.config.js'
    export default {
        data() {
            return {
                mpetData: {},
                goodsName:[],
                goodsSaleCount:[],
            }
        },
        created(){
            this.getData()
        },
        methods: {
            drawLine(optionbar,optionpie){
                //基于准本好的DOM，初始化echarts实例
                let myChartBar = this.$echarts.init(document.getElementById('chartmainbar'))
                let myChartPie = this.$echarts.init(document.getElementById('chartmainpie'))
                //绘制图表
                  myChartBar.setOption(optionbar);
                  myChartPie.setOption(optionpie);
            },
            getData() {
                axios({
                    url:url.getData,
                    method:'get'
                })
                .then(res=>{
                    if(res.data.code==200 && res.data.message){
                        this.mpetData = res.data.message
                        this.mpetData.goods.forEach((item,index)=>{
                            this.goodsName.push(item.NAME.substring(0,7))
                            this.goodsSaleCount.push(item.SALES_COUNT)
                        })
                        let optionbar={
                            title:{
                                text:'销量统计（前5）'
                            },

                            tooltip:{},
                            legend:{
                                data:['用户来源']
                            },
                            xAxis:{
                                data:this.goodsName,
                                axisLabel: {
                                    show: true,
                                    rotate: 10
                                },
                                 interval : 0,

                            },
                            yAxis:{
            
                            },
                            series:[{
                                name:'销售详情',
                                type:'bar', //设置图表主题
                                data:this.goodsSaleCount
                            }]
                        }
                        let optionpie = {
                            title: { text: '宠物猫/狗比例' },
                            radius : '90%',
                            tooltip: {},
                            series: [{
                                name:'数量',
                                type: 'pie',
                                data: [{name:'猫',value:this.mpetData.catCount},{name:'狗',value:this.mpetData.dogCount}]
                            }]
                        }
                        //this.SetEchart(optionbar)
                        this.drawLine(optionbar,optionpie)
                    }
                })
            }
        },
    }
</script>

<style lang='less' scoped>
    
    .total-num{
        margin:10px 0 10px 1%;
        .total-num-item{
            width: 20%;
            height: 100px;
            border: 1px solid #e4e4e4;
            border-radius: 5px;
            float: left;
            margin-right: 3%;
            .item-title{
                float: left;
                margin: 15px;
                img{
                    width: 50px;
                    height: 50px;
                }
                span{
                    height: 50px;
                    line-height: 50px;
                    float: right;
                    margin-left: 10px;
                    font-weight: bold;
                    font-size: 1.2rem;
                }
            }
            .item-num{
                clear: both;
                float: left;
                margin: 0 75px;
                margin-top: -20px;
                font-size: 1.2rem;
            }
            .user{
                color:rgb(18,150,219);
            }
            .order{
                color: rgb(246,131,162)
            }
            .goods{
                color:rgb(181,230,110)
            }
        }
    }
    .chart{
        clear: both;
        padding: 30px;
    }
</style>