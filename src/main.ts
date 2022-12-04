import fs from 'fs';
import https from 'https';
import QRCode from 'qrcode-terminal';
import { hostname, realPort, topRedirect } from './envs';

const server = https.createServer({
    'cert': fs.readFileSync('/etc/cert/fullchain.pem'),
    'key': fs.readFileSync('/etc/cert/privkey.pem'),
}, (req, res) => {
    const url = new URL(req.url ?? '/', `http://${hostname}/`);
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
    console.log(`Server running at https://${hostname}${realPort === 443 ? '' : ':' + realPort}/`);
});
