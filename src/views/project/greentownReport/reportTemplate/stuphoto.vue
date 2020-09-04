<template>
    <div class="innerTemplate stuphoto">

        <div class="photoBox">
            
            <div class="photounit" :class="'photo_'+(index+1)" v-for="(item,index) in userPhotoListS">
                <div class="imgbox" ref="imgbox">
                    <img class="userimg" v-if="userPhotoList[item]" :src="userPhotoList[item].tpdz" :style="userPhotoList[item].linestyle">
                </div>
                <span class="imgtit" v-if="userPhotoList[item]">{{userPhotoList[item].bz}}</span>
            </div> 

        </div>







    </div>
</template>

<script>

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
           userPhotoListS:[0,1,2,3,4,5,6],
           userPhotoList:[],
           mbname:'',
        }
    },
    mounted(){
        var that = this;
        var allPhotoList = this.pageInfo.bgdItemlist[0].bgdxsfcList;

        var mbNo = this.pageInfo.bgdItemlist[0].fy;

        this.userPhotoList = _.filter(allPhotoList,{"mb":mbNo});
        this.userPhotoList = _.sortBy(this.userPhotoList,['wz']);

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

        // console.log(this.userPhotoList,86);

        // console.log(this.bgdInfo,70)
    },
    methods: {

    }
}
</script>

<style scoped lang="scss">
.innerTemplate{
    padding: 0;
    width:1000px;
    height:1415px;
    box-shadow: 0 0 4px rgba(0, 0, 0, .2);
    position: relative;
    // transform: scale(.7);
    // transform-origin: top left;
    // zoom:.7;
    float: left;
}


.stuphoto{
    background: url('/static/report/high/stuphoto.jpg') no-repeat;
    background-size:100% 100%;
    .photoBox{
        width: 100%;
        height: 100%;
        position: relative;
        .userimg{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            display: block;
        }
        .photounit{
            border: 5px solid #ffffff;
            border-radius: 4px;
            background: #FFF;
            position: absolute;
            box-shadow: 10px 10px 0px rgba(0, 0, 0, .2); 
        }
        .imgtit{
            display: block;
            height: 45px;
            width: 100%;
            line-height: 50px;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            background: #FFF;
        }
        .photo_1{
            width: 323px;
            height: 235px;
            top: 285px;
            left: 95px;
            z-index: 5;
            .imgbox{
                width: 100%;
                height: 185px;
                position: relative;
                overflow: hidden;
            }
        }
        .photo_2{
            width: 323px;
            height: 235px;
            top: 239px;
            left: 544px;
            transform: rotate(15deg);
            .imgbox{
                width: 100%;
                height: 185px;
                position: relative;
                overflow: hidden;
            }
        }
        .photo_3{
            width: 258px;
            height: 180px;
            transform: rotate(-15deg);
            top: 664px;
            left: 70px;
            .imgbox{
                width: 100%;
                height: 130px;
                position: relative;
                overflow: hidden;
            }
        }
        .photo_4{
            width: 280px;
            height: 460px;
            top: 500px;
            left: 364px;
            .imgbox{
                width: 100%;
                height: 410px;
                position: relative;
                overflow: hidden;
            }
        }
        .photo_5{
            width: 255px;
            height: 355px;
            transform: rotate(-15deg);
            top: 594px;
            left: 659px;
            .imgbox{
                width: 100%;
                height: 305px;
                position: relative;
                overflow: hidden;
            }
        }
        .photo_6{
            width: 188px;
            height: 335px;
            top: 935px;
            left: 143px;
            transform: rotate(15deg);
            .imgbox{
                width: 100%;
                height: 285px;
                position: relative;
                overflow: hidden;
            }
        }
        .photo_7{
            width: 323px;
            height: 235px;
            transform: rotate(-15deg);
            top: 1002px;
            left: 413px;
            .imgbox{
                width: 100%;
                height: 185px;
                position: relative;
                overflow: hidden;
            }
        }
    }
}

</style>
