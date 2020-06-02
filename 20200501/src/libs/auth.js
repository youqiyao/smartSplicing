import storage from './helpers/storageLite'
const MANAGER = 'manager'
const TOKEN = 'token'

export default {
    name: 'auth',

    /**
     * 获取 auth，返回：管理员信息和 token
     * @return {Object}
     */
    get () {
        return {
            [MANAGER]: storage.get(MANAGER),
            [TOKEN]: storage.get(TOKEN)
        }
    },

    /**
     * 获取当前登录用户的Uid
     *
     * 有待实现
     */
    getuid() {
        return storage.get('ID')
    },


    /**
     * 登录
     * @param {string} manager 登录管理员
     * @param {string} token 登录 token
     */
    login ({manager, token, id}) {
        storage.set(MANAGER, manager)
        storage.set(TOKEN, token)
        storage.set('ID', id )
    },

    /**
     * 登出
     */
    logout () {
        storage.remove('ID')
        storage.remove(MANAGER)
        storage.remove(TOKEN)
    },

    /**
     * 是否已登录
     * @return {boolean}
     */
    loggedIn () {
        //此处判断不完整、 全局还需要做一个远程Token比较
        return !!storage.get(MANAGER) && !!storage.get(TOKEN)
    }
}