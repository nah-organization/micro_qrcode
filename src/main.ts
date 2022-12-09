import http from 'http';
import QRCode from 'qrcode-terminal';
import { hostURL, topRedirect } from './envs';

export function start() {
    const server = http.createServer((req, res) => {
        const url = new URL(req.url ?? '/', hostURL);
        const target = url.searchParams.get('url');
        if (!target) {
            res.writeHead(302, {
                'Location': topRedirect
            });
            res.end(`See: ${topRedirect}`);
            return;
        }
        QRCode.generate(target, { small: true }, (str) => {
            res.writeHead(200, {
                'Content-Type': 'text/plain; charset=UTF-8'
            });
            res.end(str);
        });
    });

    server.listen(443, () => {
        console.log(`Server running at ${hostURL}`);
    });
}

if (require.main === module) {
    start();
}
