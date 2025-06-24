export class Genre {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  static fromApi(data) {
    return new Genre({
      id: data.id,
      name: data.name,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }

  toCreateUpdateDto() {
    return {
      Name: this.name
    };
  }
} 