import Env from './env';

let config = {
    env: Env,
    apiDomain: 'http://' + location.hostname + ':8888',  //默认指向开发环境下的端口号 、发布前请修改成生产环境端口号
};
export default config;