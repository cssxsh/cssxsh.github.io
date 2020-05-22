"use strict";

Ext.define("EduApp.controller.OArrayGrid", {
    "extend": "Ext.app.ViewController",
    "alias": "controller.OArrayGrid",

    addRow() {
        const arrayGrid = this.getView();
        const store = arrayGrid.getStore();
        const newModel = new (store.getModel())();
        store.add(newModel);
    },
    reduceRow() {
        const arrayGrid = this.getView();
        const store = arrayGrid.getStore();
        const num = store.getData().length;
        if (num > 1) {
            const last = store.last();
            store.remove(last);
        }
    },
    onTools() {
        const arrayGrid = this.getView();
        arrayGrid.tools.forEach((tool) => {
            tool.setDisabled(false);
        });
    }
});
