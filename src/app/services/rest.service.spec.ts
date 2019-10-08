import { TestBed } from '@angular/core/testing';
import { RestService } from './rest.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

describe('RestService', () => {
  
  let service:RestService;
  let mockHttp;

  const address = 'localhost';
  const protocol = 'http';
  const port = '8082';
  const baseUrl = `${protocol}://${address}:${port}`;
  
  beforeEach(
    () => { 
      mockHttp = jasmine.createSpyObj("mockHttp", ["get", "post", "put", "delete"]);
      service = new RestService(mockHttp); 
    } );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Test if the controller endpoints are correctly created
   */
  it('should return correct base url', () => {
    expect(service.getBaseUrl()).toBe(baseUrl)
  })

  it(`should return the endpoint for the controllers`, () => {
    ['calendar_events', 'user', 'login'].forEach(controller => {
      expect(service.getEndpoint(controller)).toBe(`${baseUrl}/${controller}`)
    })
  });

  it('should return the endpoint for the item in the controller', () => {
    expect(service.getItemEndpoint('user', 'user@school.com')).toBe(`${baseUrl}/user/user@school.com`)
  })
  it('should return the endpoint for the controller if no id is provided', () => {
    expect(service.getItemEndpoint('user')).toBe(`${baseUrl}/user`)
  })
  
  /**
   * Basics to test if the restService methods are correctly linked to the corresponding http methods
   */
  it('should call the http delete upon delete', async () => {
    mockHttp.delete.and.returnValue(of(true));
    
    let hasPassed = await service.delete('calendarEvent', '1').toPromise();
    expect(hasPassed).toBe(true);
  })

  it('should call the http post upon post', async () => {
    mockHttp.post.and.returnValue(of(true));
    let hasPassed = await service.post('calendarEvent', '1').toPromise();
    expect(hasPassed).toBe(true);
  })

  it('should call the http put upon put', async () => {
    mockHttp.put.and.returnValue(of(true));
    let hasPassed = await service.put('calendarEvent', '1').toPromise();
    expect(hasPassed).toBe(true);
  })

  it('should call the http get upon get', async () => {
    mockHttp.get.and.returnValue(of(true));
    let hasPassed = await service.get('calendarEvent', '1').toPromise();
    expect(hasPassed).toBe(true);
  })

});
