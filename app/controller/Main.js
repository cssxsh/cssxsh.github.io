Ext.define("EduApp.controller.Main", {
    extend: "Ext.app.ViewController",
    alias: "controller.Main",

    // handler
    inputFile: function (button, event, type) {
        let appPanel = button.up("[xtype=appPanel]");
        let controller = this;
        let mime = "";
        let handler = function () { };

        if (type === "json") {
            mine = "application/json";
            handler = function (event) {
                let workData = Ext.util.JSON.decode(event.target.result);
                controller.setFactorsText(workData.view.factortext, appPanel);
                controller.setData(workData.result, appPanel);
            };
        } else if (type === "xls") {
            mime = "application/vnd.ms-excel";
            handler = function (event) {
                let fileData = new Uint8Array(event.target.result);
                let workBook = XLSX.read(fileData, { type: "array" });
                let workData = EduApp.util.workBookToData(workBook);

                controller.setFactorsText(workData.view.factortext, appPanel);
                controller.setData(workData.result, appPanel);
            };
        }

        EduApp.util.upload(mime, function (files, event) {
            let reader = new FileReader();
            reader.onload = handler;
            reader.readAsArrayBuffer(files[0]);
        });
    },
    inputFileToJson: function (button, event) {
        this.inputFile(button, event, "json");
    },
    inputFileToExecl: function (button, event) {
        this.inputFile(button, event, "xls");
    },
    outputFile: function (button, event, type) {
        let appPanel = button.up("[xtype=appPanel]");
        let url = "";
        let workData = {};
        let result = EduApp.util.pValues.get(appPanel.getId());
        let records = this.getOAData(appPanel);
        let cases = this.getCasesData(appPanel);
        let factortext = this.getFactorsText(appPanel);
        let mime = "";
        let filename = "";

        result.records = records || [];
        workData.view = {
            factortext: factortext,
            cases: cases
        };
        workData.result = result;

        if (type === "json") {
            mime = "application/json";
            filename = "output.json";

        } else if (type == "xls") {
            mime = "application/vnd.ms-excel";
            filename = "output.xls";
        }

        url = EduApp.util.workDataToFileUrl(workData, type);
        EduApp.util.download(url, filename, mime);
    },
    outputFileToJson: function (button, event) {
        this.outputFile(button, event, "json");
    },
    outputFileToExecl: function (button, event) {
        this.outputFile(button, event, "xls");
    },
    genCases: function (button, event) {
        let appPanel = button.up("[xtype=appPanel]");
        let factors = this.getFactors(appPanel);
        if (factors === false) {
            Ext.Msg.alert("错误！", "输入为空！");
        } else {
            let result = EduApp.util.getOArray(factors);
            if (!Array.isArray(result.OArray)) {
                let nrows = result.nrows;
                let ncolumns = result.ncolumns;
                if (result.nrows === 1) {
                    result.OArray = new Array(nrows).fill(new Array(ncolumns).fill(0));
                } else {
                    console.log("Not find OArray for [" + result.key + "]");
                    Ext.Msg.alert("错误！", "未找到对应的正交表，<br>请尝试手工输入。");
                    result.OArray = new Array(nrows).fill(new Array(ncolumns));
                }
            }
            this.setData(result, appPanel);
        }
    },
    checkOAarry: function (button, event) {
        let appPanel = button.up("[xtype=appPanel]");
        let arrayGrid = appPanel.down("[xtype=arrayGrid]");

        if (!EduApp.util.isOArray(arrayGrid.getStore())) {
            Ext.Msg.alert("错误！", "正交表不符合基本要求！");
        } else {
            Ext.Msg.alert("正确！", "正交表符合基本要求！", function () {
                arrayGrid.getStore().commitChanges();
            });
        }
    },

    // method
    setData: function (result, appPanel) {
        let arrayGrid = appPanel.down("[xtype=arrayGrid]");
        let casesGrid = appPanel.down("[xtype=casesGrid]");
        let factors = result.factors;
        let keys = Object.keys(factors);
        let array = result.records || result.OArray;

        let store = Ext.create("EduApp.OrthogonalArray", {
            fields: keys,
            data: array
        });
        store.fields = keys;
        arrayGrid.reconfigure(store, [{ header: "序号", xtype: "rownumberer" }].concat(keys.map((key, index) => {
            let colunm = {
                header: key,
                dataIndex: key,
                editor: {
                    xtype: "numberfield",
                    allowBlank: false,
                    maxValue: factors[keys[index]].length - 1,
                    minValue: 0
                }
            }
            return colunm;
        })));
        arrayGrid.setTitle("[" + result.key + "] 正交表");
        arrayGrid.doAutoRender();
        casesGrid.reconfigure(store, [{ header: "序号", xtype: "rownumberer" }].concat(keys.map((key) => {
            let colunm = {
                header: key,
                dataIndex: key,
                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                    let level = EduApp.util.translateValue(factors, keys[columnIndex - 1], value);
                    return level;
                }
            };
            return colunm;
        })));
        casesGrid.getStore().commitChanges();
        casesGrid.doAutoRender();

        //
        EduApp.util.pValues.replace(appPanel.getId(), result);
    },
    getOAData: function (appPanel) {
        let store = appPanel.down("[xtype=arrayGrid]").getStore();
        let records = store.getRange().map((record) => {
            let data = record.getData();
            delete data["id"];
            return data;
        });
        return records;
    },
    getCasesData: function (appPanel) {
        let store = appPanel.down("[xtype=casesGrid]").getStore();
        let result = EduApp.util.pValues.get(appPanel.getId());
        let factors = result.factors;
        let records = store.getRange().map((record) => {
            let data = record.getData();
            for (let key in factors) {
                let value = data[key];
                let level = EduApp.util.translateValue(factors, key, value);
                data[key] = level;
            }
            delete data["id"];
            return data;
        });
        return records;
    },
    getFactorsText: function (appPanel) {
        let factorFrom = appPanel.down("[xtype=factorFrom]");
        let textarea = factorFrom.down("[inputId=factortext]");
        let factortext = textarea.getValue();

        return factortext;
    },
    setFactorsText: function (factortext, appPanel) {
        let factorFrom = appPanel.down("[xtype=factorFrom]");
        let textarea = factorFrom.down("[inputId=factortext]");
        textarea.setValue(factortext);
    },
    getFactors: function (appPanel) {
        let factorFrom = appPanel.down("[xtype=factorFrom]");
        let textarea = factorFrom.down("[inputId=factortext]");
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
    }
});