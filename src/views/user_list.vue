<template>
    <div>
        <Form ref="queryParam" :model="queryParam" :label-width="80">
            <Form-item label="姓名" prop="name">
                <Input v-model="queryParam.name" placeholder="请输入姓名" style="width:200px"></Input>
            </Form-item>
            <Form-item>
                <Button type="primary" @click="queryListData()">查询</Button>
            </Form-item>
        </Form>
        <Table border :columns="columns" :data="dataRows"></Table>
        <br/>
        <br/>
        <Modal
                v-model="editShow"
                title="对话框标题">
            <UserEdit ref="childUser"></UserEdit>
        </Modal>

    </div>
</template>

<script>

    import UserEdit from './user_edit.vue';
    export default {
        components: {UserEdit},
        data () {
            return {
                editShow: false,
                queryParam: {
                    name: 'sky',
                    desc: ''
                },
                columns: [
                    {
                        title: '姓名',
                        key: 'name',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'person'
                                    }
                                }),
                                h('strong', params.row.name)
                            ]);
                        }
                    },
                    {
                        title: '年龄',
                        key: 'age'
                    },
                    {
                        title: '地址',
                        key: 'address'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 250,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.update(params.index)
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                dataRows: [
                    {
                        name: '王小明',
                        age: 18,
                        address: '北京市朝阳区芍药居'
                    },
                    {
                        name: '张小刚',
                        age: 25,
                        address: '北京市海淀区西二旗'
                    },
                    {
                        name: '李小红',
                        age: 30,
                        address: '上海市浦东新区世纪大道'
                    },
                    {
                        name: '周小伟',
                        age: 26,
                        address: '深圳市南山区深南大道'
                    }
                ]
            }
        },
        methods: {
            queryListData(){
                var self = this;
//                this.$http.get("/src/data/user_list.json").then(
                this.$http.post(
                    "/cep-svc/user/query.do",
                    self.queryParam,
                    {emulateJSON: true}
                ).then(
                    function (res) {
                        // 处理成功的结果
//                        alert(JSON.stringify(res.bodyText));
                        var users = JSON.parse(res.bodyText);
                        self.dataRows = users.data.dataRows;
                    }, function (res) {
                        // 处理失败的结果
                        alert(JSON.stringify(res));
                    }
                );

            },
            update (index) {
                this.editShow = true;
                this.$refs.childUser.initFormData(this.dataRows[index].id); //通过索引调用子组件的fromParent方法
//                this.$emit('initFormData', '');//子组件调用父组件
            },
            show (index) {
                this.$Modal.info({
                    title: '用户信息',
                    content: `姓名：${this.dataRows[index].name}<br>年龄：${this.dataRows[index].age}<br>地址：${this.dataRows[index].address}`
                })
            },
            remove (index) {
                this.dataRows.splice(index, 1);
            }
        }
    }
</script>
