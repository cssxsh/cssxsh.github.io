"use strict";
Ext.define("EduApp.util", {
    // 单例
    singleton: true,
    info: {
        name: "正交表生成器",
        version: "0.1.0",
        author: "cssxsh"
    },
    OA: [],
    init: function () {
        this.outputInfo();

        const conn = Ext.create("Ext.data.Connection", {
            method: "GET",
            url: "../json/arr.json",
            disableCaching: false
        });
        conn.request({
            failure: function () {
                console.log("加载arr.json失败");
            },
            success: function (response) {
                let text = response.responseText;
                EduApp.util.OArrays = Ext.util.JSON.decode(text);
            }
        });

        this.Element = {
            a: document.createElement("a"),
            input: document.createElement("input"),
            link: Ext.getHead().getById("theme")
        }

        this.pValues = Ext.create("Ext.util.HashMap");


        // Service Workers
        if (navigator.serviceWorker != undefined) {
            navigator.serviceWorker.register('./sw.js')
                .then(function (registartion) {
                    console.log('支持sw:', registartion.scope);
                });
        }
    },
    setTheme: function (name) {
        let url = "https://cdn.bootcss.com/extjs/6.2.0/classic/theme-{0}/resources/theme-{0}-all.css";
        this.Element.link.set({
            href: Ext.String.format(url, name)
        });
    },
    outputInfo: function () {
        console.log(this.info);
    },
    getInfo: function () {
        return this.info.name + " ver " + this.info.version + " by " + this.info.author;
    },
    getOArray: function (factors) {
        let result = {
            factors: factors,
            ncolumns: 0,
            nrows: 0,
            key: " ",
            OArray: []
        }
        let nrows_min = 1; // 最小实验数
        let record = [];
        let farr = [];
        for (let factor in factors) {
            let arr = factors[factor];
            nrows_min += arr.length - 1;
            result.ncolumns++;
            record[arr.length] = (record[arr.length] || 0) + 1;
        }
        for (let n in record) {
            result.key += " " + parseInt(n) + "^" + record[n];
            farr.push(parseInt(n));
        }
        const getNrows = function (nrows_min, arr) {
            let nrows = nrows_min;

            while (!arr.every((n) => (nrows % n === 0))) {
                nrows++;
            };
            return nrows;
        }

        // let lcm_arr = lcm4arr(arr);
        result.key = result.key.slice(2);
        result.OArray = EduApp.util.OArrays[result.key] || false;
        result.nrows = getNrows(nrows_min, farr);
        return result;
    },
    isOArray: function (store) {
        const keys = store.config.fields || store.fields;
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
                    let p = data[l_key] + "," + data[r_key];
                    count[p] = (count[p] || 0) + 1;
                });
            });
            return flag = eq(columns);
        });
        return flag;
    },
    download: function (url, fileName, mine) {
        let temp = this.Element.a;
        Ext.apply(temp, {
            style: { display: "none" },
            download: fileName,
            href: url,
            type: mine
        });
        temp.click();
    },
    upload: function (mine, fn) {
        let temp = this.Element.input;
        Ext.apply(temp, {
            type: "file",
            accept: mine,
            style: { display: "none" },
            oninput: function (event) {
                fn(this.files, event);
                event.srcElement.value = "";
            },
        });
        temp.click();
    },
    translateValue: function (factors, key, value) {
        return factors[key][value];
    },
    workBookToData: function (workBook) {
        let name;
        let sheet;
        let json;
        let result = {
            factors: [],
            ncolumns: 0,
            nrows: 0,
            key: " ",
            records: []
        };
        let factortext = "";

        // 因子读取
        name = workBook.SheetNames[0];
        sheet = workBook.Sheets[name];
        json = XLSX.utils.sheet_to_json(sheet);
        for (let key in json[0]) {
            result.factors[key] = [];
        }
        json.forEach(function (value) {
            for (let key in value) {
                result.factors[key].push(value[key]);
            }
        });
        // 正则数组读取
        name = workBook.SheetNames[1];
        sheet = workBook.Sheets[name];
        json = XLSX.utils.sheet_to_json(sheet);
        result.ncolumns = Object.keys(result.factors).length;
        result.nrows = json.length;
        result.records = json;
        // 输入读取
        name = workBook.SheetNames[3];
        sheet = workBook.Sheets[name];
        factortext = sheet["B2"].v;
        result.key = sheet["A2"].v;

        let workData = {
            view: {
                factortext: factortext
            },
            result: result
        };
        return workData;
    },
    workBookByData: function (workData) {
        let workBook = XLSX.utils.book_new();
        let factors = workData.result.factors;
        let sheet;
        let aoa;
        let flag = true;
        let index = 0;
        const factorsKeys = Object.keys(factors);

        aoa = [factorsKeys];
        index = 1;
        while (flag) {
            let f;
            aoa[index] = [];
            for (let key in factors) {
                aoa[index].push(factors[key][index - 1] || "");
                f = f || factors[key][index];
            }
            index++;
            flag = (f !== undefined);
        }
        sheet = XLSX.utils.aoa_to_sheet(aoa);
        XLSX.utils.book_append_sheet(workBook, sheet, '测试因子');

        sheet = XLSX.utils.json_to_sheet(workData.result.records, {
            header: factorsKeys
        });
        XLSX.utils.book_append_sheet(workBook, sheet, '正交表');

        sheet = XLSX.utils.json_to_sheet(workData.view.cases, {
            header: factorsKeys
        });
        XLSX.utils.book_append_sheet(workBook, sheet, '测试用例');

        sheet = XLSX.utils.json_to_sheet([
            {
                "正交数组类型": workData.result.key,
                "用户当前输入": workData.view.factortext
            }
        ], {
            header: ["正交数组类型", "用户当前输入"]
        });
        XLSX.utils.book_append_sheet(workBook, sheet, "其他");

        workData = XLSX.write(workBook, {
            bookType: "xls",
            type: 'array',
            Props: {
                Author: EduApp.util.getInfo()
            }
        });
        return workData;
    },
    workDataToFileUrl: function (workData, type) {
        let url = "";
        if (type === "json") {
            let json = Ext.util.JSON.encode(workData);
            let mime = "application/json";
            let DataUrlHead = "data:" + mime + ";base64,";

            if (window.File) {
                let jsonFile = new File([json], { type: mime });
                url = window.URL.createObjectURL(jsonFile)
            } else {
                url = DataUrlHead + Ext.util.Base64.encode(json);
            }
        } else if (type === "xls") {
            let bookBuffer = EduApp.util.workBookByData(workData);
            let mime = "application/vnd.ms-excel";
            let DataUrlHead = "data:" + mime + ";base64,";

            if (window.File) {
                let excelFile = new File([bookBuffer], { type: mime });
                url = window.URL.createObjectURL(excelFile)
            } else {
                let string = String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));
                url = DataUrlHead + Ext.util.Base64.encode(string);
            }
        }
        return url;
    }
});