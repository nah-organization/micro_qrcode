import http, { OutgoingHttpHeaders } from 'http';
import QRCode from 'qrcode-terminal';
import { topRedirect } from './envs';

export function main(req: { url?: string; }, res: {
    end(value: string): void,
    writeHead(status: number, header: OutgoingHttpHeaders): void;
}) {
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
};

export function start() {
    const server = http.createServer(main);

    server.listen('/socket/server.sock', () => {
        console.log(`Server running`);
    });
}

if (require.main === module) {
    start();
}
