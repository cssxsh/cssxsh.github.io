(this["webpackJsonpcssxsh.github.io"]=this["webpackJsonpcssxsh.github.io"]||[]).push([[0],{46:function(e,n,t){e.exports=t(98)},51:function(e,n,t){},76:function(e,n){},78:function(e,n){},98:function(e,n,t){"use strict";t.r(n);var o=t(0),c=t.n(o),a=t(12),i=t.n(a),l=(t(51),t(44)),r=t(115),s=t(116),u=t(24),m=t.n(u),d=t(117),f=function(){var e=c.a.useState(["# DLSITE"]),n=Object(l.a)(e,2),t=n[0],o=n[1],a=function(){o(["# DLSITE"]);var e=new m.a.DohResolver("https://doh.pub/dns-query"),n=new m.a.DohResolver("https://cloudflare-dns.com/dns-query");new Map([[["download.sangfor.com.cn",e],["trial.dlsite.com","img.dlsite.jp","media.dlsite.com","play.dl.dlsite.com","media.ci-en.jp","media.stg.ci-en.jp","file.chobit.cc","img.chobit.cc"]],[["w2.shared.global.fastly.net",n],["ssl.dlsite.com","www.dlsite.com","www.nijiyome.com","www.nijiyome.jp"]],[["play.dlsite.com",n],["play.dlsite.com"]],[["login.dlsite.com",n],["login.dlsite.com"]],[["download.dlsite.com.wtxcdn.com",e],["download.dlsite.com"]]]).forEach((function(e,n){n[1].query(n[0],"A","GET").then((function(t){var c=t.answers.filter((function(e){return"A"===e.type})).map((function(e){return e.data})),a=["# ".concat(n[0])].concat(e.flatMap((function(e){return c.map((function(n){return"".concat(n," ").concat(e," ")}))})));o((function(e){return e.concat(a)}))}))}))};return c.a.useEffect(a,[]),c.a.createElement(c.a.Fragment,null,c.a.createElement(r.a,null),c.a.createElement(d.a,{onClick:a,color:"primary"},"\u5237\u65b0"),c.a.createElement("h3",null,"\u4f7f\u7528\u524d\u8bf7\u5c06\u5df2\u6709\u7684\u65e7HOSTS\u6e05\u9664"),c.a.createElement(s.a,null,t.map((function(e){return c.a.createElement("li",{key:e},e)}))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(c.a.createElement(c.a.StrictMode,null,c.a.createElement(f,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[46,1,2]]]);
//# sourceMappingURL=main.5fcb89e7.chunk.js.map