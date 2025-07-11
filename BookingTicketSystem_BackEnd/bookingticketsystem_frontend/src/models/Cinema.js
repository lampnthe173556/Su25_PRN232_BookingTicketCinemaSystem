export class Cinema {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.address = data.address || '';
    this.phone = data.phone || '';
    this.email = data.email || '';
    this.description = data.description || '';
    this.cityId = data.cityId || null;
    this.city = data.city || null;
    this.cinemaHalls = data.cinemaHalls || [];
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  static fromApi(data) {
    return new Cinema({
      id: data.cinemaId || data.id,
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
      description: data.description,
      cityId: data.cityId,
      city: data.city ? { id: data.city.cityId, name: data.city.name } : null,
      cinemaHalls: data.cinemaHalls || [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }

  toCreateDto() {
    return {
      name: this.name,
      address: this.address,
      phone: this.phone,
      email: this.email,
      description: this.description,
      cityId: this.cityId
    };
  }

  toUpdateDto() {
    return {
      name: this.name,
      address: this.address,
      phone: this.phone,
      email: this.email,
      description: this.description,
      cityId: this.cityId
    };
  }
} 