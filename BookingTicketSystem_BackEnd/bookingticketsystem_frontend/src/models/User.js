export class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.address = data.address || '';
    this.dateOfBirth = data.dateOfBirth || null;
    this.gender = data.gender || '';
    this.role = data.role || 'user';
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  static fromApi(data) {
    return new User({
      id: data.userId || data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      role: data.role,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }

  toCreateDto() {
    return {
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address,
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      role: this.role
    };
  }

  toUpdateDto() {
    return {
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address,
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      role: this.role
    };
  }
} 