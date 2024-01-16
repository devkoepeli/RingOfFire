import { TestBed } from '@angular/core/testing';

import { CardsListService } from './cards-list.service';

describe('CardsListService', () => {
  let service: CardsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
