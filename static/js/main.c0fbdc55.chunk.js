(this["webpackJsonpcssxsh.github.io"]=this["webpackJsonpcssxsh.github.io"]||[]).push([[0],{46:function(e,n,t){e.exports=t(98)},51:function(e,n,t){},76:function(e,n){},78:function(e,n){},98:function(e,n,t){"use strict";t.r(n);var o=t(0),a=t.n(o),c=t(13),r=t.n(c),s=(t(51),t(21)),i=t(115),l=t(116),d=t(10),u=t.n(d),m=t(117),h=[new u.a.DohResolver("https://doh.pub/dns-query"),new u.a.DohResolver("https://dns.alidns.com/dns-query")],w=[new u.a.DohResolver("https://cloudflare-dns.com/dns-query"),new u.a.DohResolver("https://1.0.0.1/dns-query"),new u.a.DohResolver("https://doh-jp.blahdns.com/dns-query"),new u.a.DohResolver("https://dns.oszx.co/dns-query"),new u.a.DohResolver("https://doh.dns.sb/dns-query"),new u.a.DohResolver("https://doh.eastas.pi-dns.com/dns-query")],p=new Map([["download.sangfor.com.cn",[!1,["trial.dlsite.com","img.dlsite.jp","media.dlsite.com","play.dl.dlsite.com","media.ci-en.jp","media.stg.ci-en.jp","file.chobit.cc","img.chobit.cc"]]],["download.dlsite.com.wtxcdn.com",[!1,["download.dlsite.com"]]],["j.sni.global.fastly.net",[!1,["ssl.dlsite.com","www.dlsite.com","www.nijiyome.com","www.nijiyome.jp","download.dlsite.com"]]],["play.dlsite.com",[!0,["play.dlsite.com"]]],["login.dlsite.com",[!0,["login.dlsite.com"]]]]),f=function(){var e=a.a.useState(new Map),n=Object(s.a)(e,2),t=n[0],o=n[1],c=a.a.useState(0),r=Object(s.a)(c,2),d=(r[0],r[1]),u=function(){o(new Map),p.forEach((function(e,n){var t=Object(s.a)(e,2),a=t[0],c=t[1];(a?w:h).forEach((function(e){e.query(n,"A","GET").then((function(e){var t=e.answers.filter((function(e){return"A"===e.type})).map((function(e){return e.data})),a=c.flatMap((function(e){return t.map((function(n){return"".concat(n," ").concat(e," ")}))}));console.log(a),o((function(e){return e.set(n,(e.get(n)||[]).concat(a))})),d((function(e){return e+1}))}))}))}))};a.a.useEffect(u,[]);var f=["# DLSite"].concat(Array.from(t.entries()).flatMap((function(e){var n=Object(s.a)(e,2),t=n[0],o=n[1];return["## ".concat(t)].concat(Array.from(new Set(o)))})));return a.a.createElement(a.a.Fragment,null,a.a.createElement(i.a,null),a.a.createElement(m.a,{onClick:u,color:"primary"},"\u5237\u65b0"),a.a.createElement("h3",null,"\u4f7f\u7528\u524d\u8bf7\u5c06\u5df2\u6709\u7684\u65e7HOSTS\u6e05\u9664\uff0c\u706b\u72d0\u52a0\u8f7d\u53ef\u80fd\u5b58\u5728\u95ee\u9898\uff0c\u8bf7\u5c1d\u8bd5\u4f7f\u7528\u8c37\u6b4c\u5185\u6838\u7684\u6d4f\u89c8\u5668\u8bbf\u95ee\u3002"),a.a.createElement(l.a,null,f.map((function(e){return a.a.createElement("li",{key:e},e)}))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(f,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[46,1,2]]]);
//# sourceMappingURL=main.c0fbdc55.chunk.js.map