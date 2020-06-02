<style lang="less" src="./styles/users.less"></style>
<template>
    <div class="users">
        <el-row>
            <el-col :span="24">
                <div class="title"><span>{{$t('用户设置')}}</span></div>
            </el-col>
        </el-row>
        <div class="userscontainer">
            <div>
                <el-menu :default-active="$route.path" theme="light" mode="vertical" router>
                <el-menu-item index="/users" ><i class="fa fa-user mar-rig"></i>{{$t('用户管理')}}</el-menu-item>
                <el-menu-item index="/rolemanage" ><i class="fa fa-user-secret mar-rig"></i>{{$t('角色管理')}}</el-menu-item>
                <el-menu-item index="/logosetting" ><i class="fa fa-superpowers mar-rig"></i>{{$t('Logo设置')}}</el-menu-item>
                </el-menu>
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'users',
    }
</script>