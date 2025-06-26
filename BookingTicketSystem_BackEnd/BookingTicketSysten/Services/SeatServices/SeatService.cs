using BookingTicketSysten.Models;
using BookingTicketSysten.Models.DTOs.SeatDTOs;
using Microsoft.EntityFrameworkCore;

namespace BookingTicketSysten.Services.SeatServices
{
    public class SeatService : ISeatService
    {
        private readonly MovieTicketBookingSystemContext _context;

        public SeatService(MovieTicketBookingSystemContext context)
        {
            _context = context;
        }

        public async Task<List<SeatDto>> GetAllSeatsAsync()
        {
            return await _context.Seats
                .Select(s => new SeatDto
                {
                    SeatId = s.SeatId,
                    HallId = s.HallId,
                    RowNumber = s.RowNumber,
                    ColumnNumber = s.ColumnNumber,
                    SeatType = s.SeatType
                })
                .ToListAsync();
        }

        public async Task<SeatDto?> GetSeatByIdAsync(int seatId)
        {
            var seat = await _context.Seats.FirstOrDefaultAsync(s => s.SeatId == seatId);

            if (seat == null) return null;

            return new SeatDto
            {
                SeatId = seat.SeatId,
                HallId = seat.HallId,
                RowNumber = seat.RowNumber,
                ColumnNumber = seat.ColumnNumber,
                SeatType = seat.SeatType
            };
        }

        public async Task<string> CreateSeatAsync(SeatCreateDto dto)
        {
            var cinema = await _context.Cinemas.FindAsync(dto.CinemaId);
            if (cinema == null)
                return "Cinema not found.";

            var hall = await _context.CinemaHalls.FirstOrDefaultAsync(h =>
                h.HallId == dto.HallId && h.CinemaId == dto.CinemaId);

            if (hall == null)
                return "Cinema hall not found or does not belong to the specified cinema.";

            var isDuplicate = await _context.Seats.AnyAsync(s =>
                s.HallId == dto.HallId &&
                s.RowNumber.ToLower() == dto.RowNumber.Trim().ToLower() &&
                s.ColumnNumber == dto.ColumnNumber);

            if (isDuplicate)
                return $"Seat at Row '{dto.RowNumber.ToUpper()}', Column '{dto.ColumnNumber}' already exists.";

            var seat = new Seat
            {
                HallId = dto.HallId,
                RowNumber = dto.RowNumber.Trim().ToUpper(),
                ColumnNumber = dto.ColumnNumber,
                SeatType = dto.SeatType.Trim()
            };

            _context.Seats.Add(seat);
            await _context.SaveChangesAsync();

            return "Seat created successfully.";
        }

        public async Task<string> UpdateSeatAsync(int seatId, SeatUpdateDto dto)
        {
            var seat = await _context.Seats.Include(s => s.Hall).FirstOrDefaultAsync(s => s.SeatId == seatId);
            if (seat == null)
                return "Seat not found.";

            var normalizedRow = dto.RowNumber?.Trim().ToLower();

            var isDuplicate = await _context.Seats.AnyAsync(s =>
                s.HallId == seat.HallId &&
                s.RowNumber.ToLower() == normalizedRow &&
                s.ColumnNumber == dto.ColumnNumber &&
                s.SeatId != seatId);

            if (isDuplicate)
                return $"Another seat already exists at Row '{dto.RowNumber}', Column '{dto.ColumnNumber}'.";

            seat.RowNumber = dto.RowNumber.Trim().ToUpper();
            seat.ColumnNumber = dto.ColumnNumber;
            seat.SeatType = dto.SeatType.Trim();

            _context.Seats.Update(seat);
            await _context.SaveChangesAsync();

            return "Seat updated successfully.";
        }

        public async Task<string> DeleteSeatAsync(int seatId)
        {
            var seat = await _context.Seats.FindAsync(seatId);
            if (seat == null)
                return "Seat not found.";

            _context.Seats.Remove(seat);
            await _context.SaveChangesAsync();

            return "Seat deleted successfully.";
        }
    }
}
