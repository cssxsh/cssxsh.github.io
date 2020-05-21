"use strict";

Ext.define("EduApp.view.Phone.from.Factor", {
    "extend": "Ext.form.Panel",
    "title": "测试因子输入",
    "xtype": "factorFrom",
    "controller": "FactorInput",
    "layout": "fit",
    "items": [
        {
            "xtype": "textareafield",
            "inputId": "factortext",
            "width": "100%",
            "allowBlank": false,
            "validator": "validator"
        }
    ]
});
Ext.define("EduApp.view.Phone.grid.Array", {
    "extend": "Ext.grid.Panel",
    "xtype": "arrayGrid",
    "title": "正交表",
    "plugins": {
        "ptype": "cellediting",
        "clicksToEdit": 1
    },
    "sortableColumns": false,
    "viewConfig": {
        // 列分割线
        "columnLines": true,
        // 斑马纹
        "stripeRows": true,
        // 自适应
        "forceFit": true
    },
    "autoDestroy": true
});
Ext.define("EduApp.view.Phone.grid.Cases", {
    "extend": "Ext.grid.Panel",
    "xtype": "casesGrid",
    "title": "测试用例",
    "sortableColumns": false,
    "viewConfig": {
        // 列分割线
        "columnLines": true,
        // 斑马纹
        "stripeRows": true,
        // 自适应
        "forceFit": true
    },
    "autoDestroy": true,
    "flex": 1
});
Ext.define("EduApp.view.Phone.panel.MainPanel", {
    "extend": "Ext.panel.Panel",
    "xtype": "appPanel-touch",
    "controller": "Main",
    "autoRender": true,
    "layout": {
        "type": "vbox",
        "align": "stretch",
        "pack": "start"
    },
    "items": [
        {
            "flex": 1,
            "xtype": "factorFrom"
        },
        {
            "flex": 1,
            "xtype": "arrayGrid"
        },
        {
            "flex": 1,
            "xtype": "casesGrid"
        }
    ],
    "tbar": [
        {
            "xtype": "button",
            "text": "导入工作",
            "tooltip": "从上传的文件中导入工作",
            "handler": "inputFileToExecl",
            "scale": "large"
        },
        {
            "xtype": "button",
            "text": "保存工作",
            "tooltip": "保存工作到本地文件",
            "handler": "outputFileToExecl",
            "scale": "large"
        },
        {
            "xtype": "button",
            "text": "生成用例",
            "tooltip": "尝试计算输入对应的测试用例",
            "handler": "genCases",
            "scale": "large"
        },
        {
            "xtype": "button",
            "text": "检查正交",
            "tooltip": "检查正交表的正确性",
            "handler": "checkOAarry",
            "scale": "large"
        }
    ]
});
