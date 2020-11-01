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

const App: React.FunctionComponent = () => {
    const [result, setResult] = React.useState<string[]>(["# DLSITE"])
    const loadContent = () => {
        setResult(["# DLSITE"])
        const DohPub = new doh.DohResolver("https://doh.pub/dns-query")
        const Cloudflare = new doh.DohResolver("https://1.0.0.1/dns-query")

        const hostMap = new Map<string, [any, string[]]>([
            ["download.sangfor.com.cn", [DohPub, [
                "trial.dlsite.com", "img.dlsite.jp", "media.dlsite.com", "play.dl.dlsite.com", "media.ci-en.jp",
                "media.stg.ci-en.jp", "file.chobit.cc", "img.chobit.cc"
            ]]],
            ["j.sni.global.fastly.net", [Cloudflare, [
                "ssl.dlsite.com", "www.dlsite.com", "www.nijiyome.com", "www.nijiyome.jp"
            ]]],
            ["play.dlsite.com", [Cloudflare, [
                "play.dlsite.com"
            ]]],
            ["login.dlsite.com", [Cloudflare, [
                "login.dlsite.com"
            ]]],
            ["download.dlsite.com.wtxcdn.com", [DohPub, [
                "download.dlsite.com"
            ]]]
        ])

        hostMap.forEach(([dns, hosts], cname) => {
            dns.query(cname, "A", "GET").then((response: { answers: answer[]; }) => {
                const ipAddr = response.answers.filter(ans => ans.type === "A").map(ans => ans.data)
                const list = [`## ${cname}`].concat(hosts.flatMap(host => ipAddr.map(ip => `${ip}\t\t${host} `)))
                setResult(prevState => prevState.concat(list))
                console.log(`${list}加载成功`)
            })
        })
    }

    React.useEffect(loadContent, [])

    return (
        <React.Fragment>
            <CssBaseline />
            <Button onClick={loadContent} color="primary">刷新</Button>
            <h3>使用前请将已有的旧HOSTS清除，火狐加载可能存在问题，请尝试Window自带的Edge</h3>
            <Paper>
                {result.map(line => (<li key={line}>{line}</li>))}
            </Paper>
        </React.Fragment>
    );
}

export default App;
