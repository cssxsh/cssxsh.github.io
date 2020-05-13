'use strict';
Ext.define('Edu.app', {
    // 单例
    singleton: true,
    info: {
        name: '正交表生成器',
        version: '0.0.2',
        author: 'cssxsh'
    },
    OA: [],
    OutputInfo: function () {
        console.log(this.info);
    },
    Init: function () {
        this.OutputInfo();

        Ext.Ajax.request({
            url: '../json/arr.json',
            success: function (response) {
                let text = response.responseText;
                Edu.app.OA = Ext.util.JSON.decode(text);
            }
        });

        Ext.create('Edu.app.Window', {
            title: '测试用例生成',
        }).show();
    },
    GetArray: function (hashmap) {
        let ncolumns = 0;
        let nrows = 1;
        let key = "";
        let record = [];
        let OA_arr;
        for (let factor in hashmap) {
            let arr = hashmap[factor];
            nrows += arr.length - 1;
            ncolumns++;
            record[arr.length] = (record[arr.length] === undefined) ? 1 : record[arr.length] + 1;
        }
        for (let n in record) {
            key += ' ' + parseInt(n) + '^' + record[n];
        }
        key = key.slice(1);
        // console.log(key);
        OA_arr = this.OA[key];
        return OA_arr;
    },
    SetTable: function (factors, array, panel) {
        let keys = Object.keys(factors);
        let cases = array.map((line) => {
            return line.map((cell, ncolumns) => {
                return factors[keys[ncolumns]][cell];
            });
        });
        panel.down('[xtype=arraygrid]').SetData(keys, array);
        panel.down('[xtype=casesgrid]').SetData(keys, cases);
    }
});