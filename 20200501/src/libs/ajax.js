/**
 * Created by zhukf on 2017/7/11.
 */
import axios from 'axios';
import cnf from '../../config/config';

export default {
    install: function(Vue, options ){

        /**
         * ajax操作、只允许使用post , 使用了项目中的配置作为默认配置
         * @param url : 例 /api.v2.do.model.action
         * @param data: 可以是json对象的一个字符串
         * @param cb_func: 成功请求后的回调函数， 需要带一个返回值参数 res , res.data为远程请求的返回数据 其它可以打印res查看
         * @param cb_errFunc: 远程请求失败的回调函数， 需要带一个err参数接收失败信息
         */
        Vue.prototype.ipost = function(url, data, cb_sucFunc, cb_errFunc ) {
            axios.post(cnf.apiDomain + url, data).then(cb_sucFunc).catch(cb_errFunc);
        }

        /**
        Vue.prototype.iposti = function *(url, data ) {
            yield axios.post(cnf.apiDomain + url, data, cnf.ajaxConf)
                .then(
                    function (res ) {
                        //arguments.callee.next(res )
                        Vue.iposti.next(res )
                    }
                )
                .catch(
                    function (err ) {
                        //arguments.callee.next(err )
                        Vue.iposti.next(err )
                    }

                );
        }*/

        /**
         * 使用axios 原生态的ajax请求
         * @type {AxiosStatic}
         */
        Vue.prototype.$http = function(url, data) {
            return axios.post(cnf.apiDomain + url, data)
        }
    }
}