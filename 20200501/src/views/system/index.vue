<template>
    <div style="height: 100vh">
        <LayoutHeader activeitem="system"/>

        <div class="cont">
        <System /></div>
    </div>
</template>
<script>
    import LayoutHeader from '../../components/header'
    import System from './system'

    export default {
        components: {
            LayoutHeader, System
        }
    }
</script>

<style type="text/css">
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
			.cont{
				transition: all 0.2s;
				width: calc(100% - 75px);
				background: #ccc;
				float: right;
				height: 100vh;
			}
			.bg-w{
				background: #2c3e50!important;
			}
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
				background: #1e282c;
				z-index: 22;
			}
			.active4:hover{
				border-left: 2px red solid;
				background: #1e282c;
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
			.el-tree-node__content:hover{
				color: #fbf7fb;
				background: #9f9f9f!important;
			}
			.tianchong{
				width: 100%;
				height: 15px;
				background: #e6e6fa;
			}
			/*.systemaside>.el-button:nth-child(1){
				background-color: #2c3e50;
				color:#fff;
				margin-left: 13px;
			}
			.tabletools>.table-btn:nth-child(2){
				background-color: #18bc9c;
				color:#fff;
			}
			.tabletools>.table-btn:nth-child(3){
				background-color: #18bc9c;
				color:#fff;
			}
			.tabletools>.table-btn:nth-child(4){
				background-color: #e74c3c;
				color:#fff;
			}
			.tabletools>.table-btn:nth-child(5){
				background-color: #76818d;
				color:#fff;
			}
			.tabletools>.table-btn:nth-child(6){
				background-color: #76818d;
				color:#fff;
			}*/
			.el-table td, .el-table th
			{
				padding: 5px 0!important;
			}
			.el-button--small, .el-button--small.is-round{
				padding: 8px !important;
			}
		</style>
