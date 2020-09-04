<template>
	<el-container style=" height:100%;">
		<el-header class="l-header">
			<Headerbar></Headerbar>
		</el-header>
		<el-container class='app-wrapper' :class="{hideSidebar:!sidebar.opened}">
			<sidebar class="sidebar-container"></sidebar>
			<el-main>
				<div class="main-container">
					<navbar></navbar>
					<!-- <NavbarMin></NavbarMin> -->
					<app-main></app-main>
				</div>
			</el-main>
		</el-container>
</el-container>

	<!--<div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
		<sidebar class="sidebar-container"></sidebar>
		<div class="main-container">
			<navbar></navbar>
			<app-main></app-main>
		</div>
	</div>-->
</template>

<script>
  import {Navbar, Sidebar, AppMain ,Headerbar} from 'views/layout';
//   import NavbarMin from './NavbarMin';

  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      AppMain,
	  Headerbar,
	//   NavbarMin
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar;
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/mixin.scss";
	.el-header{
		padding: 0;
	}
	.l-header{
		background:#FFFFFF;
		height:60px;
		width: 100%;
		min-width: 980px;
		box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12);
		z-index: 1002;
		position: fixed;
		top: 0;
		left: 0;
	}
	.app-wrapper {
		@include clearfix;
		position: relative;
		padding-top:60px;
		&.hideSidebar {
			.sidebar-container{
				width:36px;
			}
			.main-container {
				margin-left: 36px;
			}
		}
		.sidebar-container {
			transition: width 0.28s ease-out;
			width: 210px;
			position: absolute;
			top: 60px;
			bottom: 0;
			left: 0;
			z-index: 1001;
			overflow-y: auto;
			background:#3a3f51;
 			&::-webkit-scrollbar {display:none}
		}
		.main-container {
			flex: 1;
			flex-basis: auto;
			min-height: 100%;
			transition: margin-left 0.28s ease-out;
			margin-left: 210px;
			background: #ebedf1;
			overflow: hidden;
		}
		.el-main{
			padding:0;
		}
	}

</style>

