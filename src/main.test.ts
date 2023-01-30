import http from 'http';
import QRCode from 'qrcode-terminal';

import { start, main } from "./main";
jest.mock('http');
jest.mock('qrcode-terminal');
jest.mock('./envs', () => {
    return {
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
        describe('top Redirect', () => {
            test('url is empty', () => {
                const resEnd = jest.fn();
                const resWriteHead = jest.fn();
                main({}, { end: resEnd, writeHead: resWriteHead });
                expect(resEnd).toHaveBeenCalledTimes(1);
                expect(resWriteHead).toHaveBeenCalledTimes(1);
                expect(resWriteHead).toHaveBeenCalledWith(302, { Location: 'test://test.test/test' });
            });
            test('url is /', () => {
                const resEnd = jest.fn();
                const resWriteHead = jest.fn();
                main({ url: '/' }, { end: resEnd, writeHead: resWriteHead });
                expect(resEnd).toHaveBeenCalledTimes(1);
                expect(resWriteHead).toHaveBeenCalledTimes(1);
                expect(resWriteHead).toHaveBeenCalledWith(302, { Location: 'test://test.test/test' });
            });
            test('url param not have', () => {
                const resEnd = jest.fn();
                const resWriteHead = jest.fn();
                main({ url: '/?abc=def' }, { end: resEnd, writeHead: resWriteHead });
                expect(resEnd).toHaveBeenCalledTimes(1);
                expect(resWriteHead).toHaveBeenCalledTimes(1);
                expect(resWriteHead).toHaveBeenCalledWith(302, { Location: 'test://test.test/test' });
            });
            test('url param is empty', () => {
                const resEnd = jest.fn();
                const resWriteHead = jest.fn();
                main({ url: '/?url=' }, { end: resEnd, writeHead: resWriteHead });
                expect(resEnd).toHaveBeenCalledTimes(1);
                expect(resWriteHead).toHaveBeenCalledTimes(1);
                expect(resWriteHead).toHaveBeenCalledWith(302, { Location: 'test://test.test/test' });
            });
            test('url is upper case', () => {
                const resEnd = jest.fn();
                const resWriteHead = jest.fn();
                main({ url: '/?URL=abc' }, { end: resEnd, writeHead: resWriteHead });
                expect(resEnd).toHaveBeenCalledTimes(1);
                expect(resWriteHead).toHaveBeenCalledTimes(1);
                expect(resWriteHead).toHaveBeenCalledWith(302, { Location: 'test://test.test/test' });
            });
        });
    });
});
