<template>
    <Form ref="editForm" :model="formParam" :rules="ruleValidate" :label-width="80">
        <Form-item label="姓名" prop="name">
            <Input v-model="formParam.name" placeholder="请输入姓名"></Input>
        </Form-item>
        <Form-item label="邮箱" prop="email">
            <Input v-model="formParam.email" placeholder="请输入邮箱"></Input>
        </Form-item>
        <Form-item label="用户状态" prop="status">
            <Select v-model="formParam.status" placeholder="请选择用户状态">
                <Option value="NORMAL">正常</Option>
                <Option value="UN_ACTIVATE">未激活</Option>
                <Option value="FORBIDDEN">禁用</Option>
            </Select>
        </Form-item>

        <Form-item label="性别" prop="gender">
            <Radio-group v-model="formParam.gender">
                <Radio label="MALE">男</Radio>
                <Radio label="FEMALE">女</Radio>
            </Radio-group>
        </Form-item>
        <Form-item label="介绍" prop="description">
            <Input v-model="formParam.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
        </Form-item>
    </Form>
</template>

<script>
    export default {
        data () {
            return {
                formParam: {
                    name: '',
                    email: '',
                    status: '',
                    gender: '',
                    description: ''
                },
                ruleValidate: {
                    name: [
                        {required: true, message: '姓名不能为空', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '邮箱不能为空', trigger: 'blur'},
                        {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
                    ],
                    status: [
                        {required: true, message: '请选择用户状态', trigger: 'change'}
                    ],
                    gender: [
                        {required: true, message: '请选择性别', trigger: 'change'}
                    ],
                    interestArray: [
                        {required: true, type: 'array', min: 1, message: '至少选择一个爱好', trigger: 'change'},
                        {type: 'array', max: 2, message: '最多选择两个爱好', trigger: 'change'}
                    ],
                    description: [
                        {required: true, message: '请输入个人介绍', trigger: 'blur'},
                        {type: 'string', min: 5, message: '介绍不能少于5字', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            initFormData(id){
                this.resetForm();
                this.$http.post(
                    "/cep-svc/user/queryById.do",
                    {"id": id},
                    {emulateJSON: true}
                ).then(
                    function (res) {
                        this.formParam = res.body.data;
                    }, function (res) {
                        this.$Message.success('请求服务器出错!');
                    }
                );

            },
            submitValidate () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.submitForm();
                    } else {
                        this.$emit('saveFailed');
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            submitForm () {
                this.$http.post(
                    "/cep-svc/user/save.do",
                    this.formParam,
                    {emulateJSON: true}
                ).then(
                    function (res) {
                        var result = JSON.parse(res.bodyText);
                        if (result.code == "1") {
                            this.$Message.success('提交成功!');
                            this.$emit("saveSuccess");
                        } else {
                            this.$Message.success('提交出错!');
                            this.$emit("saveFailed");
                        }
                    }, function (res) {
                        this.$Message.success('请求服务器出错!');
                        this.$emit("saveFailed");
                    }
                );
            },
            resetForm () {
                this.$refs.editForm.resetFields();
            }
        }
    }
</script>
