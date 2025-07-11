import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

class VoteService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}${API_ENDPOINTS.VOTES}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async createOrUpdate(voteData) {
    try {
      const response = await this.api.post('/', voteData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByMovie(movieId) {
    try {
      const response = await this.api.get(`/movie/${movieId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByUserAndMovie(userId, movieId) {
    try {
      const response = await this.api.get(`/user/${userId}/movie/${movieId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(voteId, voteData) {
    try {
      const response = await this.api.put(`/${voteId}`, voteData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(voteId) {
    try {
      await this.api.delete(`/${voteId}`);
      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMovieStats(movieId) {
    try {
      const response = await this.api.get(`/movie/${movieId}/stats`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAll(filters = {}) {
    try {
      const { movieId, userId, minRating, maxRating, fromDate, toDate } = filters;
      const response = await this.api.get('/all', {
        params: { movieId, userId, minRating, maxRating, fromDate, toDate }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async moderate(voteId, moderateData) {
    try {
      const response = await this.api.put(`/${voteId}/moderate`, moderateData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return new Error(error.response.data.message || error.response.data.error || 'Có lỗi xảy ra');
    }
    return new Error('Không thể kết nối đến server');
  }
}

export default new VoteService(); 