import http from 'http';
import QRCode from 'qrcode-terminal';

import { start } from "./main";
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
        httpMock.createServer.mockReturnValue({ listen: jest.fn() } as unknown as ReturnType<typeof http.createServer>);
    });
    describe('when starting', () => {
        beforeAll(() => {
            start();
        });
        test('createServerOption', () => {
            expect(httpMock.createServer).toHaveBeenCalledTimes(1);
            expect(httpMock.createServer).toHaveBeenCalledWith(expect.any(Function));
        });
    });
});
