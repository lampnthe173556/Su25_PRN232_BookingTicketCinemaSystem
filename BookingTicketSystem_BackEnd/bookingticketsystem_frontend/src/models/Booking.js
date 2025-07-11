export class Booking {
  constructor(data = {}) {
    this.id = data.id || null;
    this.userId = data.userId || null;
    this.user = data.user || null;
    this.showId = data.showId || null;
    this.show = data.show || null;
    this.totalAmount = data.totalAmount || 0;
    this.status = data.status || 'pending';
    this.bookingDate = data.bookingDate || null;
    this.seats = data.seats || [];
    this.payments = data.payments || [];
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  static fromApi(data) {
    return new Booking({
      id: data.bookingId || data.id,
      userId: data.userId,
      user: data.user ? { 
        id: data.user.userId, 
        name: data.user.name,
        email: data.user.email 
      } : null,
      showId: data.showId,
      show: data.show ? { 
        id: data.show.showId, 
        movie: data.show.movie,
        cinemaHall: data.show.cinemaHall,
        startTime: data.show.startTime,
        date: data.show.date,
        price: data.show.price
      } : null,
      totalAmount: data.totalAmount,
      status: data.status,
      bookingDate: data.bookingDate,
      seats: data.seats || [],
      payments: data.payments || [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }

  toCreateDto() {
    return {
      userId: this.userId,
      showId: this.showId,
      totalAmount: this.totalAmount,
      status: this.status,
      bookingDate: this.bookingDate,
      seatIds: this.seats.map(seat => seat.id)
    };
  }

  toUpdateDto() {
    return {
      userId: this.userId,
      showId: this.showId,
      totalAmount: this.totalAmount,
      status: this.status,
      bookingDate: this.bookingDate
    };
  }
} 