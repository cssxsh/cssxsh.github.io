import React from 'react';
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
// @ts-ignore
import doh from 'dohjs'
import {Button} from '@material-ui/core';

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
        const DohPub = new doh.DohResolver("https://cors.dohjs.workers.dev/https://doh.pub/dns-query")
        const Cloudflare = new doh.DohResolver("https://cloudflare-dns.com/dns-query")

        const host_1 = ["trial.dlsite.com", "img.dlsite.jp", "media.dlsite.com", "play.dl.dlsite.com", "media.ci-en.jp"
            , "media.stg.ci-en.jp", "www.nijiyome.com", "www.nijiyome.jp", "file.chobit.cc", "img.chobit.cc"]
        const host_2 = ["www.dlsite.com", "ssl.dlsite.com", "download.dlsite.com"]
        const host_3 = "play.dlsite.com"
        const host_4 = "login.dlsite.com"

        const hostMap = new Map<string, string[] | string>([
            ["download.sangfor.com.cn", host_1],
            ["w2.shared.global.fastly.net", host_2],
            ["play.dlsite.com", host_3],
            ["login.dlsite.com", host_4]
        ])

        hostMap.forEach((value, key) => {
            if (typeof value === "string") {
                Cloudflare.query(key, "A")
                    .then((response: { answers: answer[]; }) => {
                        const ip_addr = response.answers
                            .filter(ans => ans.type === "A")
                            .map(ans => ans.data)
                        const list = [`# ${key}`].concat(ip_addr.map(ip => `${ip} ${value} `))
                        setResult(prevState => prevState.concat(list))
                    })
            } else {
                DohPub.query(key, "A")
                    .then((response: { answers: answer[]; }) => {
                        const ip_addr = response.answers
                            .filter(ans => ans.type === "A")
                            .map(ans => ans.data)
                        const list = [`# ${key}`].concat(value.flatMap(host => ip_addr.map(ip => `${ip} ${host} `)))
                        setResult(prevState => prevState.concat(list))
                    })
            }
        })
    }

    React.useEffect(loadContent, [])

    return (
        <React.Fragment>
            <CssBaseline />
            <Button onClick={loadContent}>LOAD</Button>
            <Paper>
                {result.map(line => (<li key={line}>{line}</li>))}
            </Paper>
        </React.Fragment>
    );
}

export default App;
