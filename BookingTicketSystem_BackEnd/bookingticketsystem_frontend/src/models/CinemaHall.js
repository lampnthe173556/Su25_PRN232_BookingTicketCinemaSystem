export class CinemaHall {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.capacity = data.capacity || 0;
    this.cinemaId = data.cinemaId || null;
    this.cinema = data.cinema || null;
    this.seats = data.seats || [];
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  static fromApi(data) {
    return new CinemaHall({
      id: data.cinemaHallId || data.id,
      name: data.name,
      capacity: data.capacity,
      cinemaId: data.cinemaId,
      cinema: data.cinema ? { id: data.cinema.cinemaId, name: data.cinema.name } : null,
      seats: data.seats || [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }

  toCreateDto() {
    return {
      name: this.name,
      capacity: this.capacity,
      cinemaId: this.cinemaId
    };
  }

  toUpdateDto() {
    return {
      name: this.name,
      capacity: this.capacity,
      cinemaId: this.cinemaId
    };
  }
} 