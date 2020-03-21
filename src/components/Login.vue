<template>
   <div class="login" :style="bg">
        <div class="message">MPet-管理登录</div>
        <div id="darkbannerwrap" :style="darkbg"></div>
            <input v-model="username" placeholder="用户名" required="" type="text">
            <hr class="hr15">
            <input v-model="password" placeholder="密码" required="" type="password">
            <hr class="hr15">
            <el-button type='primary' style="width:100%;height:40px;background:#27A9E3" @click="login">登录</el-button>
            <hr class="hr20">

        
    </div>
</template>

<script>
    import axios from 'axios'
    import url from '@/serviceAPI.config.js'
    export default {
        data() {
            return {
                bg:'background:url('+require('../assets/img/web_login_bg.jpg')+') no-repeat center;',
                darkbg:'background: url('+require('../assets/img/aiwrap.png')+')',
                username:'',
                password:''
            }
        },
        methods: {
            login() {
                axios({
                    url:url.login,
                    method:'post',
                    data:{
                        name:this.username,
                        password:this.password
                    }
                })
                .then(response=>{
                    if(response.data.code == 200 && response.data.message){
                        if(response.data.message.name){
                            localStorage.adminInfo = JSON.stringify(response.data.message)
                            this.$emit('changeLoginStatus')
                        }else{
                            this.$message({
                                type:'info',
                                message: response.data.message
                            })
                        }
                    }else{
                        this.$message({
                            type:'info',
                            message: '用户名或密码输入错误'
                        })
                        console.log('密码输入错误')
                    }
                })
                .catch(error=>{
                    console.log(error)
                })
            }
        },
    }
</script>

<style scoped>
    *{
        font: 13px/1.5 '微软雅黑', Verdana, Helvetica, Arial, sans-serif;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        -box-sizing: border-box;
        padding:0;
        margin:0;
        list-style:none;
        box-sizing: border-box;
    }

    body,html{
        height:100%;
        overflow:hidden;
    }
    body{
        background-size: cover;
    }
    a{
        color:#27A9E3;
        text-decoration:none;
        cursor:pointer;
    }
    .login{
        margin: 80px auto 0 auto;
        min-height: 420px;
        max-width: 420px;
        padding: 40px;
        background-color: #ffffff;
        margin-left: auto;
        margin-right: auto;
        border-radius: 4px;
        /* overflow-x: hidden; */
        box-sizing: border-box;
    }
    a.logo{
        display: block;
        height: 58px;
        width: 167px;
        margin: 0 auto 30px auto;
        background-size: 167px 42px;
    }
    .message {
        margin: 10px 0 0 -58px;
        padding: 18px 10px 18px 60px;
        background: #27A9E3;
        position: relative;
        color: #fff;
        font-size: 16px;
    }
    #darkbannerwrap {
        width: 18px;
        height: 10px;
        margin: 0 0 20px -58px;
        position: relative;
    }

    input[type=text],
    input[type=file],
    input[type=password],
    input[type=email], select {
        border: 1px solid #DCDEE0;
        vertical-align: middle;
        border-radius: 3px;
        height: 50px;
        padding: 0px 16px;
        font-size: 14px;
        color: #555555;
        outline:none;
        width:100%;
    }
    input[type=text]:focus,
    input[type=file]:focus,
    input[type=password]:focus,
    input[type=email]:focus, select:focus {
        border: 1px solid #27A9E3;
    }


    input[type=submit],
    input[type=button]{
        display: inline-block;
        vertical-align: middle;
        padding: 12px 24px;
        margin: 0px;
        font-size: 18px;
        line-height: 24px;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
        color: #ffffff;
        background-color: #27A9E3;
        border-radius: 3px;
        border: none;
        -webkit-appearance: none;
        outline:none;
        width:100%;
    }
    hr.hr15 {
        height: 15px;
        border: none;
        margin: 0px;
        padding: 0px;
        width: 100%;
    }
    hr.hr20 {
        height: 20px;
        border: none;
        margin: 0px;
        padding: 0px;
        width: 100%;
    }

    .copyright{
        font-size:14px;
        color:rgba(255,255,255,0.85);
        display:block;
        position:absolute;
        bottom:15px;
        right:15px;
    }
</style>