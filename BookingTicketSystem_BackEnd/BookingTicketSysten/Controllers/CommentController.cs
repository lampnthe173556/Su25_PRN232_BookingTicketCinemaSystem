using BookingTicketSysten.Models.DTOs.CommentDTOs;
using BookingTicketSysten.Services.CommentServices;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace BookingTicketSysten.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _service;
        public CommentController(ICommentService service)
        {
            _service = service;
        }
        // 1. Thêm bình luận mới
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CommentCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _service.AddCommentAsync(dto);
            return Ok(result);
        }
        // 2. Lấy danh sách bình luận của một phim
        [HttpGet("movie/{movieId}")]
        public async Task<IActionResult> GetByMovie(int movieId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string sort = "newest", [FromQuery] bool includeReplies = true, [FromQuery] bool approvedOnly = true, [FromQuery] bool isAdmin = false)
        {
            var result = await _service.GetCommentsByMovieAsync(movieId, page, pageSize, sort, includeReplies, approvedOnly, isAdmin);
            return Ok(result);
        }
        // 3. Sửa bình luận
        [HttpPut("{commentId}")]
        public async Task<IActionResult> Update(int commentId, [FromQuery] int userId, [FromBody] CommentUpdateDto dto, [FromQuery] bool isAdmin = false)
        {
            var result = await _service.UpdateCommentAsync(commentId, userId, dto, isAdmin);
            if (result == null) return Forbid();
            return Ok(result);
        }
        // 4. Xoá bình luận (xoá mềm)
        [HttpDelete("{commentId}")]
        public async Task<IActionResult> Delete(int commentId, [FromQuery] int userId, [FromQuery] bool isAdmin = false)
        {
            var success = await _service.DeleteCommentAsync(commentId, userId, isAdmin);
            if (!success) return Forbid();
            return Ok();
        }
        // 5. Admin: Duyệt bình luận
        [HttpPut("/api/admin/comments/{commentId}/approve")]
        public async Task<IActionResult> Approve(int commentId)
        {
            var success = await _service.ApproveCommentAsync(commentId);
            if (!success) return NotFound();
            return Ok();
        }
        // 6. Admin: Lấy danh sách tất cả bình luận
        [HttpGet("/api/admin/comments")]
        public async Task<IActionResult> GetAllAdmin([FromQuery] int? userId, [FromQuery] int? movieId, [FromQuery] bool? isApproved, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate, [FromQuery] string sort = "newest")
        {
            var filter = new CommentAdminFilterDto { UserId = userId, MovieId = movieId, IsApproved = isApproved, FromDate = fromDate, ToDate = toDate, Sort = sort };
            var result = await _service.GetAllCommentsAdminAsync(filter);
            return Ok(result);
        }
        // 7. Lấy danh sách bình luận của một người dùng
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var result = await _service.GetCommentsByUserAsync(userId);
            return Ok(result);
        }
        // 8. Thống kê số lượng bình luận của phim
        [HttpGet("movie/{movieId}/count")]
        public async Task<IActionResult> GetCountByMovie(int movieId)
        {
            var count = await _service.GetCommentCountByMovieAsync(movieId);
            return Ok(new { movieId, count });
        }
    }
} 