"use strict";
Ext.define("EduApp.Application", {
    extend: "Ext.app.Application",

    name: "EduApp",
    // requires: ["app.util"],
    launch: function () {
        EduApp.util.init();
        let reg = /Android|webOS|iPhone|iPod|BlackBerry/i;

        if (reg.test(navigator.userAgent)) {
            // touch
            console.log("Working in touch");
            EduApp.util.setTheme("crisp-touch")
            this.setMainView("EduApp.panel.MainPanel", {
                title: EduApp.util.getInfo(),
            });
        } else {
            // PC
            // EduApp.util.setTheme("")
            console.log("Working in PC");
            this.setMainView("Ext.container.Container");
            Ext.create("EduApp.window.Window", {
                title: EduApp.util.getInfo()
            });
        }
        document.title = EduApp.util.getInfo()
    }
});
Ext.application("EduApp.Application");