"use strict";
Ext.Loader.setConfig({
    "disableCaching": false
});
Ext.Loader.setPath("EduApp", "./app");
// Loader设置必须在上面先完成
Ext.define("EduApp.Application", {
    "extend": "Ext.app.Application",
    "name": "EduApp",
    "requires": ["EduApp.util", "EduApp.controller.Main", "EduApp.controller.FactorInput", "EduApp.store.OrthogonalArray"],
    "launch": function launch() {
        const {deviceType} = Ext.os;

        EduApp.util.init();
        document.title = EduApp.util.getInfo();

        if (deviceType === "Phone") {
            // const runType = "modern";
            // const Phone = ["EduApp.view.Phone"];
            // EduApp.util.setTheme("material", runType);
            const runType = "classic";
            const Desktop = ["EduApp.view.Phone"];
            EduApp.util.setTheme("crisp", runType);
            Ext.require(Desktop, () => {
                const window = Ext.widget("viewport", {
                    "fullscreen": true,
                    "items": [{"xtype": "appPanel-touch"}]
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
