import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

class CommentService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}${API_ENDPOINTS.COMMENTS}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async create(commentData) {
    try {
      const response = await this.api.post('/', commentData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByMovie(movieId, options = {}) {
    try {
      const { page = 1, pageSize = 10, sort = 'newest', includeReplies = true, approvedOnly = true, isAdmin = false } = options;
      const response = await this.api.get(`/movie/${movieId}`, {
        params: { page, pageSize, sort, includeReplies, approvedOnly, isAdmin }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(commentId, userId, commentData, isAdmin = false) {
    try {
      const response = await this.api.put(`/${commentId}`, commentData, {
        params: { userId, isAdmin }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(commentId, userId, isAdmin = false) {
    try {
      await this.api.delete(`/${commentId}`, {
        params: { userId, isAdmin }
      });
      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async approve(commentId) {
    try {
      await this.api.put(`/admin/comments/${commentId}/approve`);
      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAllAdmin(filters = {}) {
    try {
      const { userId, movieId, isApproved, fromDate, toDate, sort = 'newest' } = filters;
      const response = await this.api.get('/admin/comments', {
        params: { userId, movieId, isApproved, fromDate, toDate, sort }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getByUser(userId) {
    try {
      const response = await this.api.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCountByMovie(movieId) {
    try {
      const response = await this.api.get(`/movie/${movieId}/count`);
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

export default new CommentService(); 