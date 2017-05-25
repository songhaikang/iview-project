<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Form-item label="姓名" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
        </Form-item>
        <Form-item label="邮箱" prop="email">
            <Input v-model="formValidate.email" placeholder="请输入邮箱"></Input>
        </Form-item>
        <Form-item label="用户状态" prop="status">
            <Select v-model="formValidate.status" placeholder="请选择用户状态">
                <Option value="NORMAL">正常</Option>
                <Option value="UN_ACTIVATE">未激活</Option>
                <Option value="FORBIDDEN">禁用</Option>
            </Select>
        </Form-item>

        <Form-item label="性别" prop="gender">
            <Radio-group v-model="formValidate.gender">
                <Radio label="MALE">男</Radio>
                <Radio label="FEMALE">女</Radio>
            </Radio-group>
        </Form-item>
        <Form-item label="爱好" prop="interestArray">
            <Checkbox-group v-model="formValidate.interestArray">
                <Checkbox label="吃饭">爱吃饭</Checkbox>
                <Checkbox label="睡觉"></Checkbox>
                <Checkbox label="跑步"></Checkbox>
                <Checkbox label="看电影"></Checkbox>
            </Checkbox-group>
        </Form-item>
        <Form-item label="介绍" prop="description">
            <Input v-model="formValidate.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
        </Form-item>

        <Form-item>
            <Button type="primary" @click="initFormData()">初始化数据</Button>
            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </Form-item>
    </Form>
</template>

<script>
    export default {
        data () {
            return {
                formValidate: {
                    name: '宋海康',
                    email: '',
                    status: '',
                    gender: '',
                    interestArray: [],
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
                        {type: 'string', min: 20, message: '介绍不能少于20字', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            initFormData(){
                this.$http.post(
                    "/cep-svc/user/queryById.do",
                    {"id": "1"},
                    {emulateJSON: true}
                ).then(
                    function (res) {
                        // 处理成功的结果
//                        alert(JSON.stringify(res));
                        this.formValidate = res.body.data;
                    }, function (res) {
                        // 处理失败的结果
                        alert(JSON.stringify(res));
                    }
                );

            },
            handleSubmit (name) {
                alert(JSON.stringify(this.formValidate));
                var self = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {//如果验证通过
                        this.$http.post(
                            "/cep-svc/user/update.do",
                            self.formValidate,
                            {emulateJSON: true}
                        ).then(
                            function (res) {// 处理成功的结果
                                alert(JSON.stringify(res));
                                var result = JSON.parse(res.bodyText);
                                if (result.code == "1") {
                                    this.$Message.success('提交成功!');
                                } else {
                                    this.$Message.success('提交出错!');
                                }
                            }, function (res) {// 处理失败的结果
                                alert(JSON.stringify(res));
                            }
                        );


                    } else {
//                        debugger;
//                        var formData = this.$refs[name].serialize;
//                        alert(formData);
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>
