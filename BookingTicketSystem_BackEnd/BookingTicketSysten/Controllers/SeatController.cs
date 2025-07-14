using BookingTicketSysten.Models.DTOs.SeatDTOs;
using BookingTicketSysten.Services.SeatServices;
using Microsoft.AspNetCore.Mvc;

namespace BookingTicketSysten.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class SeatController : ControllerBase
    {
        private readonly ISeatService _seatService;

        public SeatController(ISeatService seatService)
        {
            _seatService = seatService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var seats = await _seatService.GetAllSeatsAsync();
            return Ok(seats);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var seat = await _seatService.GetSeatByIdAsync(id);

            if (seat == null)
                return NotFound(new { message = "Seat not found." });

            return Ok(seat);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SeatCreateDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors)
                                              .Select(e => e.ErrorMessage).ToList();
                return BadRequest(new { errors });
            }

            var result = await _seatService.CreateSeatAsync(dto);

            if (result == "Seat created successfully.")
                return Ok(new { message = result });

            return BadRequest(new { error = result });
        }

        [HttpPut("{seatId}")]
        public async Task<IActionResult> UpdateSeat(int seatId, [FromBody] SeatUpdateDto dto)
        {
            var result = await _seatService.UpdateSeatAsync(seatId, dto);
            if (result.Contains("not"))
                return NotFound(result);
            if (result.Contains("exists"))
                return BadRequest(result);

            return Ok(result);
        }

        [HttpDelete("{seatId}")]
        public async Task<IActionResult> DeleteSeat(int seatId)
        {
            var result = await _seatService.DeleteSeatAsync(seatId);

            if (result == "Seat not found.")
                return NotFound(result);

            return Ok(result);
        }
    }
}
