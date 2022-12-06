import fs from 'fs';
import https from 'https';
import QRCode from 'qrcode-terminal';

import { start } from "./main";
jest.mock('fs');
jest.mock('https');
jest.mock('qrcode-terminal');
jest.mock('./envs', () => {
    return {
        hostname: 'test-hostname',
        realPort: 1234,
        topRedirect: 'test://test.test/test'
    };
});

const QRCodeMock = QRCode as jest.Mocked<typeof QRCode>;
const fsMock = fs as jest.Mocked<typeof fs>;
const httpsMock = https as jest.Mocked<typeof https>;

describe('server test', () => {

    beforeAll(() => {
        fsMock.readFileSync
            .mockReturnValueOnce(Buffer.from('mocked fullchain file'))
            .mockReturnValueOnce(Buffer.from('mocked privkey file'));
        httpsMock.createServer.mockReturnValue({ listen: jest.fn() } as unknown as ReturnType<typeof https.createServer>);
    });
    describe('when starting', () => {
        beforeAll(() => {
            start();
        });
        test('fs read', () => {
            expect(fsMock.readFileSync).toHaveBeenCalledTimes(2);
            expect(fsMock.readFileSync).toHaveBeenNthCalledWith(1, '/etc/cert/fullchain.pem');
            expect(fsMock.readFileSync).toHaveBeenNthCalledWith(2, '/etc/cert/privkey.pem');
        });
        test('createServerOption', () => {
            expect(httpsMock.createServer).toHaveBeenCalledTimes(1);
            expect(httpsMock.createServer).toHaveBeenCalledWith({
                'cert': Buffer.from('mocked fullchain file'),
                'key': Buffer.from('mocked privkey file')
            }, expect.any(Function));
        });
    });
});
