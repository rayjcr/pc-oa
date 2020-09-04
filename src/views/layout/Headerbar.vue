<template>

<el-row class="headerbardialog">
    <div class='hdlg'>
    <!-- <div class="logo"><img :src="avatar"/></div> -->
        <el-popover
        placement="bottom-start"
        width="426"
        trigger="click" v-model="mainMenu">
            <div class="header-menu" :class="{on:moreClick}">
                <div class='submenu' v-for="(item,index) in permissionMenus" :index="item.title" :key="index"
                    :class="{on:(sidebarcurMenuId==item.id)}" @click="submenuClick(item)">
                <div class="submenu-img"><i :class="item.icon"></i></div>
                <div class='submenu-title'>{{item.title}}</div>
                </div>
            </div>

            <!-- <i slot="reference" class="allApplication el-icon-menu"></i> -->
            <el-button slot="reference" class="allApplication el-icon-menu"> 主菜单 </el-button>
        </el-popover>
    </div>

    <div class="hdmenu">
    <!-- <div class="el-icon-s-fold"></div> -->
    
    
    <!-- <Navbarsmall></Navbarsmall> -->
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <div class="schoolname">{{infoxxmc}}</div>
    <!--查询框-->
    <div class="hdSearch">
        <!-- <el-input v-model="searchIpt" class="searchIpt" placeholder="请输入查询内容"></el-input> -->
    </div>
    
    
    <!-- <div class="menu-more" @click="moreClick=!moreClick">
        <div class="submenu-img"><i class="el-icon-more"></i></div>
        <div class='submenu-title'>更多</div>
    </div> -->
    </div>
    <div style="min-width:300px;float:right;">


    <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
        <div class="logo"><img :src="avatar"/></div>
        <span class="Topusername">{{username}}</span>
        <i class="el-icon-arrow-down"></i>
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class='inlineBlock' to="/">
            <el-dropdown-item> 首页</el-dropdown-item>
        </router-link>
        <el-dropdown-item divided><span @click="grzl" style="display:block;">个人资料</span></el-dropdown-item>
        <el-dropdown-item divided><span @click="xgmm" style="display:block;">修改密码</span></el-dropdown-item>
        <el-dropdown-item divided><span @click="logout" style="display:block;">退出登录</span></el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>

    <!-- <el-badge :value="12" class="msgitem">
        <i class="el-icon-bell"></i>
    </el-badge>

    <el-badge :value="5" class="msgitem" type="warning">
        <i class="el-icon-message"></i>
    </el-badge> -->
    <!--个人资料-->


    <transition name="sliderRight" mode="out-in">
    <div class="personInfo" v-if="dialogFormGrzl">
        <div class="personMain">
            <div class="col">
                <div class="colTit">用户名:</div>
                <div class="colCont">{{yhm}}</div>
            </div>
            <div class="col">
                <div class="colTit">姓名:</div>
                <div class="colCont">{{username}}</div>
            </div>
            <div class="col">
                <div class="colTit">所在学校:</div>
                <div class="colCont">{{xxmc}}</div>
            </div>
            <div class="col">
                <div class="colTit">当前学年学期:</div>
                <div class="colCont">{{dqxn}}{{dqxq}}</div>
            </div>
            <div class="col">
                <div class="colTit">用户类型:</div>
                <div class="colCont">{{type}}</div>
            </div>
            <div class="col">
                <div class="colTit">用户角色:</div>
                <div class="colCont">{{jsmc}}</div>
            </div>
            <div class="col">
                <div class="colTit">所在部门:</div>
                <div class="colCont">{{szbmmc}}</div>
            </div>
            <div class="col" v-if="(lx!=2)">
                <div class="colTit">电子签名:</div>
                <div class="colCont">
                    <el-upload
                    class="avatar-uploader avatar-uploader-width"
                    action="/api/base/jcXxjbsj/sctps"
                    accept=".jpg,.png"
                    :headers="headers"
                    :show-file-list="false"
                    :onSuccess="handleImageSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="avatarImg" :src="avatarImg" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i><div class="avatarTips" v-if="!avatarImg">为保证图片质量，请上传透明底图片</div>
                    </el-upload>
                </div>
            </div>
        </div>
        <!-- <el-form label-width="120px" style="">
        <el-form-item class="col" label="当前学年学期">
            <span>{{dqxn}}{{dqxq}}</span>
        </el-form-item>
        <el-form-item class="col" label="用户名">
            <span>{{yhm}}</span>
        </el-form-item>
        <el-form-item class="col" label="姓名">
            <span>{{username}}</span>
        </el-form-item>
        <el-form-item class="col" label="所在学校">
            <span>{{xxmc}}</span>
        </el-form-item>
        <el-form-item class="col" label="用户类型">
            <span>{{type}}</span>
        </el-form-item>
        <el-form-item class="col" label="用户角色">
            <span>{{jsmc}}</span>
        </el-form-item>
        <el-form-item class="col" label="所在部门">
            <span>{{szbmmc}}</span>
        </el-form-item>
        <el-form-item label="电子签名">
            <el-upload
            class="avatar-uploader avatar-uploader-width"
            action="/api/base/jcXxjbsj/sctps"
            accept=".jpg,.png"
            :headers="headers"
            :show-file-list="false"
            :onSuccess="handleImageSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="avatarImg" :src="avatarImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" style="line-height: 120px;"></i><div v-if="!avatarImg">为保证图片质量，请上传透明底图片</div>
            </el-upload>
        </el-form-item>
        </el-form> -->
    </div>
    </transition>


    <!-- <el-dialog class="headerdilog"
                :visible.sync="false"
                append-to-body
                title="个人资料"
                width="400px" @close="colseDialog">
        <el-form label-width="120px" style="">
        <el-form-item label="当前学年学期">
            <span>{{dqxn}}{{dqxq}}</span>
        </el-form-item>
        <el-form-item label="用户名">
            <span>{{yhm}}</span>
        </el-form-item>
        <el-form-item label="姓名">
            <span>{{username}}</span>
        </el-form-item>
        <el-form-item label="所在学校">
            <span>{{xxmc}}</span>
        </el-form-item>
        <el-form-item label="用户类型">
            <span>{{type}}</span>
        </el-form-item>
        <el-form-item label="用户角色">
            <span>{{jsmc}}</span>
        </el-form-item>
        <el-form-item label="所在部门">
            <span>{{szbmmc}}</span>
        </el-form-item>
        <el-form-item label="电子签名">
            <el-upload
            class="avatar-uploader avatar-uploader-width"
            action="/api/base/jcXxjbsj/sctps"
            accept=".jpg,.png"
            :headers="headers"
            :show-file-list="false"
            :onSuccess="handleImageSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="avatarImg" :src="avatarImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" style="line-height: 120px;"></i><div v-if="!avatarImg">为保证图片质量，请上传透明底图片</div>
            </el-upload>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button @click="colseDialog">关闭</el-button>
        </div>
    </el-dialog> -->

    <!--修改密码-->
    <el-dialog :visible.sync="dialogFormXgmm"
                width="400px"
                append-to-body
                title="密码修改"
                @close="colseDialog">
        <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="80px">
        <el-form-item label="用户名">
            <span>{{yhm}}</span>
        </el-form-item>
        <el-form-item label="密 码" placeholder="请输入密码" prop="oldmm">
            <el-input type="password" v-model="dataForm.oldmm" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item required label="新密码" placeholder="请输入密码" prop="newmm">
            <el-input type="password" v-model="dataForm.newmm" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item required label="确认密码" placeholder="请输入密码" prop="confirm_mm">
            <el-input type="password" v-model="dataForm.confirm_mm" auto-complete="off"></el-input>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('dataForm')">重置</el-button>
        <!--保存-->
        <el-button type="primary" @click="updateData('dataForm')">确认</el-button>
        </div>
    </el-dialog>
    </div>

