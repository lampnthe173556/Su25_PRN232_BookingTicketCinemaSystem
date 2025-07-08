import axios from 'axios';
import { API_BASE_URL } from '../config/api';

class MovieFavoriteService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/MovieFavorite`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getTop(limit = 10) {
    try {
      const response = await this.api.get(`/top?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy top phim yêu thích');
    }
  }

  async getFavoritesByUser(userId) {
    try {
      const response = await this.api.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách phim yêu thích');
    }
  }

  async addFavorite(userId, movieId) {
    try {
      const response = await this.api.post('', { userId, movieId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể thêm vào yêu thích');
    }
  }

  async removeFavorite(userId, movieId) {
    try {
      const response = await this.api.delete('', { params: { userId, movieId } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể xóa khỏi yêu thích');
    }
  }

  async checkFavorite(userId, movieId) {
    try {
      const response = await this.api.get(`/check`, { params: { userId, movieId } });
      return response.data.isFavorite;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể kiểm tra trạng thái yêu thích');
    }
  }
}

export default new MovieFavoriteService(); 