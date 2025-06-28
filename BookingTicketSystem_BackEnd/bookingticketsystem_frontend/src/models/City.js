export class City {
  constructor(data = {}) {
    this.id = data.id || data.cityId || null;
    this.name = data.name || '';
    this.cinemaCount = data.cinemaCount || 0;
    this.cinemas = data.cinemas || [];
  }

  static fromApi(data) {
    return new City({
      id: data.cityId || data.id,
      name: data.name,
      cinemaCount: data.cinemaCount,
      cinemas: data.cinemas || []
    });
  }

  toCreateUpdateDto() {
    return {
      Name: this.name
    };
  }
} 