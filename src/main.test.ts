import http from 'http';
import QRCode from 'qrcode-terminal';

import { start, main } from "./main";
jest.mock('http');
jest.mock('qrcode-terminal');
jest.mock('./envs', () => {
    return {
        hostname: 'test-hostname',
        realPort: 1234,
        topRedirect: 'test://test.test/test'
    };
});

const QRCodeMock = QRCode as jest.Mocked<typeof QRCode>;
const httpMock = http as jest.Mocked<typeof http>;

describe('server test', () => {
    beforeAll(() => {
    });
    describe('test start', () => {
        const mockServer = { listen: jest.fn() };
        beforeAll(() => {
            httpMock.createServer.mockReturnValue(mockServer as unknown as ReturnType<typeof http.createServer>);
            start();
        });
        test('createServerOption', () => {
            expect(httpMock.createServer).toHaveBeenCalledTimes(1);
            expect(httpMock.createServer).toHaveBeenCalledWith(main);
        });
        test('listen', () => {
            expect(mockServer.listen).toHaveBeenCalledTimes(1);
            expect(mockServer.listen).toHaveBeenCalledWith('/socket/server.sock', expect.any(Function));
        });
    });
    describe('test main', () => {
        test('top Redirect', () => {
            const resEnd = jest.fn();
            const resWriteHead = jest.fn();
            main({}, { end: resEnd, writeHead: resWriteHead });
            expect(resEnd).toHaveBeenCalledTimes(1);
        });
    });
});
