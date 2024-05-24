import { TestBed } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { LipwigApiService } from './api.service';

describe('LipwigApiService', () => {
    let service: LipwigApiService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [LipwigApiService],
        });

        service = TestBed.inject(LipwigApiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify(); // Ensure that there are no outstanding requests
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should throw an error if the API URL is not set', async () => {
        await expect(service.query('test')).rejects.toThrow(
            'Lipwig API URL not set'
        );
    });

    it('should send a GET request to the correct URL', async () => {
        service.setUrl('http://localhost:3000');
        service.query('test').then();

        const req = httpMock.expectOne(
            'http://localhost:3000/api/query?code=test'
        );
        expect(req.request.method).toBe('GET');
        req.flush({});
    });
});
