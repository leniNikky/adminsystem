<template>
    <div class="index">
        <login v-show="!isLogin" @changeLoginStatus="changeLoginStatus"></login>
        <header-part class="header" v-show="isLogin" @changeLoginStatus="changeLoginStatus"></header-part>
        <div class="main" v-show="isLogin">
            <!-- <div class="left">
                <router-link :to="{name:'GoodsOrdersList'}" class="left-item">商品订单</router-link>
                <router-link :to="{name:'ServiceOrderList'}" class="left-item">服务订单</router-link>
                <router-link :to="{name:'CategoryList'}" class="left-item">分类管理</router-link>
                <router-link :to="{name:'GoodsList'}" class="left-item">商品列表</router-link>
                <router-link :to="{name:'ServiceList'}" class="left-item">服务列表</router-link>
                <router-link :to="{name:'CqList'}" class="left-item">宠圈管理</router-link>
                <router-link :to="{name:'UserList'}" class="left-item">用户管理</router-link>
                <router-link :to="{name:'Comments'}" class="left-item">评论审核</router-link>
                <router-link :to="{name:'Notice'}" class="left-item">公告管理</router-link>
            </div> -->
            <el-row class="tac">
                <el-col :span="4">
                    <el-menu
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                     :style="fullHeight">
                    <el-menu-item index="1">
                        <router-link slot="title" :to="{name:'Chart'}" :class="{grayColor:num!=1,yellowColor:num==1}"><p class="nav-margin" @click="changeColor(1)">总体概览</p></router-link>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <router-link slot="title" :to="{name:'GoodsOrdersList'}" :class="{grayColor:num!=2,yellowColor:num==2}"><p class="nav-margin" @click="changeColor(2)">商品订单</p></router-link>
                    </el-menu-item>
                    <el-menu-item index="3">
                        <router-link slot="title" :to="{name:'ServiceOrderList'}" :class="{grayColor:num!=3,yellowColor:num==3}"><p class="nav-margin" @click="changeColor(3)">服务订单</p></router-link>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <router-link slot="title" :to="{name:'CategoryList'}" :class="{grayColor:num!=4,yellowColor:num==4}"><p class="nav-margin" @click="changeColor(4)">分类管理</p></router-link>
                    </el-menu-item>
                    <el-menu-item index="5">
                        <router-link slot="title" :to="{name:'GoodsList'}" :class="{grayColor:num!=5,yellowColor:num==5}"><p class="nav-margin" @click="changeColor(5)">商品列表</p></router-link>
                    </el-menu-item>
                    <el-menu-item index="6">
                        <router-link slot="title" :to="{name:'ServiceList'}" :class="{grayColor:num!=6,yellowColor:num==6}"><p class="nav-margin" @click="changeColor(6)">服务列表</p></router-link>
                    </el-menu-item>
                    <el-menu-item index="7">
                        <router-link slot="title" :to="{name:'CqList'}" :class="{grayColor:num!=7,yellowColor:num==7}"><p class="nav-margin" @click="changeColor(7)">宠圈管理</p></router-link>
                    </el-menu-item>
                    <el-menu-item index="8">
                        <router-link slot="title" :to="{name:'UserList'}" :class="{grayColor:num!=8,yellowColor:num==8}"><p class="nav-margin" @click="changeColor(8)">用户管理</p></router-link>
                    </el-menu-item>
                    <el-menu-item index="9">
                        <router-link slot="title" :to="{name:'Comments'}" :class="{grayColor:num!=9,yellowColor:num==9}"><p class="nav-margin" @click="changeColor(9)">评论审核</p></router-link>
                    </el-menu-item>
                    <el-menu-item index="10">
                        <router-link slot="title" :to="{name:'Notice'}" :class="{grayColor:num!=10,yellowColor:num==10}"><p class="nav-margin" @click="changeColor(10)">公告管理</p></router-link>
                    </el-menu-item>
                    </el-menu>
                </el-col>
                <el-col :span="20">
                    <div class="right" :style="fullHeight">
                        <router-view></router-view>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import HeaderPart from '@/components/Header'
    import Login from '@/components/Login'
    export default {
        data() {
            return {
                pageName: '',
                isLogin:false,
                num:1,
                defaultNum:3,
                fullHeight: 'height:'+(document.documentElement.clientHeight-70)+'px',
                realHeight:document.documentElement.clientHeight
            }
        },
        components:{
            HeaderPart,
            Login
        },
        watch:{
            realHeight(val){
                fullHeight='height:'+val+'px'
            }
        },
        created(){
            if(localStorage.adminInfo){
                this.isLogin = true
            }
            switch(this.$route.name){
                case 'Chart':
                    this.changeColor(1)
                    this.defaultNum = 1
                    break;
                case 'GoodsOrdersList':
                    this.changeColor(2)
                    break;
                case 'ServiceOrderList':
                    this.changeColor(3)
                    break;
                case 'CategoryList':
                    this.changeColor(4)
                    break;
                case 'GoodsList':
                    this.changeColor(5)
                    break;
                case 'ServiceList':
                    this.changeColor(6)
                    break;
                case 'CqList':
                    this.changeColor(7)
                    break;
                case 'UserList':
                    this.changeColor(8)
                    break;
                case 'Comments':
                    this.changeColor(9)
                    break;
                case 'Notice':
                    this.changeColor(10)
                    break;
            }
        },
        methods: {
            changeColor(num){
                this.num = num
            },
            changeRightPage(name) {
                console.log(name+'123')
                this.pageName = name
            },
            changeLoginStatus(){
                if(!localStorage.adminInfo){
                    this.isLogin = false
                }else{
                    this.isLogin = true
                }
            }

        },
    }
</script>

<style lang='less' scoped>
    .index{
        width:100%;
        height:100%;
        .header{
            border-bottom:.5px solid #ccc;
            position: fixed;
            top: 0px;
            z-index: 2
        }
        .main{
            position: relative;
            margin-top:70px;
            .left{
                float: left;
                width: 15%;
                height: 100%;
                font-size: 1rem;
                background: rgb(51, 51, 51);
                .left-item{
                    height: 35px;
                    line-height: 35px;
                    font-size: 16px;
                    color: #fff !important;
                    display: block;
                    border-bottom:.5px solid #ccc;
                    text-decoration-line: none;
                }
            }
            .right{
                overflow-y: scroll;
                overflow-x:hidden;
            }
            .right::-webkit-scrollbar{
                display: none;
            }
        }
      
    }
    .grayColor{
        text-decoration-line: none;
        color: rgb(144,147,150)
    }
    .yellowColor{
        text-decoration-line: none;
        color: rgb(255,208,75)
    }
    .nav-margin{
        margin: 0px;
    }
</style>