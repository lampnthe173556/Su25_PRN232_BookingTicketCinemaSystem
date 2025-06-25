
using BookingTicketSysten.Services.CinemaHallServices;
using Microsoft.AspNetCore.Mvc;

namespace BookingTicketSysten.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CinemaHallController : ControllerBase
    {
        private readonly ICinemaHallService _cinemaHallService;

        public CinemaHallController(ICinemaHallService cinemaHallService)
        {
            _cinemaHallService = cinemaHallService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllWithSeats()
        {
            var result = await _cinemaHallService.GetAllCinemaHallsWithSeatsAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _cinemaHallService.GetCinemaHallByIdAsync(id);

            if (result == null)
                return NotFound(new { message = "Cinema hall not found." });

            return Ok(result);
        }
    }
}