</el-row>

</template>
<script>
import { mapGetters } from 'vuex';
import Hamburger from 'components/Hamburger';
import Screenfull from 'components/Screenfull';
import { dqxnxqObj } from '@/api/pkxt/arrangingTask/index';
import { getJsBm } from '@/api/admin/group/index';
import { updateMM } from '@/api/admin/user/index';
import { saveSignImage,getSignImage } from '@/api/admin/teach/index';
import Cookies from 'js-cookie'
// import Navbarsmall from 'views/layout/NavbarMin';

export default {
    name: 'Headerbar',
    computed: {
    ...mapGetters([
        'name',
        'avatar',
        'infoxxmc',
        'sidebar',
        'permissionMenus',
        'sidebarcurMenuId'
    ]),
    isCollapse() {
        return !this.sidebar.opened
    },
    headers: function () {
        return {Authorization: Cookies.get("Admin-Token"), ReturnResultCode: true}
    }
    },
    components: {
        Screenfull,
        Hamburger,
        // Navbarsmall
    },
    data() {
    const validatePass = (rule, value, callback) => {
        if (value === '') {
        callback(new Error('请输入密码'));
        } else if (value.length < 5 || value.length > 20) {
        callback(new Error('长度在 5 到 20 个字符'));
        } else {
        if (this.dataForm.confirm_mm !== '') {
            this.$refs.dataForm.validateField('confirm_mm');
        }
        callback();
        }
    };
    const validatePass2 = (rule, value, callback) => {
        if (value === '') {
        callback(new Error('请输入密码'));
        } else if (value.length < 5 || value.length > 20) {
        callback(new Error('长度在 5 到 20 个字符'));
        } else if (value !== this.dataForm.newmm) {
        callback(new Error('两次输入密码不一致!'));
        } else {
        callback();
        }
    };
    return {
        searchIpt:'',
        userid: '',
        username: '',
        usercode: '',
        lx:'',
        xxdm: '',
        xxmc: '',
        yhm: '',
        type: '',
        jsmc: '',
        szbmmc: '',
        curCode: '',
        pathChange: '',
        moreClick: false,
        avatarImg: '',
        dialogFormGrzl: false,
        dialogFormXgmm: false,
        dqxn: '',
        dqxq: '',
        typeObject: [
        { typeid: '1', typemc: '系统管理员' },
        { typeid: '2', typemc: '学校管理员' },
        { typeid: '3', typemc: '普通老师' },
        { typeid: '4', typemc: '学生' }
        ],
        dataForm: {
        oldmm: '',
        newmm: '',
        confirm_mm: ''
        },
        rules: {
        oldmm: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ],
        newmm: [
            { validator: validatePass, trigger: 'blur' }
        ],
        confirm_mm: [
            { validator: validatePass2, trigger: 'blur' }
        ]
        },
        mainMenu:false,
    }
    },
    watch: {},
    created() {


    var that = this;
    this.username = this.$store.getters.name;
    this.xxdm = window.localStorage.getItem('xxdm');
    this.xxmc = window.localStorage.getItem('xxmc');
    this.yhm = window.localStorage.getItem('username');
    this.userid = window.localStorage.getItem('userid');
    this.usercode = window.localStorage.getItem('usercode');
    const lx = this.lx =  window.localStorage.getItem('lguserType');
    this.type = _.find(this.typeObject, { typeid: lx }).typemc;
    // this.avatarImg = this.$store.getters.avatar
    // this.$store.dispatch('SetCurMenu',this.curCode)
    // var that = this
    // this.permissionMenus.forEach(function(item,index){
    //     if(item.code==that.curCode){
    //         that.$store.dispatch('SetCurMenuId',item.id)
    //     }
    // })
    document.addEventListener("click",function(e){
        var flag = false;
        e.path.forEach(element => {
            if(element.className=="personInfo"){
                flag = true;
            }
        });
        // console.log(flag,330088)
        if(!flag){
            that.dialogFormGrzl = false;
        }
    })
    },
    methods: {
    submenuClick(item) {
        this.$store.dispatch('ToggleSideBar', { curMenu: item.code })
        this.$store.dispatch('SetCurMenu', item.code)
        this.$store.dispatch('SetCurMenuId', item.id)
        const that = this
        this.pathChild(item)
        this.$router.push({ path: that.pathChange });
        this.mainMenu = false;
        // var curCodeList =this.$route.path.split("/")
        // this.curCode = curCodeList[1];
        this.moreClick = false
    },
    pathChild(item) {
        if (item.children && item.children.length > 0) {
        this.pathChange = '/' + item.code
        this.pathChild(item.children[0])
        } else {
        this.pathChange = this.pathChange + '/' + item.code
        }
    },
    grzl() {
        this.dialogFormGrzl = true;
        dqxnxqObj({ xxdm: this.xxdm }).then(response => {
        this.dqxn = response.data.xn + '学年';
        this.dqxq = response.data.xq === '01' ? '上学期' : '下学期';
        })
        this.jsmc = '';
        this.szbmmc = '';
        // 获取角色
        this.getJsBm('js');
        // 获取所在部门
        this.getJsBm('bm');
        if(this.type==='普通老师'){
        // 获取电子签名
        const param = {zgh:this.usercode,userid:this.userid,xxdm:this.xxdm};
        getSignImage(param).then(res => {
            if(res.status==200){
            this.avatarImg=res.data;
            }
        })
        }

    },
    getJsBm(val) {
        if (val === 'js') {
        getJsBm({ userid: this.userid, groupType: '1' }).then(response => {
            if (response.length > 0) {
            for (let i = 0; i < response.length; i++) {
                if (i > 0) {
                this.jsmc += '，';
                }
                this.jsmc += response[i].name;
            }
            }
        })
        } else {
        getJsBm({ userid: this.userid, groupType: '2' }).then(response => {
            if (response.length > 0) {
            for (let i = 0; i < response.length; i++) {
                if (i > 0) {
                this.szbmmc += '，';
                }
                this.szbmmc += response[i].name;
            }
            }
        })
        }
    },
    xgmm() {
        this.dialogFormXgmm = true;
    },
    colseDialog() {
        this.dialogFormGrzl = false;
        this.dialogFormXgmm = false;
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar',{"opened":this.sidebar.opened})
    },
    updateData(formName) {
        this.$refs[formName].validate(valid => {
        if (valid) {
            this.dataForm.id = this.userid;
            updateMM(this.dataForm).then(res => {
            if (res.status === 200) {
                this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 });
                setTimeout(() => {
                this.dialogFormXgmm = false;
                }, 1500);
            } else {
                this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
                return false;
            }
            })
        } else {
            return false;
        }
        });
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
    },
    logout() {
        this.$store.dispatch('SetCurMenuId', 'dashboard')
        this.$store.dispatch('LogOut').then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
    },
    handleImageSuccess(res, file) {
        const imgPath = {path:res.data[0].path};
        // 保存电子签名
        saveSignImage(imgPath).then(res => {
        if(res.status!=200){
            this.$message.error('上传失败');
        }else{
            this.avatarImg = URL.createObjectURL(file.raw);
        }
        })
    },
    // 上传前对文件的大小的判断
    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG 格式或 PNG 格式!');
        }
        if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return (isJPG || isPNG) && isLt2M;
    }
    },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
 .sliderRight-enter-active {
    animation-name: bounceInRight;
    animation-duration: .5s;
  }

  .sliderRight-leave-active {
    animation-name: bounceOutRight;
    animation-duration: .5s;
  }
