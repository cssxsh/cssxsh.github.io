"use strict";

importScripts("./serviceWoker/resourcesMap.js");
importScripts("./serviceWoker/swEventListener.js");
for (const event in self.listeners) {
    if (event !== "") {
        self.addEventListener(event, self.listeners[event]);
    }
}
