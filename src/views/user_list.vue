<template>
    <div>
        <Form ref="queryForm" :model="queryParam" :label-width="80">
            <Form-item label="姓名" prop="name">
                <Input v-model="queryParam.name" placeholder="请输入姓名" style="width:200px"></Input>
            </Form-item>
            <Form-item>
                <Button type="primary" icon="ios-search" @click="loadQueryData()">搜索</Button>
                <Button type="ghost" icon="refresh" @click="resetQueryForm()" style="margin-left: 8px">重置</Button>
                <Button type="success" icon="compose" @click="toAdd()" style="float:right;margin-right: 30px">新增</Button>
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

    import util from '../libs/util.js';
    import cloudList from '../libs/cloud-list.js';

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
                                            cloudList.toUpdate("editFormShow", "editForm", this.dataRows[params.index].id, this)
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
                                            cloudList.remove("/cep-svc/user/delete.do", {"id": this.dataRows[params.index].id}, params.index, "dataRows", this);
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
                cloudList.loadQueryData("/cep-svc/user/query.do", this.queryParam, "dataRows", this);
            },
            resetQueryForm () {
                cloudList.resetQueryForm('queryForm', this);
            },
            toAdd () {
                cloudList.toAdd("editForm", "editFormShow", this);
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
            }
        }
    }
</script>
