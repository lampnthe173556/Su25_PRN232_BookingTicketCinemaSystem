using BookingTicketSysten.Models.DTOs.MovieFavoriteDTOs;
using BookingTicketSysten.Services.MovieServices;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace BookingTicketSysten.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieFavoriteController : ControllerBase
    {
        private readonly IMovieFavoriteService _service;
        public MovieFavoriteController(IMovieFavoriteService service)
        {
            _service = service;
        }
        // 1. Thêm phim vào danh sách yêu thích
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] MovieFavoriteCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _service.AddFavoriteAsync(dto);
            return Ok(result);
        }
        // 2. Xoá phim khỏi danh sách yêu thích (theo userId, movieId)
        [HttpDelete]
        public async Task<IActionResult> Remove([FromQuery] int userId, [FromQuery] int movieId)
        {
            var success = await _service.RemoveFavoriteAsync(userId, movieId);
            if (!success) return NotFound();
            return Ok();
        }
        // Xoá theo MovieFavoriteId (tuỳ chọn)
        [HttpDelete("by-id/{movieFavoriteId}")]
        public async Task<IActionResult> RemoveById(int movieFavoriteId)
        {
            var success = await _service.RemoveFavoriteByIdAsync(movieFavoriteId);
            if (!success) return NotFound();
            return Ok();
        }
        // 3. Kiểm tra một phim có nằm trong danh sách yêu thích của người dùng hay không
        [HttpGet("check")]
        public async Task<IActionResult> Check([FromQuery] int userId, [FromQuery] int movieId)
        {
            var isFavorite = await _service.CheckFavoriteAsync(userId, movieId);
            return Ok(new { isFavorite });
        }
        // 4. Lấy danh sách phim yêu thích của người dùng
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var result = await _service.GetFavoritesByUserAsync(userId);
            return Ok(result);
        }
        // 5. Lấy số lượng người yêu thích một phim
        [HttpGet("movie/{movieId}/count")]
        public async Task<IActionResult> GetCountByMovie(int movieId)
        {
            var count = await _service.GetFavoriteCountByMovieAsync(movieId);
            return Ok(new { movieId, count });
        }
        // 6. Thống kê phim được yêu thích nhiều nhất
        [HttpGet("top")]
        public async Task<IActionResult> GetTop([FromQuery] int limit = 10, [FromQuery] DateTime? fromDate = null, [FromQuery] DateTime? toDate = null)
        {
            var result = await _service.GetTopFavoritesAsync(limit, fromDate, toDate);
            return Ok(result);
        }
        // 7. Admin: Lấy toàn bộ danh sách yêu thích
        [HttpGet("/api/admin/favorites")]
        public async Task<IActionResult> GetAll([FromQuery] int? userId, [FromQuery] int? movieId, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate, [FromQuery] string sort = "latest")
        {
            var result = await _service.GetAllFavoritesAsync(userId, movieId, fromDate, toDate, sort);
            return Ok(result);
        }
    }
} 