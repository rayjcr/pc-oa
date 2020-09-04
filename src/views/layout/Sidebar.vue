<template>
    <div class="sidebar-container-view">
      <router-link :to="'/dashboard'" class="sider-index">
          <icon-svg icon-class="setting"></icon-svg>
          <span>首页</span>
      </router-link>
      <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse">
        <sidebar-item :routes='changepermissionMenus'></sidebar-item>
      </el-menu>
    </div>
</template>


<script>
  import { mapGetters } from 'vuex';
  import SidebarItem from './SidebarItem';
  export default {
    components: { SidebarItem },
    data(){
        return{
            changepermissionMenus:[],

        }
    },
    mounted() {
    },

    computed: {
      ...mapGetters([
        'sidebar',
        'sidebarcurMenuId',
        'sidebarcurMenu',
        'permissionMenus'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      }
    },
    created() {
        this.menuChange()
    },
    watch:{
      sidebar(){
        // console.log(this.sidebar)
      },
      sidebarcurMenuId(){
        this.menuChange()
      },
    },
    methods: {
      menuChange(){
        var that = this
        // if(this.sidebarcurMenu=='dashboard'){          //首页
        //   this.changepermissionMenus = []
        // }else{
          // console.log(this.permissionMenus,5566)

          if(this.permissionMenus){
            this.permissionMenus.forEach(function(item,index){
              if(item.id==that.sidebarcurMenuId){
                that.changepermissionMenus = item.children
                that.$store.dispatch('SetCurMenu',item.code)
              }
            })
          }else{
            this.$notify({type: 'error',message: '初始化用户菜单出错,请联系管理员',duration: 4000});  
          }
        // }
      },
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scope>
    *{
      outline:none;
    }
    .sider-index{ 
      display:block;
      height: 56px; 
      line-height: 56px;
      padding: 0 20px;
      color:#b4b6bd;
    }
    .sider-index:focus,.sider-index:hover{
      background-color: #2e3344 !important;
      color:#FFF !important;
      
    }
    .sidebar-container-view .el-menu{
      background:#3a3f51 !important;
    }
    .el-submenu .el-menu{
			background:#2e3344 !important;
		}
    .el-menu{
      border: none !important;
			background:#eef1f6 !important;
		}
    .el-submenu .el-menu-item:hover, .el-submenu__title:hover {
      background-color: #2e3344 !important;
      color: #FFF !important;
    }
    .is-opened>.el-submenu__title,.is-opened>.el-menu-item{
      background: #343848 !important;
    }
    .el-submenu__title,.el-menu-item{
			color:#b4b6bd !important;
		}
    .el-menu-item:focus, .el-menu-item:hover, .el-submenu__title:hover{
      background:#2e3344 !important;
      color: #FFF !important;
    }
    .router-link-active .el-menu-item{
      color:#FFF !important;
    }
    .router-link-active>li{
      // background: #343848;
      text-align: center !important;
      color: #606266 !important;
    }
    
    

</style>
