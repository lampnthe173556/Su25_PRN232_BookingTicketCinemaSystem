using BookingTicketSysten.Models;
using BookingTicketSysten.Models.DTOs.BookingDTOs;
using BookingTicketSysten.Services.BookingServices;
using Microsoft.AspNetCore.Mvc;

namespace BookingTicketSysten.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : Controller
    {
        private readonly IBookingService _bookingService;

        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _bookingService.GetAllBookingsAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            return booking == null ? NotFound() : Ok(booking);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBookingDto dto)
        {
            var created = await _bookingService.CreateBookingAsync(dto);
            return created == null ? BadRequest("Seat unavailable or invalid data.") : Ok(created);
        }

        [HttpPut("cancel/{id}")]
        public async Task<IActionResult> Cancel(int id)
        {
            var result = await _bookingService.CancelBookingAsync(id);
            return result ? Ok("Cancelled.") : NotFound();
        }
    }
}