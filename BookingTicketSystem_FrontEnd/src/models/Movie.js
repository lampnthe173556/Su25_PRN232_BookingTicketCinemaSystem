export class Movie {
  constructor(data = {}) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.duration = data.duration || 0;
    this.language = data.language || '';
    this.releaseDate = data.releaseDate || null;
    this.trailerUrl = data.trailerUrl || '';
    this.rating = data.rating || 0;
    this.posterUrl = data.posterUrl || '';
    this.genres = data.genres || [];
    this.actors = data.actors || [];
    this.directors = data.directors || [];
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  static fromApi(data) {
    return new Movie({
      id: data.id,
      title: data.title,
      description: data.description,
      duration: data.duration,
      language: data.language,
      releaseDate: data.releaseDate,
      trailerUrl: data.trailerUrl,
      rating: data.rating,
      posterUrl: data.posterUrl,
      genres: data.genres || [],
      actors: data.actors || [],
      directors: data.directors || [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }

  toCreateUpdateDto() {
    return {
      Title: this.title,
      Description: this.description,
      Duration: this.duration,
      Language: this.language,
      ReleaseDate: this.releaseDate ? (typeof this.releaseDate === 'string' ? this.releaseDate : this.releaseDate.toISOString().split('T')[0]) : '',
      TrailerUrl: this.trailerUrl,
      Rating: this.rating,
      GenreIds: this.genres.map(g => g.id),
      ActorIds: this.actors.map(a => a.id),
      DirectorIds: this.directors.map(d => d.id)
    };
  }
} 