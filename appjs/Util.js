'use strict';
Ext.define('Edu.app', {
    // 单例
    singleton: true,
    info: {
        name: '正交表生成器',
        version: '0.0.4',
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

        Ext.QuickTips.init();
        Ext.create('Edu.app.Window', {
            title: this.info.name + ' ver ' + this.info.version + ' by ' + this.info.author,
        }).show();
    },
    GetArray: function (hashmap) {
        let result = {
            ncolumns: 0,
            nrows: 0,
            key: ' ',
            arr: []
        }
        let nrows_min = 1; // 最小实验数
        let record = [];
        let farr = [];
        for (let factor in hashmap) {
            let arr = hashmap[factor];
            nrows_min += arr.length - 1;
            result.ncolumns++;
            record[arr.length] = (record[arr.length] || 0) + 1;
        }
        for (let n in record) {
            result.key += ' ' + parseInt(n) + '^' + record[n];
            farr.push(parseInt(n));
        }
        // // 最大公因数
        // let gcd = function (x, y) {
        //     let max, min, temp;
        //     max = x > y ? x : y;
        //     min = x < y ? x : y;
        //     while (max % min) {
        //         temp = max % min;
        //         max = min;
        //         min = temp;
        //     }
        //     return min;
        // };
        // // 最小公倍数  
        // let lcm = function (x, y) {
        //     return x * y / gcd(x, y);
        // };
        // let lcm4arr = function (arr) {
        //     let result = 1;
        //     arr.forEach((num) => {
        //         result = lcm(num, result);
        //     });
        //     return result;
        // };
        let getNrows = function (nrows_min, arr) {
            let nrows = nrows_min;

            while (!arr.every((n) => (nrows % n === 0))) {
                nrows++;
            };
            return nrows;
        }

        // let lcm_arr = lcm4arr(arr);
        result.key = result.key.slice(2);
        result.arr = Edu.app.OA[result.key] || false;
        result.nrows = getNrows(nrows_min, farr);
        return result;
    }
});