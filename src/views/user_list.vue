<template>
    <div>
        <Form ref="queryForm" :model="queryParam" :label-width="80">
            <Form-item label="姓名" prop="name">
                <Input v-model="queryParam.name" placeholder="请输入姓名" style="width:200px"></Input>
            </Form-item>
            <Form-item>
                <Button type="primary" icon="ios-search" @click="loadQueryData()">搜索</Button>
                <Button type="ghost" icon="refresh" @click="resetQueryForm()" style="margin-left: 8px">重置</Button>
                <Button type="success" icon="compose" @click="toAdd('queryForm')" style="float:right;margin-right: 30px">新增</Button>
            </Form-item>
        </Form>
        <Table border :columns="columns" :data="dataRows"></Table>
        <br/>
        <br/>
        <Modal
                v-model="editFormShow"
                title="用户信息维护"
                okText="保存"
                :mask-closable="false"
                :loading="loading"
                @on-ok="save()">
            <EditFormTag @saveFailed="saveFailed" @saveSuccess="saveSuccess" ref="editForm"></EditFormTag>
        </Modal>

    </div>
</template>

<script>
    import EditFormTag from './user_edit.vue';
    export default {
        components: {EditFormTag},
        data () {
            return {
                editFormShow: false,
                loading: true,
                queryParam: {
                    name: '',
                    desc: ''
                },
                columns: [
                    {
                        title: '姓名',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '邮箱',
                        key: 'email',
                        align: 'center'
                    },
                    {
                        title: '介绍',
                        key: 'description',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 250,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.toUpdate(params.index)
                                        }
                                    }
                                }, '修改'),
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
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    }
                                }, '查看')
                            ]);
                        }
                    }
                ],
                dataRows: []
            }
        },
        created: function () {
            this.loadQueryData();
        },
        methods: {
            loadQueryData(){
                this.$http.post(
                    "/cep-svc/user/query.do",
                    this.queryParam,
                    {emulateJSON: true}
                ).then(
                    function (res) {
                        this.dataRows = JSON.parse(res.bodyText).data.dataRows;
                    }, function (res) {
                        this.$Message.success('请求服务器出错!');
                    }
                );
            },
            resetQueryForm () {
                this.$refs.queryForm.resetFields();
                this.loadQueryData();
            },
            toUpdate (index) {
                this.editFormShow = true;
                this.$refs.editForm.initFormData(this.dataRows[index].id);
            },
            toAdd () {
                this.$refs.editForm.resetForm();
                this.editFormShow = true;
            },
            save () {
                this.$refs.editForm.submitValidate();
            },
            saveFailed () {
                this.loading = false;
            },
            saveSuccess () {
                this.editFormShow = false;
                this.loading = true;
                this.loadQueryData();
            },
            show (index) {
                this.$Modal.info({
                    title: '用户信息',
                    content: `姓名：${this.dataRows[index].name}<br>邮箱：${this.dataRows[index].email}<br>简介：${this.dataRows[index].description}`
                })
            },
            remove (index) {
                this.$http.post(
                    "/cep-svc/user/delete.do",
                    {"id": this.dataRows[index].id},
                    {emulateJSON: true}
                ).then(
                    function (res) {
                        var result = JSON.parse(res.bodyText);
                        if (result.code == "1") {
                            this.dataRows.splice(index, 1);
                        } else {
                            this.$Message.success('删除出错!');
                        }
                    }, function (res) {
                        this.$Message.success('请求服务器出错!');
                    }
                );
            }
        }
    }
</script>
