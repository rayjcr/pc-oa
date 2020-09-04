<template>
    <div class="innerTemplate photo" :class="xjNew&&isGrade6?'grade6':''">
        <div class="xnxq">{{bgdInfo.bgd.xn}}学年{{bgdInfo.bgd.xq=="01"?"第一学期":"第二学期"}}报告单</div>
        <div class="reportTit"></div>

        <div class="userHead">
            <div class="imgBox">
                <img :src="userImgPath?userImgPath:'/static/report/common/_testuser.jpg'">
            </div> 
            <div class="userInfo">
                <div class="userName">{{userInfo.xm}}</div>
                <div class="className">{{userInfo.bjmc}}</div>
            </div> 
        </div>

        <div class="photoflag"></div>
        <div class="photoList">
            <div class="photoBox" :class="xjNew&&isGrade6?'onlyPhoto':''" ref="imgbox" v-for="(item,index) in userPhotoList" v-if="index<4">
                <img class="userimg" :src="item.tpdz" :style="item.linestyle">
            </div>
        </div>
        
        <div v-for="(pj,ind) in otherData" :class="{'xspj':ind==0,'jzpj':ind==1,'hjjl':ind==2}">
          {{pj.fy||''}}
        </div>
<!--        <div class="xspj">{{xszp}}</div>
        <div class="jzpj">{{jzpj}}</div>
        <div class="hjjl">{{hjjl}}</div> -->
        
    </div>
</template>

<script>
import {GetReportTemplate} from 'api/project/report/index';
export default {
    name: "setReport",
    components: {
    
    },
    props:[
       "bgdInfo",
       "pageInfo"
    ],
    data() {
        return {
            userInfo:{},
            userImgPath:"",          //用户头像路径
            
            //    signImg:"",
            userPhotoList:[],
            xszp:"",
            jzpj:"",
            hjjl:"",
            otherData: [],
            xjNew: false,
            isGrade6: false,//是否6年级
        }
    },
    mounted(){
        this.init();
    },
    methods: {
        async GetReportTemplate(){
          var res = await GetReportTemplate({id:this.bgdInfo.bgd.mbid});
          if(res.mbdm=='D07'){
            this.xjNew = true;
          }
        },
        async init(){
            await this.GetReportTemplate();
            this.userImgPath = this.bgdInfo.studentInfo.tx
            this.userInfo = this.bgdInfo.bgdxx;
            var xsfc =  _.find(this.pageInfo.bgdItemlist,{lx:15})

            // console.log(this.pageInfo,"photo");
            this.userPhotoList = xsfc.bgdxsfcList
            this.otherData = _.reject(this.pageInfo.bgdItemlist,{lx:15});
            this.isGrade6 = xsfc.rl==1;
            // this.xszp = _.find(this.pageInfo.bgdItemlist,{bm:"学生自评"}).fy
            // this.jzpj = _.find(this.pageInfo.bgdItemlist,{bm:"家长评价"}).fy
            // this.hjjl = _.find(this.pageInfo.bgdItemlist,{bm:"获奖记录"}).fy
            // 根据图片位置排序
            this.userPhotoList.sort((a,b)=>Number(a.wz)-Number(b.wz));
            
            if(this.userPhotoList.length>xsfc.rl){
              this.userPhotoList.splice(xsfc.rl,(this.userPhotoList.length-xsfc.rl));
            }
            


            var that = this;
            for(let i=0;i<this.userPhotoList.length;i++){
                let newImg = new Image();
                newImg.src = this.userPhotoList[i].tpdz;
                newImg.onload = () => {
                    //that.userPhotoList.tpdz = newImg.src
                    // console.log(i);
                    // console.log(that.$refs.imgbox[i],58)
                    // console.log(that.$refs.imgbox[i].offsetWidth,59);
                    // console.log(that.$refs.imgbox[i].offsetHeight,60);
                    // console.log(newImg.naturalWidth,61);
                    // console.log(newImg.naturalHeight,62);
                    var BoxRatio = that.$refs.imgbox[i].offsetWidth/that.$refs.imgbox[i].offsetHeight;
                    var ImgRatio = newImg.naturalWidth/newImg.naturalHeight;
                    if(BoxRatio>=ImgRatio){
                        that.$set(that.userPhotoList[i],"linestyle",{width:'100%',height:'auto'})
                        // newImg.style.width = "100%";
                        // newImg.style.height = "auto";
                    }else{
                        that.$set(that.userPhotoList[i],"linestyle",{width:'auto',height:'100%'})
                        // that.userPhotoList[i].linestyle = {width:'auto',height:'100%'}
                        // newImg.style.width = "auto";
                        // newImg.style.height = "100%";
                    }
                    // console.log(newImg,777777)


                }
            }
        },
    }
}
</script>

