"use strict";
Ext.define("EduApp.from.Factor", {
    extend: "Ext.form.Panel",
    title: "测试因子输入",
    xtype: "factorFrom",
    layout: "fit",
    items: [{
        xtype: "textareafield",
        inputId: "factortext",
        width: "100%",
        allowBlank: false,
        validator: function (value) {
            let regex = /^[^:：]+(:|：)[^:：,，]+((,|，)\s*[^:：,，]+)*$/;
            let errorText = true;
            let lines = value.split("\n");
            lines.forEach((line, index) => {
                if (line != "" && (!regex.exec(line))) {
                    errorText += "," + (index + 1);
                }
            });
            if (errorText !== true) {
                errorText = errorText.slice(5);
                errorText = "输入项第" + errorText + "行不匹配";
            }
            return errorText;
        }
    }]
});
Ext.define("EduApp.grid.Array", {
    extend: "Ext.grid.Panel",
    xtype: "arrayGrid",
    title: "正交表",
    plugins: {
        ptype: "cellediting",
        clicksToEdit: 1
    },
    sortableColumns: false,
    viewConfig: {
        // markDirty: false,            // 
        columnLines: true,          // 列分割线
        stripeRows: true,
        forceFit: true,             // 自适应
    },
    autoDestroy: true
});
Ext.define("EduApp.grid.Cases", {
    extend: "Ext.grid.Panel",
    xtype: "casesGrid",
    title: "测试用例",
    sortableColumns: false,
    viewConfig: {
        // markDirty: false,            // 
        columnLines: true,          // 列分割线
        stripeRows: true,
        forceFit: true             // 自适应
    },
    autoDestroy: true,
    flex: 1
});
Ext.define("EduApp.panel.MainPanel", {
    extend: "Ext.panel.Panel",
    xtype: "appPanel",
    controller: "Main",
    layout: {
        type: "vbox",
        align: "stretch",
        pack: "start",
    },
    items: [{
        flex: 1,
        xtype: "factorFrom",
    }, {
        flex: 1,
        xtype: "arrayGrid",
    }, {
        flex: 1,
        xtype: "casesGrid",
    }],
    tbar: [{
        xtype: "button",
        text: "导入工作",
        tooltip: "从上传的文件中导入工作",
        handler: "inputFileToExecl"
    }, {
        xtype: "button",
        text: "保存工作",
        tooltip: "保存工作到本地文件",
        handler: "outputFileToExecl"
    }, {
        xtype: "button",
        text: "生成用例",
        tooltip: "尝试计算输入对应的测试用例",
        handler: "genCases"
    }, {
        xtype: "button",
        text: "检查正交",
        tooltip: "检查正交表的正确性",
        handler: "checkOAarry"
    }]
});

Ext.define("EduApp.window.Window", {
    extend: "Ext.window.Window",
    xtype: "appWindow",
    height: 600,
    width: 500,
    padding: 2,
    layout: "fit",
    draggable: true,
    resizable: false,
    plain: false,
    closable: false,
    autoShow: true,
    items: [{
        xtype: "appPanel"
    }]
});
