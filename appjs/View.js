'use strict';
Ext.define('Edu.app.From.Factor', {
    extend: 'Ext.form.Panel',
    title: '测试因子输入',
    xtype: 'factorFrom',
    region: 'north',
    width: '100%',
    minHight: '35%',
    tools: [{
        type: 'search',
        handler: function (event, target, owner, tool) {
            // console.log("Input by button");
        }
    }, {
        type: 'save',
        handler: function (event, target, owner, tool) {
            let from = owner.up();
            let factors = from.GetFactors();
            let array = Edu.app.GetArray(factors);
            if (array === undefined) {
                Ext.Msg.alert('错误', '未找到对应的正交表');
            } else {
                Edu.app.SetTable(factors, array, owner.up('[xtype=appPanle]'));
            }
        }
    }],
    items: [{
        xtype: 'textareafield',
        inputId: 'factortext',
        width: '100%',
        allowBlank: false,
        validator: function (value) {
            let regex = /^[^:：]+(:|：)[^:：,，]+((,|，)\s*[^:：,，]+)*$/;
            let errorText = true;
            let lines = value.split('\n');
            lines.forEach((line, index) => {
                if (!regex.exec(line)) {
                    errorText += "," + (index + 1);
                }
            });
            if (errorText !== true) {
                errorText = errorText.slice(5);
                errorText = "输入项第" + errorText + "行不匹配";
            }
            return errorText;
        }
    }],
    GetFactors: function () {
        let textarea = this.down('[inputId=factortext]');
        if (textarea.getErrors().length !== 0) {
            return false;
        }
        let value = textarea.getValue();
        let lines = value.split('\n');
        let hashmap = {};
        let reg_1 = /:|：/;
        let reg_2 = /,|，/;
        lines.forEach((line) => {
            let arr = line.split(reg_1);
            let factors = arr[0].split(reg_2);
            let levels = arr[1].split(reg_2);
            factors.forEach((f) => {
                hashmap[f] = levels;
            });
        });
        return hashmap;
    }
});
Ext.define('Edu.app.Grid.Array', {
    extend: 'Ext.grid.Panel',
    xtype: 'arraygrid',
    title: '正交表',
    region: 'center',
    border: 'true',
    stripeRows: true,
    split: true,
    autoDestroy: true,
    width: '100%',
    minHight: '35%',
    SetData: function (keys, array) {
        let store = Ext.create('Edu.app.OrthogonalArray', {
            fields: keys,
            data: array
        });
        this.reconfigure(store, keys.map((key) => {
            return { header: key, dataIndex: key };
        }));
    }
});
Ext.define('Edu.app.Grid.Cases', {
    extend: 'Ext.grid.Panel',
    xtype: 'casesgrid',
    title: '测试用例',
    region: 'south',
    border: 'true',
    stripeRows: true,
    split: true,
    autoDestroy: true,
    width: '100%',
    minHight: '35%',
    SetData: function (keys, array) {
        let store = Ext.create('Edu.app.OrthogonalArray', {
            fields: keys,
            data: array
        });
        this.reconfigure(store, keys.map((key) => {
            return { header: key, dataIndex: key };
        }));
    }
});
Ext.define('Edu.app.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 'appPanle',
    layout: {
        type: 'auto',
        align: 'stretch',   // 每个子元素宽度充满子容器
    },
    items: [{
        xtype: 'factorFrom'
    }, {
        xtype: 'arraygrid'
    }, {
        xtype: 'casesgrid'
    }]
});
Ext.define('Edu.app.Window', {
    extend: 'Ext.window.Window',
    height: 600,
    width: 500,
    padding: 2,
    layout: {
        type: 'auto',
        align: 'stretch',   // 每个子元素宽度充满子容器
    },
    draggable: true,
    resizable: false,
    plain: false,
    closable: false,
    items: [{
        xtype: 'appPanle'
    }]
});