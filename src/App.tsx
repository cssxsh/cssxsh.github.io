import React from 'react';
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
// @ts-ignore
import doh from 'dohjs'
import Button from '@material-ui/core/Button';

interface answer {
    name: string
    type: string
    ttl: number
    class: string
    flush: boolean
    data: string
}

const ChinaDns = [
    new doh.DohResolver("https://doh.pub/dns-query"),
    new doh.DohResolver("https://dns.alidns.com/dns-query")
]

// const CleanBrowsing = new doh.DohResolver("https://doh.cleanbrowsing.org/doh/security-filter/")
// const Comss = new doh.DohResolver("https://dns.east.comss.one/dns-query")
// const Snopyta = new doh.DohResolver("https://fi.doh.dns.snopyta.org/dns-query")
/// const Oszx = new doh.DohResolver("https://dns.oszx.co/dns-query")
/// const DohSb = new doh.DohResolver("https://doh.dns.sb/dns-query")
// const DnsForge = new doh.DohResolver("https://dnsforge.de/dns-query")

const OtherDns = [
    new doh.DohResolver("https://dns.233py.com/dns-query"),
    new doh.DohResolver("https://dns.google/dns-query"),
    new doh.DohResolver("https://dns.twnic.tw/dns-query"),
    new doh.DohResolver("https://cloudflare-dns.com/dns-query"),
    new doh.DohResolver("https://1.0.0.1/dns-query"),
    // new doh.DohResolver("https://doh-jp.blahdns.com/dns-query"),
    // new doh.DohResolver("https://doh.eastas.pi-dns.com/dns-query")
]

const hostMap = new Map<string, [boolean, string[]]>([
    ["download.sangfor.com.cn", [false, [
        "trial.dlsite.com", "img.dlsite.jp", "media.dlsite.com", "play.dl.dlsite.com", "media.ci-en.jp",
        "media.stg.ci-en.jp", "file.chobit.cc", "img.chobit.cc"
    ]]],
    ["download.dlsite.com.wtxcdn.com", [false, [
        "download.dlsite.com"
    ]]],
    ["j.sni.global.fastly.net", [true, [
        "ssl.dlsite.com", "www.dlsite.com", "www.nijiyome.com", "www.nijiyome.jp", "download.dlsite.com"
    ]]],
    ["play.dlsite.com", [true, [
        "play.dlsite.com"
    ]]],
    ["login.dlsite.com", [true, [
        "login.dlsite.com"
    ]]]
])

const download = (filename: string, text: string) => {
    const pom = document.createElement('a');
    pom.setAttribute('href', 'data:application/octet-stream,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        const event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

const App: React.FunctionComponent = () => {
    const [result, setResult] = React.useState<Map<string, string[]>>(new Map())
    const [load, setLoad] = React.useState<number>(0)
    const loadContent = () => {
        setResult(new Map())

        hostMap.forEach(([isWall, hosts], cname) => {
            (isWall ? OtherDns : ChinaDns).forEach((dns) => {
                dns.query(cname, "A", "GET").then((response: { answers: answer[]; }) => {
                    const ipAddr = response.answers.filter(ans => ans.type === "A").map(ans => ans.data)
                    const list = hosts.flatMap(host => ipAddr.map(ip => `${ip} ${host} `))
                    setResult(prevState => prevState.set(cname, (prevState.get(cname) || []).concat(list)))
                    setLoad(prevState => prevState + 1)
                })
            })
        })
    }
    const saveContent = () => {
        const hosts = lines.join("\n");
        const path = "hosts"
        download(path, hosts);
    }
    React.useEffect(loadContent, [])
    const lines = ["# DLSite"].concat(Array.from(result.entries()).flatMap(([cname, hosts]) => {
        return [`## ${cname}`].concat(Array.from(new Set(hosts)))
    }))
    return (
        <React.Fragment>
            <CssBaseline />
            <Button onClick={loadContent} color="primary">刷新</Button>
            <Button onClick={saveContent} color="primary">下载</Button>
            <h3>使用前请将已有的旧HOSTS清除，火狐加载可能存在问题，请尝试使用谷歌内核的浏览器访问。</h3>
            <h3>请保存Hosts至路径覆盖原有文件 C:\Windows\System32\drivers\etc\hosts （最好先备份）</h3>
            <Paper>
                {lines.map(line => (<li key={line}>{line}</li>))}
            </Paper>
        </React.Fragment>
    );
}

export default App;
