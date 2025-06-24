export class Person {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.dateOfBirth = data.dateOfBirth || null;
    this.biography = data.biography || '';
    this.nationality = data.nationality || '';
    this.photoUrl = data.photoUrl || '';
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  static fromApi(data) {
    return new Person({
      id: data.id,
      name: data.name,
      dateOfBirth: data.dateOfBirth,
      biography: data.biography,
      nationality: data.nationality,
      photoUrl: data.photoUrl,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }

  toCreateUpdateDto() {
    return {
      Name: this.name,
      DateOfBirth: this.dateOfBirth ? (typeof this.dateOfBirth === 'string' ? this.dateOfBirth : this.dateOfBirth.toISOString().split('T')[0]) : '',
      Biography: this.biography,
      Nationality: this.nationality
    };
  }
} 