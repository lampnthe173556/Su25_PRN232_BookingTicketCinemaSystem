export class Show {
  constructor(data = {}) {
    this.id = data.id || null;
    this.movieId = data.movieId || null;
    this.movie = data.movie || null;
    this.cinemaHallId = data.cinemaHallId || null;
    this.cinemaHall = data.cinemaHall || null;
    this.startTime = data.startTime || null;
    this.endTime = data.endTime || null;
    this.date = data.date || null;
    this.price = data.price || 0;
    this.status = data.status || 'active';
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  static fromApi(data) {
    return new Show({
      id: data.showId || data.id,
      movieId: data.movieId,
      movie: data.movie ? { 
        id: data.movie.movieId, 
        title: data.movie.title,
        posterUrl: data.movie.posterUrl 
      } : null,
      cinemaHallId: data.cinemaHallId,
      cinemaHall: data.cinemaHall ? { 
        id: data.cinemaHall.cinemaHallId, 
        name: data.cinemaHall.name 
      } : null,
      startTime: data.startTime,
      endTime: data.endTime,
      date: data.date,
      price: data.price,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }

  toCreateDto() {
    return {
      movieId: this.movieId,
      cinemaHallId: this.cinemaHallId,
      startTime: this.startTime,
      endTime: this.endTime,
      date: this.date,
      price: this.price,
      status: this.status
    };
  }

  toUpdateDto() {
    return {
      movieId: this.movieId,
      cinemaHallId: this.cinemaHallId,
      startTime: this.startTime,
      endTime: this.endTime,
      date: this.date,
      price: this.price,
      status: this.status
    };
  }
} 