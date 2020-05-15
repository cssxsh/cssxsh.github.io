'use strict';
Ext.define('Edu.app.From.Factor', {
    extend: 'Ext.form.Panel',
    title: '测试因子输入',
    xtype: 'factorFrom',
    layout: 'fit',
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
    }],
    GetFactors: function () {
        let textarea = this.down('[inputId=factortext]');
        if (textarea.getErrors().length !== 0) {
            return false;
        }
        let value = textarea.getValue();
        let lines = value.split(/\n+/);
        let last = lines.pop();
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
        if (last !== "") {
            let arr = last.split(reg_1);
            let factors = arr[0].split(reg_2);
            let levels = arr[1].split(reg_2);
            factors.forEach((f) => {
                hashmap[f] = levels;
            });
        }
        return hashmap;
    },
});
Ext.define('Edu.app.Grid.Array', {
    extend: 'Ext.grid.Panel',
    xtype: 'arrayGrid',
    title: '正交表',
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },
    sortableColumns: false,
    viewConfig: {
        columnLines: true,          // 列分割线
        stripeRows: true,
        forceFit: true,             // 自适应
        // markDirty: false            // 
    },
    // bbar: [{
    //     xtype: 'pagingtoolbar',
    //     displayInfo: true,
    //     displayMsg: '显示 {2} 条中的第 {0} 条到第 {1} 条',
    //     emptyMsg: "正交表为空",
    //     hidden: true,
    //     pageSize: 5
    // }],
    autoDestroy: true,
    isOArray: function () {
        let store = this.getStore();
        let keys = store.config.fields || store.fields;
        let eq = (arr) => {
            let flag = true;
            for (let i in arr) {
                let lnum = false;
                arr[i].every((v) => {
                    if (lnum && lnum !== v) {
                        flag = false;
                    }
                    lnum = v;
                    return flag;
                });
                // return
                if (!flag) {
                    return false;
                }
            }
            return true;
        }
        if (store === undefined || keys === null) {
            return false;
        }
        // let array = store.getRange().map(function (record) {
        //     let data = record.getData();
        //     let line = [];
        //     for (let i in record) {

        //     }
        // });
        // ①
        let columns = [];
        keys.forEach((key) => {
            columns[key] = [];
        });
        store.each((record) => {
            let data = record.getData();
            keys.forEach((key) => {
                columns[key][data[key]] = (columns[key][data[key]] || 0) + 1;
            });
        });
        if (!eq(columns)) {
            return false;
        }
        // ②
        let l_keys = keys;
        let r_keys = keys;
        let flag = true;
        l_keys.every((l_key) => {
            let count = [];
            r_keys.shift();
            r_keys.forEach((r_key) => {
                store.each((record) => {
                    let data = record.getData();
                    let p = data[l_key] + ',' + data[r_key];
                    count[p] = (count[p] || 0) + 1;
                });
            });
            return flag = eq(columns);
        });
        return flag;
    }
});
Ext.define('Edu.app.Grid.Cases', {
    extend: 'Ext.grid.Panel',
    xtype: 'casesGrid',
    title: '测试用例',
    sortableColumns: false,
    viewConfig: {
        columnLines: true,          // 列分割线
        stripeRows: true,
        forceFit: true,             // 自适应
        markDirty: false            // 
    },
    // bbar: [{
    //     xtype: 'pagingtoolbar',
    //     displayInfo: true,
    //     displayMsg: '显示 {2} 条中的第 {0} 条到第 {1} 条',
    //     emptyMsg: "测试用例为空",
    //     hidden: true
    // }],
    autoDestroy: true,
    flex: 1
});
Ext.define('Edu.app.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 'appPanel',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start',
    },
    items: [{
        flex: 1,
        xtype: 'factorFrom',
    }, {
        flex: 1,
        xtype: 'arrayGrid',
    }, {
        flex: 1,
        xtype: 'casesGrid',
    }],
    SetData: function (factors, array) {
        let arrayGrid = this.down('[xtype=arrayGrid]');
        let casesGrid = this.down('[xtype=casesGrid]');
        let keys = Object.keys(factors);
        let store = Ext.create('Edu.app.OrthogonalArray', {
            fields: keys,
            data: array
        });
        store.fields = keys;
        arrayGrid.reconfigure(store, [{ header: '序号', xtype: 'rownumberer' }].concat(keys.map((key, index) => {
            let colunm = {
                header: key,
                dataIndex: key,
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    maxValue: factors[keys[index]].length - 1,
                    minValue: 0
                }
            }
            return colunm;
        })));
        arrayGrid.setTitle();
        arrayGrid.doAutoRender();
        // arrayGrid.down('[xtype=pagingtoolbar]').setVisible(true).bindStore(store);
        casesGrid.reconfigure(store, [{ header: '序号', xtype: 'rownumberer' }].concat(keys.map((key) => {
            let colunm = {
                header: key,
                dataIndex: key,
                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                    let level = factors[keys[columnIndex - 1]][value]
                    return level;
                }
            };
            return colunm;
        })));
        casesGrid.getStore().commitChanges();
        casesGrid.doAutoRender();
        // casesGrid.down('[xtype=pagingtoolbar]').setVisible(true).bindStore(store);
    },
    tbar: [{
        xtype: 'button',
        text: '导入工作',
        listeners: {
            click: function (me, event, opts) {
                // console.log("Input by button");
            }
        }
    }, {
        xtype: 'button',
        text: '保存工作',
        listeners: {
            click: function (me, event, opts) {
                // console.log("Input by button");
            }
        }
    }, {
        xtype: 'button',
        text: '生成用例',
        listeners: {
            click: function (me, event, opts) {
                let appPanle = me.up('[xtype=appPanel]');
                let factorFrom = appPanle.down('[xtype=factorFrom]');
                let arrayGrid = appPanle.down('[xtype=arrayGrid]');
                let casesGrid = appPanle.down('[xtype=casesGrid]');
                let factors = factorFrom.GetFactors();
                if (factors === false) {
                    Ext.Msg.alert('错误！', '输入为空！');
                } else {
                    let result = Edu.app.GetArray(factors);
                    if (!Array.isArray(result.arr)) {
                        Ext.Msg.alert('错误！', '未找到对应的正交表，<br>请尝试手工输入。');
                        let nrows = result.nrows;
                        let ncolumns = result.ncolumns;
                        result.arr = new Array(nrows).fill(new Array(ncolumns));
                    }
                    appPanle.SetData(factors, result.arr);
                }
            }
        }
    }, {
        xtype: 'button',
        text: '检查正交',
        listeners: {
            click: function (me, event, opts) {
                let appPanle = me.up('[xtype=appPanel]');
                let factorFrom = appPanle.down('[xtype=factorFrom]');
                let arrayGrid = appPanle.down('[xtype=arrayGrid]');
                let casesGrid = appPanle.down('[xtype=casesGrid]');

                if (!arrayGrid.isOArray()) {
                    Ext.Msg.alert('错误！', '正交表不符合正交要求！');
                } else {
                    arrayGrid.getStore().commitChanges();
                }
            }
        }
    }]
});
Ext.define('Edu.app.Window', {
    extend: 'Ext.window.Window',
    height: 600,
    width: 500,
    padding: 2,
    layout: 'fit',
    draggable: true,
    resizable: false,
    plain: false,
    closable: false,
    items: [{
        xtype: 'appPanel'
    }]
});