<style scoped lang="scss">
.innerTemplate{
    padding: 0;
    width:1000px;
    height:1415px;
    box-shadow: 0 0 4px rgba(0, 0, 0, .2);
    // transform: scale(.7);
    // transform-origin: top left;
    position: relative;
    // zoom:.7;
    float: left;
}
.photo{
    background: url('/static/report/common/photo1.jpg') no-repeat;
    background-size:100% 100%;
    &.grade6{
      background: url('/static/report/common/photograde6.jpg') no-repeat;
      .photoflag{
        background: url('/static/report/common/title1.png') no-repeat;        
        background-size: 100% 100%;
      }
    }
    .xnxq{
        width: 386px;
        height: 48px;
        border-radius: 24px;
        background: #8adeff;
        position: absolute;
        top: 39px;
        left: 79px;
        font-size: 24px;
        color: #13327d;
        text-align: center;
        line-height: 48px;
        font-weight: bold;
    }
    .userHead{
        position: absolute;
        top: 39px;
        right: 80px;
        .userInfo{
            overflow: hidden;
            text-align: right;
            padding-right: 10px;
            .userName{
                font-size: 22px;
                color: #FFF;
                font-weight: bold;
                line-height: 28px;
            }
            .className{
                font-size: 18px;
                color: #FFF;
                line-height: 28px;
            }
        }
        .imgBox{
            width: 56px;
            height: 56px;
            border-radius: 4px;
            position: relative;
            overflow: hidden;
            float: right;
            img{
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
            }
        }
    }
    .photoflag{
        width:202px;
        height: 49px;
        background: url('/static/report/common/photo_tit.png') no-repeat;
        position: absolute;
        z-index: 5;
        top:160px;
        left: 399px;
    }
    .photoList{
        position: absolute;
        width: 814px;
        top:188px;
        left:93px;
        .photoBox{
            position: relative;
            border-radius: 15px;
            overflow: hidden;
            margin: 0 20px 24px 20px;
            width: 367px;
            height: 207px;
            background: #e5e5e5;
            float: left;
            .userimg{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
            }
            &.onlyPhoto{
              width: 650px;
              height: 350px;
              left: 50px;
              top: 50px;
              border: 12px solid #fff;
              transform: rotate(-5deg);
              transform-origin: left bottom;
              overflow: inherit;
              .userimg{
                height: 100%!important;
                width: 100%!important;
                z-index: 2;
                outline: 12px solid #fff;
              }
              &::after{
                content: '';
                width: 650px;
                height: 350px;
                border: 12px solid #fff;
                position: relative;
                top: -10px;
                left: -15px;
                background-color: #edf3f6;
                border-radius: 15px;
                display: block;
                z-index: 1;
                transform: rotate(5deg);
                transform-origin: left bottom;
              }
            }
        }
    }
    .xspj,.jzpj,.hjjl{
        width: 770px;
        height: 120px;
        position: absolute;
        padding: 15px;
        font-size: 18px;
        color: #444;
        left: 115px;
        word-break: break-all;
    }
    .xspj{
        top: 715px;
    }
    .jzpj{
        top: 932px;
    }
    .hjjl{
        top: 1150px;
    }

}
</style>
