"use strict";
Ext.define("EduApp.util", {
    // 单例
    "singleton": true,
    "Util": {},
    "OA": [],
    "info": {
        "name": "正交表生成器",
        "version": "0.2.2",
        "author": "cssxsh"
    },
    init() {
        // XLSX模块加载
        const xlsxUrl = "./xlsx/xlsx.full.min.js";
        Ext.Loader.loadScript({"url": xlsxUrl});
        // 输出基本信息
        this.outputInfo();
        // Service Workers
        if (Ext.isDefined(navigator.serviceWorker)) {
            // "serviceWorker" in navigator
            const getWorker = (registration) => {
                const serviceWorker = registration.installing || registration.installing || registration.waiting || registration.active;
                return serviceWorker;
            };
            navigator.serviceWorker
                .register("./serviceWorker.js")
                .then((registartion) => {
                    const serviceWorker = getWorker(registartion);
                    console.log(`ServiceWorker State: ${serviceWorker.state} By ${serviceWorker.scriptURL} In ${registartion.scope}`);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        // TODO: 重写到【加载数据函数】中去
        const conn = Ext.create("Ext.data.Connection", {
            "method": "GET",
            "url": "../json/arr.json",
            "disableCaching": false
        });
        conn.request({
            failure() {
                console.warn("加载[arr.json]失败");
            },
            success(response) {
                const text = response.responseText;
                EduApp.util.OArrays = Ext.util.JSON.decode(text);
            }
        });
        // TODO: 特殊组件标记, 重写到【Element】中去
        this.Element = {
            "a": document.createElement("a"),
            "input": document.createElement("input"),
            "link": Ext.getHead().getById("theme")
        };
        // FIXME：初始化哈希表，重命名为valuesOfEle
        this.pValues = Ext.create("Ext.util.HashMap");
    },
    setTheme(name, type, callbeak, jsOfTheme) {
        const cssText = "./ext/{1}/theme-{0}/resources/theme-{0}-all.css";
        const cssUrl = Ext.String.format(cssText, name, type);
        const handredMilliSecond = 100;
        // 定义计时器
        const delayedTask = Ext.create("Ext.util.DelayedTask", () => {
            const mainView = Ext.getCmp(this.mainViewId);
            let flag = false;
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
                if (Ext.isFunction(callbeak)) {
                    callbeak({
                        name,
                        type
                    });
                }
            } else {
                delayedTask.delay(handredMilliSecond);
            }
        });
        // 更新主题并开启计时器
        Ext.util.CSS.removeStyleSheet("theme");
        Ext.util.CSS.swapStyleSheet("theme", cssUrl);
        delayedTask.delay(handredMilliSecond);
        // 加载主题脚本
        if (Ext.isString(jsOfTheme)) {
            Ext.Loader.loadScript({"url": jsOfTheme});
        } else if (jsOfTheme === true) {
            // https://cdn.bootcdn.net/ajax/libs/extjs/6.2.0/modern/theme-material/theme-material-debug.js
            const jsText = "https://cdn.bootcss.com/extjs/6.2.0/{1}/theme-{0}/theme-{0}-debug.js";
            const jsUrl = Ext.String.format(jsText, name, type);
            Ext.Loader.loadScript({"url": jsUrl});
        }
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
            "OArray": false
        };
        // 先计算最小实验数
        let ncolumns = 0;
        let nrowsMin = 1;
        const record = [];
        const levels = [];
        for (const factor in factors) {
            if (Object.prototype.hasOwnProperty.call(factors, factor)) {
                const arr = factors[factor];
                nrowsMin += arr.length - 1;
                ncolumns++;
                record[arr.length] = (record[arr.length] || 0) + 1;
            }
        }
        for (const num in record) {
            if (Object.prototype.hasOwnProperty.call(record, num)) {
                result.key += ` ${parseInt(num, 10)}^${record[num]}`;
                // 因素等级
                levels.push(parseInt(num, 10));
            }
        }
        // 判断最小小实验数符不符合公倍数要求,不符合调整
        let nrows = nrowsMin;
        const isDivided = (level) => nrows % level === 0;
        while (!levels.every(isDivided)) {
            nrows++;
        }
        // 整理结果
        const start = 2;
        result.key = result.key.slice(start);
        if (EduApp.util.OArrays[result.key]) {
            result.OArray = EduApp.util.OArrays[result.key];
            nrows = result.OArray.length;
        } else if (nrows === 1) {
            result.OArray = new Array(nrows).fill(new Array(ncolumns).fill(0));
        }
        result.columns = ncolumns;
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
        // ① 检查数组列中元素平均
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
        // ② 检查数组列中元素对平均
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
        // 通过<a/>下载文件
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
        // 通过<input/>读取文件数据
        const elmInput = this.Element.input;
        Ext.apply(elmInput, {
            "type": "file",
            "accept": mine,
            "style": {"display": "none"},
            "oninput": (event) => {
                const {files} = event.srcElement;
                uploadAfter(files, event);
                event.srcElement.value = "";
            }
        });
        elmInput.click();
    },
    translateValue(factors, key, value) {
        // 将正交数组中的数据转换为对应的等级
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
        const oArraySheet = 1;
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
                if (Object.hasOwnProperty.call(value, key)) {
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
