"use strict";
Ext.define("EduApp.util", {
    // 单例
    "singleton": true,
    "Util": {},
    "info": {
        "name": "正交表生成器",
        "version": "0.1.1",
        "author": "cssxsh"
    },
    "OA": [],
    init() {
        this.outputInfo();

        const conn = Ext.create("Ext.data.Connection", {
            "method": "GET",
            "url": "../json/arr.json",
            "disableCaching": false
        });
        conn.request({
            failure() {
                console.warn("加载arr.json失败");
            },
            success(response) {
                const text = response.responseText;
                EduApp.util.OArrays = Ext.util.JSON.decode(text);
            }
        });

        this.Element = {
            "a": document.createElement("a"),
            "input": document.createElement("input"),
            "link": Ext.getHead().getById("theme")
        };

        this.pValues = Ext.create("Ext.util.HashMap");

        Ext.Loader.setConfig({
            "disableCaching": false
        });
        Ext.Loader.setPath("EduApp", "./app");
        // Service Workers
        if (Object.prototype.hasOwnProperty.call(navigator, "serviceWorker")) {
            // "serviceWorker" in navigator
            navigator.serviceWorker.register("./sw.js").then((registartion) => {
                console.info("支持sw:", registartion.scope);
            });
        }
    },
    setTheme(name, type, callbeak) {
        const cssText = "https://cdn.bootcss.com/extjs/6.2.0/{1}/theme-{0}/resources/theme-{0}-all.css";
        const cssUrl = Ext.String.format(cssText, name, type);
        const handredMilliSecond = 100;
        Ext.util.CSS.removeStyleSheet("theme");
        let mainView = Ext.getCmp(this.mainViewId);
        let flag = false;
        const delayedTask = Ext.create("Ext.util.DelayedTask", () => {
            mainView = Ext.getCmp(this.mainViewId);
            for (const index in document.styleSheets) {
                if (Object.prototype.hasOwnProperty.call(document.styleSheets, index)) {
                    if (document.styleSheets[index].href === cssUrl) {
                        flag = true;
                        break;
                    }
                }
            }
            if (Ext.isDefined(mainView) && flag) {
                mainView.hide().show();
                if (Ext.isDefined(callbeak)) {
                    callbeak({
                        name,
                        type
                    });
                }
            } else {
                delayedTask.delay(handredMilliSecond);
            }
        });

        Ext.util.CSS.swapStyleSheet("theme", cssUrl);
        delayedTask.delay(handredMilliSecond);
    },
    setMainViewId(mainViewId) {
        this.mainViewId = mainViewId;
    },
    outputInfo() {
        console.table(this.info);
    },
    getInfo() {
        return `${this.info.name} ver ${this.info.version} by ${this.info.author}`;
    },
    getOArray(factors) {
        const result = {
            factors,
            "ncolumns": 0,
            "nrows": 0,
            "key": " ",
            "OArray": []
        };
        // 最小实验数
        let nrowsMin = 1;
        const record = [];
        const farr = [];
        for (const factor in factors) {
            if (Object.prototype.hasOwnProperty.call(factors, factor)) {
                const arr = factors[factor];
                nrowsMin += arr.length - 1;
                result.ncolumns++;
                record[arr.length] = (record[arr.length] || 0) + 1;
            }
        }
        for (const num in record) {
            if (Object.prototype.hasOwnProperty.call(record, num)) {
                result.key += ` ${parseInt(num, 10)}^${record[num]}`;
                farr.push(parseInt(num, 10));
            }
        }

        let nrows = nrowsMin;

        const isDivided = function isDivided(num) {
            const divided = nrows % num === 0;
            return divided;
        };
        while (!farr.every(isDivided)) {
            nrows++;
        }

        // Let lcm_arr = lcm4arr(arr);
        const start = 2;
        result.key = result.key.slice(start);
        result.OArray = EduApp.util.OArrays[result.key] || false;
        result.nrows = nrows;
        return result;
    },
    isOArray(store) {
        const keys = store.config.fields || store.fields;
        const equate = function equate(arr) {
            for (const index in arr) {
                if (Object.hasOwnProperty.call(arr, index)) {
                    let lnum = false;
                    const isValue = function isValue(value) {
                        if (lnum && lnum !== value) {
                            return false;
                        }
                        lnum = value;
                        return true;
                    };
                    if (!arr[index].every(isValue)) {
                        return false;
                    }
                }
            }
            return true;
        };
        if (keys === null) {
            return false;
        }
        // ①
        const columns = [];
        keys.forEach((key) => {
            columns[key] = [];
        });
        store.each((record) => {
            const rdata = record.getData();
            keys.forEach((key) => {
                columns[key][rdata[key]] = (columns[key][rdata[key]] || 0) + 1;
            });
        });
        if (!equate(columns)) {
            return false;
        }
        // ②
        const lKeys = keys;
        const rKeys = keys;
        let flag = true;
        lKeys.every((lKey) => {
            const count = [];
            rKeys.shift();
            rKeys.forEach((rKey) => {
                store.each((record) => {
                    const rdata = record.getData();
                    const pKey = `${rdata[lKey]},${rdata[rKey]}`;
                    count[pKey] = (count[pKey] || 0) + 1;
                });
            });
            flag = equate(columns);
            return flag;
        });
        return flag;
    },
    download(url, fileName, mine) {
        const elmA = this.Element.a;
        Ext.apply(elmA, {
            "style": {"display": "none"},
            "download": fileName,
            "href": url,
            "type": mine
        });
        elmA.click();
    },
    upload(mine, uploadAfter) {
        const elmInput = this.Element.input;
        Ext.apply(elmInput, {
            "type": "file",
            "accept": mine,
            "style": {"display": "none"},
            "oninput"(event) {
                uploadAfter(this.files, event);
                event.srcElement.value = "";
            }
        });
        elmInput.click();
    },
    translateValue(factors, key, value) {
        return factors[key][value];
    },
    workBookToData(workBook) {
        let name = "";
        let sheet = {};
        let json = {};
        const result = {
            "factors": [],
            "ncolumns": 0,
            "nrows": 0,
            "key": " ",
            "records": []
        };
        let factortext = "";
        const factorsSheet = 0;
        const oArraySheet = 2;
        const infoSheet = 3;

        // 因子读取
        name = workBook.SheetNames[factorsSheet];
        sheet = workBook.Sheets[name];
        json = XLSX.utils.sheet_to_json(sheet);
        for (const key in json[0]) {
            if (Object.hasOwnProperty.call(json[0], key)) {
                result.factors[key] = [];
            }
        }
        json.forEach((value) => {
            for (const key in value) {
                if (Object.hasOwnProperty.call(key, value)) {
                    result.factors[key].push(value[key]);
                }
            }
        });
        // 正则数组读取
        name = workBook.SheetNames[oArraySheet];
        sheet = workBook.Sheets[name];
        json = XLSX.utils.sheet_to_json(sheet);
        result.ncolumns = Object.keys(result.factors).length;
        result.nrows = json.length;
        result.records = json;
        // 输入读取
        name = workBook.SheetNames[infoSheet];
        sheet = workBook.Sheets[name];
        factortext = sheet.B2.v;
        result.key = sheet.A2.v;

        const workData = {
            "view": {
                factortext
            },
            result
        };
        return workData;
    },
    workBookByData(workData) {
        const workBook = XLSX.utils.book_new();
        const {factors} = workData.result;
        let sheet = {};
        let aoa = [];
        let flag = true;
        let index = 0;
        const factorsKeys = Object.keys(factors);

        aoa = [factorsKeys];
        index = 1;
        while (flag) {
            let signal = false;
            aoa[index] = [];
            for (const key in factors) {
                if (Object.hasOwnProperty.call(factors, key)) {
                    aoa[index].push(factors[key][index - 1] || "");
                    signal = signal || index in factors[key];
                }
            }
            index++;
            flag = signal;
        }
        sheet = XLSX.utils.aoa_to_sheet(aoa);
        XLSX.utils.book_append_sheet(workBook, sheet, "测试因子");

        sheet = XLSX.utils.json_to_sheet(workData.result.records, {
            "header": factorsKeys
        });
        XLSX.utils.book_append_sheet(workBook, sheet, "正交表");

        sheet = XLSX.utils.json_to_sheet(workData.view.cases, {
            "header": factorsKeys
        });
        XLSX.utils.book_append_sheet(workBook, sheet, "测试用例");

        sheet = XLSX.utils.json_to_sheet(
            [
                {
                    "正交数组类型": workData.result.key,
                    "用户当前输入": workData.view.factortext
                }
            ],
            {
                "header": ["正交数组类型", "用户当前输入"]
            }
        );
        XLSX.utils.book_append_sheet(workBook, sheet, "其他");

        const arrayBuffer = XLSX.write(workBook, {
            "bookType": "xls",
            "type": "array",
            "Props": {
                "Author": EduApp.util.getInfo()
            }
        });
        return arrayBuffer;
    },
    workDataToFileUrl(workData, type) {
        let url = "";
        if (type === "json") {
            const json = Ext.util.JSON.encode(workData);
            const mime = "application/json";
            const DataUrlHead = `data:${mime};base64,`;

            if (window.File) {
                const jsonFile = new File([json], {"type": mime});
                url = window.URL.createObjectURL(jsonFile);
            } else {
                url = DataUrlHead + Ext.util.Base64.encode(json);
            }
        } else if (type === "xls") {
            const bookBuffer = EduApp.util.workBookByData(workData);
            const mime = "application/vnd.ms-excel";
            const DataUrlHead = `data:${mime};base64,`;

            if (window.File) {
                const excelFile = new File([bookBuffer], {"type": mime});
                url = window.URL.createObjectURL(excelFile);
            } else {
                const uint8Array = new Uint8Array(bookBuffer);
                const string = String.fromCharCode.apply(null, uint8Array);
                url = DataUrlHead + Ext.util.Base64.encode(string);
            }
        }
        return url;
    }
});
