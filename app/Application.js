"use strict";
Ext.Loader.setConfig({
    "disableCaching": false
});
Ext.Loader.setPath("EduApp", "./app");
// Loader设置必须在上面先完成
Ext.define("EduApp.Application", {
    "extend": "Ext.app.Application",
    "name": "EduApp",
    "requires": ["EduApp.util", "EduApp.controller.Main", "EduApp.store.OrthogonalArray"],
    "launch": function launch() {
        const xlsxUrl = "https://cdn.bootcss.com/xlsx/0.16.0/xlsx.full.min.js";
        const {deviceType} = Ext.os;

        Ext.Loader.loadScript({"url": xlsxUrl});
        EduApp.util.init();
        document.title = EduApp.util.getInfo();

        if (deviceType === "Phone") {
            // const runType = "modern";
            // const Phone = ["EduApp.view.Phone"];
            // EduApp.util.setTheme("material", runType);

            // Ext.require(Phone, () => {
            //     const tabPanel = Ext.widget("appTabPanel", {
            //         "title": EduApp.util.getInfo()
            //     });
            //     const appTabPanel = Ext.widget("appTabPanel", {
            //         "renderTo":
            //     });
            //     this.setMainView();
            //     EduApp.util.setMainViewId(view.getId());
            // });
            const runType = "classic";
            const Desktop = ["EduApp.view.Desktop"];
            EduApp.util.setTheme("crisp", runType);
            Ext.require(Desktop, () => {
                // const window = Ext.widget("appPanel", {
                //     "title": EduApp.util.getInfo()
                // });
                // window.show();
                const window = Ext.widget("viewport", {
                    "items": [{"xtype": "appPanel"}]
                });
                EduApp.util.setMainViewId(window.getId());
            });
            // console.log("Working in Phone");
        } else if (deviceType === "Desktop") {
            const runType = "classic";
            const Desktop = ["EduApp.view.Desktop"];
            EduApp.util.setTheme("crisp", runType);
            Ext.require(Desktop, () => {
                const window = Ext.widget("appWindow", {
                    "title": EduApp.util.getInfo()
                });
                window.show();
                EduApp.util.setMainViewId(window.getId());
            });
            // console.log("Working in Desktop");
        } else if (deviceType === "Tablet") {
            // const runType = "modern";
            // console.log("Working in Tablet");
        }
    }
});
Ext.application("EduApp.Application");
