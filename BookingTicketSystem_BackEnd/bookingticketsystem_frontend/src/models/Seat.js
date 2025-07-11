export class Seat {
  constructor(data = {}) {
    this.id = data.id || null;
    this.rowNumber = data.rowNumber || '';
    this.seatNumber = data.seatNumber || '';
    this.cinemaHallId = data.cinemaHallId || null;
    this.cinemaHall = data.cinemaHall || null;
    this.seatType = data.seatType || 'standard';
    this.price = data.price || 0;
    this.isAvailable = data.isAvailable !== undefined ? data.isAvailable : true;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  static fromApi(data) {
    return new Seat({
      id: data.seatId || data.id,
      rowNumber: data.rowNumber,
      seatNumber: data.seatNumber,
      cinemaHallId: data.cinemaHallId,
      cinemaHall: data.cinemaHall ? { 
        id: data.cinemaHall.cinemaHallId, 
        name: data.cinemaHall.name 
      } : null,
      seatType: data.seatType,
      price: data.price,
      isAvailable: data.isAvailable,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }

  toCreateDto() {
    return {
      rowNumber: this.rowNumber,
      seatNumber: this.seatNumber,
      cinemaHallId: this.cinemaHallId,
      seatType: this.seatType,
      price: this.price,
      isAvailable: this.isAvailable
    };
  }

  toUpdateDto() {
    return {
      rowNumber: this.rowNumber,
      seatNumber: this.seatNumber,
      cinemaHallId: this.cinemaHallId,
      seatType: this.seatType,
      price: this.price,
      isAvailable: this.isAvailable
    };
  }
} 