let cloudList = {};


cloudList.loadQueryData = function (url, param, dataRows, self) {
    self.$http.post(
        url,
        param,
        {emulateJSON: true}
    ).then(
        function (res) {
            self[dataRows] = JSON.parse(res.bodyText).data.dataRows;
        }, function (res) {
            self.$Message.success('请求服务器出错!');
        }
    );
};


cloudList.remove = function (url, param, index, dataRows, self) {
    self.$http.post(
        url,
        param,
        {emulateJSON: true}
    ).then(
        function (res) {
            var result = JSON.parse(res.bodyText);
            if (result.code == "1") {
                self[dataRows].splice(index, 1);
            } else {
                self.$Message.success('删除出错!');
            }
        }, function (res) {
            self.$Message.success('请求服务器出错!');
        }
    );
};


cloudList.resetQueryForm = function (queryForm, self) {
    self.$refs[queryForm].resetFields();
    self.loadQueryData();
};

cloudList.toUpdate = function (editFormShow, editForm, id, self) {
    self[editFormShow] = true;
    self.$refs[editForm].initFormData(id);
};

cloudList.toAdd = function (editForm, editFormShow, self) {
    self.$refs[editForm].resetForm();
    self[editFormShow] = true;
};


export default cloudList;