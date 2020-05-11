"use strict";
Ext.onReady(function () {
    // init 
    if (navigator.serviceWorker != null) {
        navigator.serviceWorker.register('/appjs/sw.js')
            .then(function (registartion) {
                console.log('支持sw:', registartion.scope)
            });
    }

    let window = Ext.create('Edu.app.Window', {
        title: '测试用例生成',
    });
    window.show();
});