export class Payment {
  constructor(data = {}) {
    this.id = data.id || null;
    this.bookingId = data.bookingId || null;
    this.booking = data.booking || null;
    this.amount = data.amount || 0;
    this.paymentMethod = data.paymentMethod || '';
    this.status = data.status || 'pending';
    this.transactionId = data.transactionId || '';
    this.paymentDate = data.paymentDate || null;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  static fromApi(data) {
    return new Payment({
      id: data.paymentId || data.id,
      bookingId: data.bookingId,
      booking: data.booking ? { 
        id: data.booking.bookingId, 
        totalAmount: data.booking.totalAmount,
        status: data.booking.status
      } : null,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      status: data.status,
      transactionId: data.transactionId,
      paymentDate: data.paymentDate,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }

  toCreateDto() {
    return {
      bookingId: this.bookingId,
      amount: this.amount,
      paymentMethod: this.paymentMethod,
      status: this.status,
      transactionId: this.transactionId,
      paymentDate: this.paymentDate
    };
  }

  toUpdateDto() {
    return {
      bookingId: this.bookingId,
      amount: this.amount,
      paymentMethod: this.paymentMethod,
      status: this.status,
      transactionId: this.transactionId,
      paymentDate: this.paymentDate
    };
  }
} 