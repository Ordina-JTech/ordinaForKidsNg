import { TestBed } from '@angular/core/testing';
import { RestService } from './rest.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('RestService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule], 
      providers: [RestService]
  }));

  it('should be created', () => {
    const service: RestService = TestBed.get(RestService);
    expect(service).toBeTruthy();
  });

  it('should return correct base url', () => {
    const service: RestService = TestBed.get(RestService);
    expect(service.getBaseUrl()).toBe('http://localhost:8082')
  })

  it(`should return the endpoint for the controllers`, () => {
    const service: RestService = TestBed.get(RestService);
    ['calendar_events'].forEach(controller => {
      expect(service.getEndpoint(controller)).toBe(`http://localhost:8082/${controller}`)
    })
  });
  
});
