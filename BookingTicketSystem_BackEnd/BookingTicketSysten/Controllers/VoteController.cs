using BookingTicketSysten.Models.DTOs.VoteDTOs;
using BookingTicketSysten.Services.VoteServices;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace BookingTicketSysten.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VoteController : ControllerBase
    {
        private readonly IVoteService _voteService;
        public VoteController(IVoteService voteService)
        {
            _voteService = voteService;
        }
        // 1.1. Gửi đánh giá cho phim (tạo hoặc cập nhật)
        [HttpPost]
        public async Task<IActionResult> CreateOrUpdate([FromBody] VoteCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _voteService.CreateOrUpdateVoteAsync(dto);
            return Ok(result);
        }
        // 1.2. Lấy danh sách đánh giá phim theo phim
        [HttpGet("movie/{movieId}")]
        public async Task<IActionResult> GetVotesByMovie(int movieId)
        {
            var result = await _voteService.GetVotesByMovieAsync(movieId);
            return Ok(result);
        }
        // 1.3. Lấy đánh giá của 1 người dùng cho 1 phim
        [HttpGet("user/{userId}/movie/{movieId}")]
        public async Task<IActionResult> GetVoteByUserAndMovie(int userId, int movieId)
        {
            var result = await _voteService.GetVoteByUserAndMovieAsync(userId, movieId);
            if (result == null) return NotFound();
            return Ok(result);
        }
        // 1.4. Cập nhật vote phim
        [HttpPut("{voteId}")]
        public async Task<IActionResult> Update(int voteId, [FromBody] VoteCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _voteService.UpdateVoteAsync(voteId, dto);
            if (result == null) return NotFound();
            return Ok(result);
        }
        // 1.5. Xoá vote phim
        [HttpDelete("{voteId}")]
        public async Task<IActionResult> Delete(int voteId)
        {
            var success = await _voteService.DeleteVoteAsync(voteId);
            if (!success) return NotFound();
            return Ok();
        }
        // 2.1. Thống kê rating theo mức sao
        [HttpGet("movie/{movieId}/stats")]
        public async Task<IActionResult> GetMovieVoteStats(int movieId)
        {
            var result = await _voteService.GetMovieVoteStatsAsync(movieId);
            return Ok(result);
        }
        // API quản trị: Lấy tất cả votes với filter
        [HttpGet("all")]
        public async Task<IActionResult> GetAll([FromQuery] int? movieId, [FromQuery] int? userId, [FromQuery] int? minRating, [FromQuery] int? maxRating, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
        {
            var result = await _voteService.GetAllVotesAsync(movieId, userId, minRating, maxRating, fromDate, toDate);
            return Ok(result);
        }
        // API quản trị: Phê duyệt hoặc gắn cờ đánh giá (dummy, không làm gì)
        [HttpPut("{voteId}/moderate")]
        public async Task<IActionResult> Moderate(int voteId, [FromBody] VoteModerateDto dto)
        {
            var success = await _voteService.ModerateVoteAsync(voteId, dto);
            if (!success) return NotFound();
            return Ok();
        }
    }
} 