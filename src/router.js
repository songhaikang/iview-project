const routers = [
    {
        path: '/cep-manage/',
        meta: {
            title: '主页'
        },
        component: (resolve) => require(['./views/index.vue'], resolve)
    },{
        path: '/cep-manager/home/:username',
        meta: {
            title: '首页'
        },
        component: (resolve) => require(['./views/home.vue'], resolve)
    },{
        path: '/cep-manager/user_list',
        meta: {
            title: '用户信息列表'
        },
        component: (resolve) => require(['./views/user_list.vue'], resolve)
    },{
        path: '/cep-manager/user_edit',
        meta: {
            title: '用户信息编辑'
        },
        component: (resolve) => require(['./views/user_edit.vue'], resolve)
    }
];
export default routers;