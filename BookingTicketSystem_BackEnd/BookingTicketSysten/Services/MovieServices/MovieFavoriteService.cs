using BookingTicketSysten.Models;
using BookingTicketSysten.Models.DTOs.MovieFavoriteDTOs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookingTicketSysten.Services.MovieServices
{
    public class MovieFavoriteService : IMovieFavoriteService
    {
        private readonly MovieTicketBookingSystemContext _context;
        public MovieFavoriteService(MovieTicketBookingSystemContext context)
        {
            _context = context;
        }
        public async Task<MovieFavoriteDto> AddFavoriteAsync(MovieFavoriteCreateDto dto)
        {
            var favorite = await _context.MovieFavorites.FirstOrDefaultAsync(f => f.UserId == dto.UserId && f.MovieId == dto.MovieId);
            if (favorite == null)
            {
                favorite = new MovieFavorite
                {
                    UserId = dto.UserId,
                    MovieId = dto.MovieId,
                    FavoriteTime = DateTime.UtcNow
                };
                _context.MovieFavorites.Add(favorite);
                await _context.SaveChangesAsync();
            }
            else
            {
                favorite.FavoriteTime = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
            return MapToDto(favorite);
        }
        public async Task<bool> RemoveFavoriteAsync(int userId, int movieId)
        {
            var favorite = await _context.MovieFavorites.FirstOrDefaultAsync(f => f.UserId == userId && f.MovieId == movieId);
            if (favorite == null) return false;
            _context.MovieFavorites.Remove(favorite);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> RemoveFavoriteByIdAsync(int movieFavoriteId)
        {
            var favorite = await _context.MovieFavorites.FindAsync(movieFavoriteId);
            if (favorite == null) return false;
            _context.MovieFavorites.Remove(favorite);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> CheckFavoriteAsync(int userId, int movieId)
        {
            return await _context.MovieFavorites.AnyAsync(f => f.UserId == userId && f.MovieId == movieId);
        }
        public async Task<IEnumerable<MovieFavoriteDto>> GetFavoritesByUserAsync(int userId)
        {
            var favorites = await _context.MovieFavorites.Where(f => f.UserId == userId).ToListAsync();
            return favorites.Select(MapToDto);
        }
        public async Task<int> GetFavoriteCountByMovieAsync(int movieId)
        {
            return await _context.MovieFavorites.CountAsync(f => f.MovieId == movieId);
        }
        public async Task<IEnumerable<MovieFavoriteTopDto>> GetTopFavoritesAsync(int limit, DateTime? fromDate, DateTime? toDate)
        {
            var query = _context.MovieFavorites.AsQueryable();
            if (fromDate.HasValue) query = query.Where(f => f.FavoriteTime >= fromDate);
            if (toDate.HasValue) query = query.Where(f => f.FavoriteTime <= toDate);
            var top = await query.GroupBy(f => f.MovieId)
                .Select(g => new { MovieId = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Take(limit)
                .ToListAsync();
            var movieIds = top.Select(x => x.MovieId).ToList();
            var movies = await _context.Movies.Where(m => movieIds.Contains(m.MovieId)).ToListAsync();
            return top.Select(x => new MovieFavoriteTopDto
            {
                MovieId = x.MovieId,
                MovieTitle = movies.FirstOrDefault(m => m.MovieId == x.MovieId)?.Title ?? "",
                FavoriteCount = x.Count
            });
        }
        public async Task<IEnumerable<MovieFavoriteDto>> GetAllFavoritesAsync(int? userId, int? movieId, DateTime? fromDate, DateTime? toDate, string sort)
        {
            var query = _context.MovieFavorites.AsQueryable();
            if (userId.HasValue) query = query.Where(f => f.UserId == userId);
            if (movieId.HasValue) query = query.Where(f => f.MovieId == movieId);
            if (fromDate.HasValue) query = query.Where(f => f.FavoriteTime >= fromDate);
            if (toDate.HasValue) query = query.Where(f => f.FavoriteTime <= toDate);
            if (sort == "latest") query = query.OrderByDescending(f => f.FavoriteTime);
            else if (sort == "most_favorited")
            {
                // Sắp xếp theo số lượng yêu thích của phim
                query = query.OrderByDescending(f => _context.MovieFavorites.Count(x => x.MovieId == f.MovieId));
            }
            var favorites = await query.ToListAsync();
            return favorites.Select(MapToDto);
        }
        private static MovieFavoriteDto MapToDto(MovieFavorite favorite)
        {
            return new MovieFavoriteDto
            {
                MovieFavoriteId = favorite.MovieFavoriteId,
                UserId = favorite.UserId,
                MovieId = favorite.MovieId,
                FavoriteTime = favorite.FavoriteTime
            };
        }
    }
} 