.el-row {
    height: 100%;
    .el-col {
    height: 100%;
    position: relative;
    }
}
.hdlg{
    width:210px;
    position: absolute;
    text-align: center;
    top: 0;
    left: 0;
    background: #3a3f51;
    z-index: 10;
}
.schoolname{
    float: left;
    height: 60px;
    line-height: 60px;
    padding: 0 30px 0 10px;
    font-size: 16px;
    color: #3a3f51;
}
.hamburger-container {
    line-height: 60px;
    height: 60px;
    width:40px;
    text-align: center;
    float: left;
}
.hdmenu{
    padding-left: 210px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
}
.allApplication{
    float: left;
    font-size: 20px;
    height: 60px;
    width: 60px;
    border: none;
    text-align: center;
    cursor: pointer;
    background: transparent !important;
    transition: .2s all;
    color: #FFF;
}
.allApplication:hover{
    color: #409eff;
}
.personInfo{
    background:#FFF;
    box-shadow: -1px 2px 2px rgba(0, 0, 0, .15);
    height: 100%;
    width: 300px;
    overflow:auto;
    position: fixed;
    top: 60px;
    bottom: 0;
    .personMain{
        padding:20px 20px;
        .col{
            padding: 10px 0;
            border-bottom: 1px solid #ccc;
        }
        .colTit{
            font-size: 14px;
            font-weight: bold;
            height: 30px;
            line-height: 30px;
        }
        .colCont{
            min-height: 30px;
            color: #999;
            line-height: 30px; 
        }
        .avatar-uploader-icon{
            width: 245px;
            height: 130px;
            font-size: 14px;
            line-height: 130px;
            color: #8c939d;
            text-align: center;
        }
        .avatar-uploader{
            width: 245px;
            height: 130px;
            position: relative;
        }
        /deep/ .el-upload{
            width: 245px;
            height: 130px;
            position: relative;
        }
        .avatarTips{
            position: absolute;
            width: 100%;
            left: 0;
            bottom: 10px;
        }
        .avatar{
            width: 100%;
            height: auto;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
    }
}

.header-menu {
    z-index: 20;
    border-bottom: none;
    color: #444;
    overflow: hidden;
    &.on {
    height: auto;
    }
    .submenu {
    cursor: pointer;
    width: 100px;
    height: 100px;
    padding-top: 25px;
    float: left;
    box-sizing: border-box;
    // display:inline-block;
    cursor: pointer;
    &.on {
        border-bottom: 3px solid #409eff;
        .submenu-title {
        color: #444;
        }
    }
    }
}

.msgitem{
    float: left;
    margin-top: 18px;
    margin-right: 30px;
    i{
        font-size: 24px;
    }
}

.searchIpt{
    width: 200px;
    height: 30px;
    margin-top: 10px;
    /deep/ input{
    border-radius: 20px;
    }
}

.submenu-img {
    width: 30px;
    height: 30px;
    margin: 0 auto;
    text-align: center;
    i {
    display: block;
    width: 100%;
    height: 100%;
    font-size: 18px;
    line-height: 30px;
    }
    .navico_1 {
    background: url(../../assets/nav_images/navico_1.png) no-repeat center;
    }
    .navico_2 {
    background: url(../../assets/nav_images/navico_2.png) no-repeat center;
    }
    .navico_3 {
    background: url(../../assets/nav_images/navico_3.png) no-repeat center;
    }
    .navico_4 {
    background: url(../../assets/nav_images/navico_4.png) no-repeat center;
    }
    .navico_5 {
    background: url(../../assets/nav_images/navico_5.png) no-repeat center;
    }
    .navico_6 {
    background: url(../../assets/nav_images/navico_6.png) no-repeat center;
    }
    .navico_7 {
    background: url(../../assets/nav_images/navico_7.png) no-repeat center;
    }
    .navico_8 {
    background: url(../../assets/nav_images/navico_8.png) no-repeat center;
    }
    .navico_9 {
    background: url(../../assets/nav_images/navico_9.png) no-repeat center;
    }
    .navico_10 {
    background: url(../../assets/nav_images/navico_10.png) no-repeat center;
    }
    .navico_11 {
    background: url(../../assets/nav_images/navico_11.png) no-repeat center;
    }
    .navico_12 {
    background: url(../../assets/nav_images/navico_12.png) no-repeat center;
    }
    .navico_13 {
    background: url(../../assets/nav_images/navico_13.png) no-repeat center;
    }
    .navico_jlk {
    background: url(../../assets/nav_images/jlk.png) no-repeat center;
    }
}

.submenu {
    &.on {
    color: #409EFF;
    .navico_1 {
        background: url(../../assets/nav_images/navico_on_1.png) no-repeat center;
    }
    .navico_2 {
        background: url(../../assets/nav_images/navico_on_2.png) no-repeat center;
    }
    .navico_3 {
        background: url(../../assets/nav_images/navico_on_3.png) no-repeat center;
    }
    .navico_4 {
        background: url(../../assets/nav_images/navico_on_4.png) no-repeat center;
    }
    .navico_5 {
        background: url(../../assets/nav_images/navico_on_5.png) no-repeat center;
    }
    .navico_6 {
        background: url(../../assets/nav_images/navico_on_6.png) no-repeat center;
    }
    .navico_7 {
        background: url(../../assets/nav_images/navico_on_7.png) no-repeat center;
    }
    .navico_8 {
        background: url(../../assets/nav_images/navico_on_8.png) no-repeat center;
    }
    .navico_9 {
        background: url(../../assets/nav_images/navico_on_9.png) no-repeat center;
    }
    .navico_10 {
        background: url(../../assets/nav_images/navico_on_10.png) no-repeat center;
    }
    .navico_11 {
        background: url(../../assets/nav_images/navico_on_11.png) no-repeat center;
    }
    .navico_12 {
        background: url(../../assets/nav_images/navico_on_12.png) no-repeat center;
    }
    .navico_13 {
        background: url(../../assets/nav_images/navico_on_13.png) no-repeat center;
    }
    .navico_jlk {
        background: url(../../assets/nav_images/jlk.png) no-repeat center;
    }
    }

}
.submenu.on{
    background: #f2f2f2;
    border-radius: 10px;
}
.submenu:hover{
    background: #f2f2f2;
    border-radius: 10px;
}

.on .submenu-title{
    color: #409EFF !important;
}
.submenu-title {
    width: 100%;
    text-align: center;
    color: #333333;
    line-height: 36px;
}

.menu-more {
    position: absolute;
    right: 0;
    top: 0;
    width: 120px;
    height: 100%;
    padding-top: 25px;
    color: #fff;
    cursor: pointer;
}

.avatar-help {
    float: right;
    color: #409eff;
    font-size: 24px;
    line-height: 100px;
}

.avatar-line {
    border-right: 1px solid rgba(255, 255, 255, .3);
    height: 30px;
    float: right;
    margin: 35px 30px;
}

.avatar-container {
    float: right;
    height: 60px;
    line-height: 60px;
    color: #444;
    padding-right: 20px;
    position: relative;
    .avatar-wrapper {
    cursor: pointer;
    position: relative;
    padding-left: 50px;
    .logo{
        position: absolute;
        height: 40px;
        width: 40px;
        top:10px;
        left: 0;
        border-radius: 20px;
        overflow: hidden;
        img{
        width: 100%;
        height: 100%;
        display: block;
        }
    }
    .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
    }
    .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        // top: 25px;
        top: 0;
        line-height: 60px;
        font-size: 12px;
    }
    }
}

::-webkit-scrollbar {
    width: 12px;
    background-color: #324157;
}

::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    background-color: #555;
}

::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
}
</style>
<style>
.headerbardialog .el-dialog .el-input__inner {
    width: 250px;
}

.headerbardialog .el-dialog {
    min-width: 400px !important;
}

.headerbardialog .el-dialog__footer {
    padding: 0 20px 20px !important;
    margin-top: -40px !important;
}
</style>
