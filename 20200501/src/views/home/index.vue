<style lang="less" src="./styles/index.less"></style>
<template>
    <div class="main">
        <LayoutHeader ref="header" activeitem="home"/>

      <div class="cont1">

      <Home ref="home_main"/>
      </div>
    </div>
</template>
<script>
    import LayoutHeader from '../../components/header'
    import Home from './home'

    export default {
        components: {
            LayoutHeader, Home
        }
    }
</script>
<style type="text/css" >
			*{
				padding: 0 ;
				margin: 0;
			}
			.headercont{
				transition: all 0.2s;
				width: 55px;
				height: 100vh;
				background: #222d32;
				float: left;
			}
			.cont1{
				transition: all 0.2s;
                width: calc(100% - 55px);
                background: #ccc;
                float: left!important;
                height: 100vh;
			}
			.el-button+.el-button{
			margin-left: 1px!important;	}
			.list{
				width: 100%;
				color: #ccc;
			}
			.list img{
				width: 20px;
				height: 20px;
			}
			.list li{
				height: 45px;
				position: relative;
			}
			.active4{
				cursor: pointer;
			}
			.il{
				position: absolute;
				transition: all 0.2s;
				left: 17px;
				top: 15px;
				color: #fff;
			}
			.active{
				position: absolute;
				transition: all 0.2s;
				left: 0;
			}
			.dialoglist{
				cursor: pointer;
				display: none;
				position: absolute;
				left: 53px;
				top: 0;
				width: 120px;
				height: 45px;
				line-height: 45px;
				text-align: center;
				background: #7e7e7e!important;
				z-index: 22;
			}
			

			.el-tree-node__content{
				color: #ccc;
				background: none;
			}
			.el-tree-node__content:hover{
				color: #000!important;
				/* background: green!important; */
			}
			.signaltable .el-table th .el-table tr{
				background: red!important;
			}
			.active4:hover{
				border-left: 2px red solid;
				background: #7e7e7e!important;
			}
			.active4:hover .dialoglist{
				display: block;
			}
			.hah{
				position: absolute;
				left: 20px;
			}
			.active4 .el-button{
				background: #222d32;
				color: #fff;
				border: none;
			}
			.active4 .el-button:hover{
				background: #1e282c;
				color: #fff;
				border: none;
			}
			.theme-c .home .hometools .hometool-menu .el-tabs .el-tabs__header{
				position: absolute;
				bottom: 18px;
			}
			.ctrbtn{
				position: absolute;
				top: 2px;
				left: 0;
				/*width: 800px;*/
				height: 57px;
				z-index: 12;

			}
			.ctrbtn .starting
			{
				background: url("../../assets/img/81.png") no-repeat!important;
				width: 42px!important;
				height: 42px!important;
				background-size: contain!important;
				border: none!important;
			}
			.ctrbtn .starting:hover
			{
				background: url("../../assets/img/1.png") no-repeat!important;
				width: 42px!important;
				height: 42px!important;
				background-size: contain!important;
				border: none!important;
			}
			.ctrbtn>el-button{
				font-size: 14px
			}
			.el-tabs__nav{
				display: inline-block;
				float:  none !important;

			}
			.is-active{
				background-color: #414840!important;
			}
			.theme-c .el-tabs__item.is-active, .theme-c li.el-menu-item.is-active{
				color: #fff;
			}
			.el-tabs--border-card,.homemain-container,.el-tree,.el-input__inner{
				background: #0c1719!important;
				color: #fff!important;
				border: none!important;
			}
			.el-tabs--border-card>.el-tabs__header{
				background: #0c1719!important;
				border: none!important;
			}
			.el-tabs__nav-scroll{
				text-align: center;
			}
			.el-table__empty-block{
				background-color: #222D31!important
			}
			.el-table--border:after, .el-table--group:after, .el-table:before{
				background: none!important;
			}
			.ctrbtn button{
				padding:13px
			}
			.el-button-group{
				margin-left: -21px;
				margin-top: -5px;
			}



			.ctrbtn .close
			{
				background: url("../../assets/img/82.png") no-repeat!important;
				width: 42px!important;
				height: 42px;
				background-size: contain!important;
				border: none!important;
				margin-left: -4px!important;
			}
			.ctrbtn .close:hover
			{
				background: url("../../assets/img/2.png") no-repeat!important;
				width: 42px!important;
				height: 42px!important;
				background-size: contain!important;
				border: none!important;
			}
			.ctrbtn .save1
			{				margin-left: -4px!important;

				background: url("../../assets/img/83.png") no-repeat!important;
				width: 42px!important;
				height: 42px!important;
				background-size: contain!important;
				border: none!important;
			}
			.ctrbtn .save1:hover
			{
				background: url("../../assets/img/3.png") no-repeat!important;
				width: 42px!important;
				height: 42px!important;
				background-size: contain!important;
				border: none!important;
			}

			 .save2
			{
				background: url("../../assets/img/84.png") no-repeat !important;
				width: 42px !important;
				height: 42px !important;
				background-size:contain!important;
				border: none!important;
			}
			 .save2:hover
			{
				background: url("../../assets/img/4.png") no-repeat !important;
				width: 42px !important;
				height: 42px !important;
				background-size: 100% !important;
				border: none !important;
			}
			 .save3
			{
				background: url("../../assets/img/85.png") no-repeat !important;
				width: 42px !important;
				height: 42px !important;
				margin-left: 16px!important;
				background-size:contain!important;
				border: none!important;
			}
			 .save3:hover
			{
				background: url("../../assets/img/5.png") no-repeat !important;
				width: 42px !important;
				height: 42px !important;
				background-size: contain!important;
				border: none !important;
			}
			.ctrbtn .save7
			{
				background: url("../../assets/img/87.png") no-repeat !important;
				width: 42px !important;
				height: 42px !important;
				background-size: contain !important;
				border: none !important;
			}
			.ctrbtn .save7:hover
			{
				background: url("../../assets/img/7.png") no-repeat !important;
				width: 42px !important;
				height: 42px !important;
				background-size: contain !important;
				border: none !important;
			}
			.save6
			{
				background: url("../../assets/img/86.png") no-repeat !important;
				width: 42px !important;
				height: 42px !important;
				background-size: contain!important;
				border: none !important;
			}
			.save6:hover
			{
				background: url("../../assets/img/6.png") no-repeat !important;
				width: 42px !important;
				height: 42px !important;
				background-size: contain!important;
				border: none !important;
			}
		</style>
