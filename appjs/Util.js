'use strict';
Ext.define('Edu.app', {
    // 单例
    singleton: true,
    info: {
        name: '正交表生成器',
        version: '0.0.3',
        author: 'cssxsh'
    },
    OA: [],
    OutputInfo: function () {
        console.log(this.info);
    },
    Init: function () {
        this.OutputInfo();

        let conn = Ext.create('Ext.data.Connection', {
            method: 'GET',
            url: '../json/arr.json',
            disableCaching: false
        });
        conn.request({
            failure: function () {
                console.log('加载arr.json失败');
            },
            success: function (response) {
                let text = response.responseText;
                Edu.app.OA = Ext.util.JSON.decode(text);
            }
        });
        // let request = new XMLHttpRequest();
        // request.open('get', '../json/arr.json');
        // request.send(null);
        // request.onload = function () {
        //     if (request.status == 200) {
        //         let text = request.responseText;
        //         Edu.app.OA = Ext.util.JSON.decode(text);
        //     }
        // }

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