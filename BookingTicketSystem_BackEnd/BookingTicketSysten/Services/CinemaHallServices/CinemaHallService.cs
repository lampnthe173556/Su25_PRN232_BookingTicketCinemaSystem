
using BookingTicketSysten.Models;
using BookingTicketSysten.Models.DTOs.CinemaHallDTO;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingTicketSysten.Services.CinemaHallServices
{
    public class CinemaHallService : ICinemaHallService
    {
        private readonly MovieTicketBookingSystemContext _context;

        public CinemaHallService(MovieTicketBookingSystemContext context)
        {
            _context = context;
        }

        public async Task<List<CinemaHallDto>> GetAllCinemaHallsWithSeatsAsync()
        {
            return await _context.CinemaHalls
                .Include(h => h.Seats)
                .Select(h => new CinemaHallDto
                {
                    CinemaId = h.CinemaId,
                    Name = h.Name,
                    TotalSeats = h.TotalSeats,
                    CreatedAt = h.CreatedAt,
                    ModifiedAt = h.ModifiedAt,
                    Seats = h.Seats.Select(s => new SeatDto
                    {
                        SeatId = s.SeatId,
                        RowNumber = s.RowNumber,
                        ColumnNumber = s.ColumnNumber,
                        SeatType = s.SeatType
                    }).ToList()
                })
                .ToListAsync();
        }

        public async Task<CinemaHallDto?> GetCinemaHallByIdAsync(int hallId)
        {
            var hall = await _context.CinemaHalls
                .Include(h => h.Seats)
                .FirstOrDefaultAsync(h => h.HallId == hallId);

            if (hall == null)
                return null;

            return new CinemaHallDto
            {
                CinemaId = hall.CinemaId,
                Name = hall.Name,
                TotalSeats = hall.TotalSeats,
                CreatedAt = hall.CreatedAt,
                ModifiedAt = hall.ModifiedAt,
                Seats = hall.Seats.Select(s => new SeatDto
                {
                    SeatId = s.SeatId,
                    RowNumber = s.RowNumber,
                    ColumnNumber = s.ColumnNumber,
                    SeatType = s.SeatType
                }).ToList()
            };
        }

    }
}
