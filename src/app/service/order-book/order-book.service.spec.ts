import { TestBed, inject } from '@angular/core/testing';

import { OrderBookService } from './order-book.service';

describe('OrderBookService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderBookService]
    });
  });

  it('should be created', inject([OrderBookService], (service: OrderBookService) => {
    expect(service).toBeTruthy();
  }));
});
