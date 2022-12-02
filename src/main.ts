import fs from 'fs';
import http from 'http';
import QRCode from 'qrcode-terminal';

const topRedirect = process.env['TOP_REDIRECT'] || 'https://example.com/';

const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost/');
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

server.listen(4000);
