"use strict";
Ext.define("EduApp.view.Phone.panel.MainPanel", {
    "extend": "Ext.tab.Panel",
    "xtype": "appTabPanel",

    "defaults": {
        "scrollable": true,
        "userSelectable": {
            "bodyElement": true
        }
    },

    "items": [
        {
            "title": "Tab 1",
            "html": "By default, tabs are aligned to the top of a view.",
            "cls": "card",
            "fiex": 1
        },
        {
            "title": "Tab 2",
            "html": "A TabPanel can use different animations by setting <code>layout.animation.</code>",
            "cls": "card"
        },
        {
            "title": "Tab 3",
            "html": '<span class="action">User tapped Tab 3</span>',
            "cls": "card"
        }
    ]
});
