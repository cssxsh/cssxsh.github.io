"use strict";

Ext.define("EduApp.controller.FactorInput", {
    "extend": "Ext.app.ViewController",
    "alias": "controller.FactorInput",

    setValidator(textareafield) {
        const validator = function validator(value) {
            const nchars = "[^:：,，\\s]";
            const members = `${nchars}+(?:\\s*[,，]\\s*${nchars}+\\s*)*`;
            const regexp = new RegExp(`^${members}[:：]\\s*${members}$`, "u");
            let errorText = "";
            const lines = value.split("\n");
            lines.forEach((line, index) => {
                if (line !== "" && !regexp.test(line)) {
                    errorText += `,${index + 1}`;
                }
            });
            if (errorText !== "") {
                errorText = errorText.slice(1);
                errorText = `输入项第${errorText}行不匹配`;
            }
            const result = errorText === "" ? true : errorText;
            return result;
        };
        textareafield.validator = validator;
    }
});
