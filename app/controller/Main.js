"use strict";

Ext.define("EduApp.controller.Main", {
    "extend": "Ext.app.ViewController",
    "alias": "controller.Main",

    // Handler
    inputFile(button, event, type) {
        const appPanel = this.getView();
        // button.up("[xtype=appPanel]");
        let mime = "";
        let handler = "";
        const self = this;

        if (type === "json") {
            mime = "application/json";
            handler = function handler(event) {
                const workData = Ext.util.JSON.decode(event.target.result);
                self.setFactorsText(workData.view.factortext, appPanel);
                self.setData(workData.result, appPanel);
            };
        } else if (type === "xls") {
            mime = "application/vnd.ms-excel";
            handler = function handler(event) {
                const fileData = new Uint8Array(event.target.result);
                const workBook = XLSX.read(fileData, {"type": "array"});
                const workData = EduApp.util.workBookToData(workBook);

                self.setFactorsText(workData.view.factortext, appPanel);
                self.setData(workData.result, appPanel);
            };
        }

        EduApp.util.upload(mime, (files) => {
            const reader = new FileReader();
            reader.onload = handler;
            reader.readAsArrayBuffer(files[0]);
        });
    },
    inputFileToJson(button, event) {
        this.inputFile(button, event, "json");
    },
    inputFileToExecl(button, event) {
        this.inputFile(button, event, "xls");
    },
    outputFile(button, event, type) {
        const appPanel = this.getView();
        let url = "";
        const workData = {};
        const result = EduApp.util.pValues.get(appPanel.getId()) || {"factors": []};
        const records = this.getOAData(appPanel);
        const cases = this.getCasesData(appPanel);
        const factortext = this.getFactorsText(appPanel);
        let mime = "";
        let filename = "";

        result.records = records || [];
        workData.view = {
            factortext,
            cases
        };
        workData.result = result;

        if (type === "json") {
            mime = "application/json";
            filename = "output.json";
        } else if (type === "xls") {
            mime = "application/vnd.ms-excel";
            filename = "output.xls";
        }

        url = EduApp.util.workDataToFileUrl(workData, type);
        EduApp.util.download(url, filename, mime);
    },
    outputFileToJson(button, event) {
        this.outputFile(button, event, "json");
    },
    outputFileToExecl(button, event) {
        this.outputFile(button, event, "xls");
    },
    genCases() {
        const appPanel = this.getView();
        const factors = this.getFactors(appPanel);
        if (factors === false) {
            Ext.Msg.alert("错误！", "输入为空！");
        } else {
            const result = EduApp.util.getOArray(factors);
            if (!Array.isArray(result.OArray)) {
                const {nrows} = result;
                const {ncolumns} = result;
                if (result.nrows === 1) {
                    result.OArray = new Array(nrows).fill(new Array(ncolumns).fill(0));
                } else {
                    console.log(`Not find OArray for [${result.key}]`);
                    Ext.Msg.alert("错误！", "未找到对应的正交表，<br>请尝试手工输入。");
                    result.OArray = new Array(nrows).fill(new Array(ncolumns));
                }
            }
            this.setData(result, appPanel);
        }
    },
    checkOAarry() {
        const appPanel = this.getView();
        const arrayGrid = appPanel.down("[xtype=arrayGrid]");

        if (EduApp.util.isOArray(arrayGrid.getStore())) {
            Ext.Msg.alert("正确！", "正交表符合基本要求！", () => {
                arrayGrid.getStore().commitChanges();
            });
        } else {
            Ext.Msg.alert("错误！", "正交表不符合基本要求！");
        }
    },

    // Method
    setData(result, appPanel) {
        const arrayGrid = appPanel.down("[xtype=arrayGrid]");
        const casesGrid = appPanel.down("[xtype=casesGrid]");
        const {factors} = result;
        const keys = Object.keys(factors);
        const array = result.records || result.OArray;
        let colunms = [];

        const store = Ext.widget("arrayStore", {
            "fields": keys,
            "data": array
        });
        store.fields = keys;
        const getColunmToOArray = function getColunmToOArray(key, index) {
            const colunm = {
                "header": key,
                "dataIndex": key,
                "editor": {
                    "xtype": "numberfield",
                    "allowBlank": false,
                    "maxValue": factors[keys[index]].length - 1,
                    "minValue": 0
                },
                "wrap": true,
                "flex": 1
            };
            return colunm;
        };
        colunms = [
            {
                "header": "序号",
                "xtype": "rownumberer"
            }
        ].concat(keys.map(getColunmToOArray));
        arrayGrid.reconfigure(store, colunms);
        arrayGrid.setTitle(`[${result.key}] 正交表`);
        arrayGrid.doAutoRender();

        //
        const getColunmToResult = function getColunmToResult(key) {
            const colunm = {
                "header": key,
                "dataIndex": key,
                "renderer": function renderer(value, cellmeta, record, rowIndex, columnIndex) {
                    const level = EduApp.util.translateValue(factors, keys[columnIndex - 1], value);
                    return level;
                },
                "wrap": true,
                "flex": 1
            };
            return colunm;
        };
        colunms = [
            {
                "header": "序号",
                "xtype": "rownumberer"
            }
        ].concat(keys.map(getColunmToResult));
        casesGrid.reconfigure(store, colunms);
        casesGrid.getStore().commitChanges();
        casesGrid.doAutoRender();

        //
        EduApp.util.pValues.replace(appPanel.getId(), result);
    },
    getOAData(appPanel) {
        const store = appPanel.down("[xtype=arrayGrid]").getStore();
        const records = store.getRange().map((record) => {
            const rdata = record.getData();
            delete rdata.id;
            return rdata;
        });
        return records;
    },
    getCasesData(appPanel) {
        const store = appPanel.down("[xtype=casesGrid]").getStore();
        const result = EduApp.util.pValues.get(appPanel.getId());
        const factors = Ext.isDefined(result) ? result.factors : [];
        const records = store.getRange().map((record) => {
            const rdata = record.getData();
            for (const key in factors) {
                if (Object.prototype.hasOwnProperty.call(factors, key)) {
                    const value = rdata[key];
                    const level = EduApp.util.translateValue(factors, key, value);
                    rdata[key] = level;
                }
            }
            delete rdata.id;
            return rdata;
        });
        return records;
    },
    getFactorsText(appPanel) {
        const factorFrom = appPanel.down("[xtype=factorFrom]");
        const textarea = factorFrom.down("[inputId=factortext]");
        const factortext = textarea.getValue();

        return factortext;
    },
    setFactorsText(factortext, appPanel) {
        const factorFrom = appPanel.down("[xtype=factorFrom]");
        const textarea = factorFrom.down("[inputId=factortext]");
        textarea.setValue(factortext);
    },
    getFactors(appPanel) {
        const factorFrom = appPanel.down("[xtype=factorFrom]");
        const textarea = factorFrom.down("[inputId=factortext]");
        if (textarea.getErrors().length !== 0) {
            return false;
        }
        const value = textarea.getValue();
        const lines = value.split(/\n+/u);
        const last = lines.pop();
        const hashmap = {};
        const reg1 = /:|：/u;
        const reg2 = /,|，/u;
        lines.forEach((line) => {
            const arr = line.split(reg1);
            const factors = arr[0].split(reg2);
            const levels = arr[1].split(reg2);
            factors.forEach((factor) => {
                hashmap[factor] = levels;
            });
        });
        if (last !== "") {
            const arr = last.split(reg1);
            const factors = arr[0].split(reg2);
            const levels = arr[1].split(reg2);
            factors.forEach((factor) => {
                hashmap[factor] = levels;
            });
        }
        return hashmap;
    }
});
