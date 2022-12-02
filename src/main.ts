import fs from 'fs';
import http from 'https';
import QRCode from 'qrcode-terminal';

const topRedirect = process.env['TOP_REDIRECT'] || 'https://example.com/';

const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? '/');
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
            ContentType: 'text/plain'
        });
        res.end(str);
        return;
    });
});

server.listen(8080);
