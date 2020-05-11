Ext.define('Edu.app.Window', {
    extend: 'Ext.window.Window',
    height: 600,
    width: 500,
    draggable: true,
    padding: 3,
    resizable: false,
    plain: false,
    closable: false,
    items: [{
        xtype: 'appPanle'
    }]
});
Ext.define('Edu.app.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 'appPanle',
    layout: {
        type: 'auto',       // 子元素垂直布局
        align: 'stretch',   // 每个子元素宽度充满子容器
    },/*
    tools: [{
        type: 'refresh',
        handler: function () {
            console.log("refresh by button");
        }
    }, {
        type: 'save',
        handler: function () {
            console.log("save by button");
        }
    }],*/
    items: [{
        title: 'Details',
        items: [{
            fieldLabel: 'Data item',
            xtype: 'textfield'
        }],
        flex: 2
    }]
});