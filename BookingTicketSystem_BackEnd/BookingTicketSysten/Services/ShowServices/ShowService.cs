using BookingTicketSysten.Models;
using BookingTicketSysten.Models.DTOs.ShowDTOS;
using Microsoft.EntityFrameworkCore;

namespace BookingTicketSysten.Services.ShowServices
{
    public class ShowService : IShowService
    {
        private readonly MovieTicketBookingSystemContext _context;

        public ShowService(MovieTicketBookingSystemContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ShowDto>> GetAllShowsAsync()
        {
            return await _context.Shows
                .Include(s => s.Movie)
                .Include(s => s.Hall)
                .Select(s => new ShowDto
                {
                    ShowId = s.ShowId,
                    MovieId = s.MovieId,
                    MovieTitle = s.Movie.Title,
                    HallId = s.HallId,
                    HallName = s.Hall.Name,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    TicketPrice = s.TicketPrice
                }).ToListAsync();
        }

        public async Task<ShowDto?> GetShowByIdAsync(int id)
        {
            var s = await _context.Shows
                .Include(s => s.Movie)
                .Include(s => s.Hall)
                .FirstOrDefaultAsync(s => s.ShowId == id);

            if (s == null) return null;

            return new ShowDto
            {
                ShowId = s.ShowId,
                MovieId = s.MovieId,
                MovieTitle = s.Movie.Title,
                HallId = s.HallId,
                HallName = s.Hall.Name,
                StartTime = s.StartTime,
                EndTime = s.EndTime,
                TicketPrice = s.TicketPrice
            };
        }

        public async Task<ShowDto> CreateShowAsync(CreateShowDto dto)
        {
            var show = new Show
            {
                MovieId = dto.MovieId,
                HallId = dto.HallId,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                TicketPrice = dto.TicketPrice,
                CreatedAt = DateTime.Now
            };

            _context.Shows.Add(show);
            await _context.SaveChangesAsync();

            return await GetShowByIdAsync(show.ShowId);
        }

        public async Task<bool> UpdateShowAsync(int id, CreateShowDto dto)
        {
            var show = await _context.Shows.FindAsync(id);
            if (show == null) return false;

            show.MovieId = dto.MovieId;
            show.HallId = dto.HallId;
            show.StartTime = dto.StartTime;
            show.EndTime = dto.EndTime;
            show.TicketPrice = dto.TicketPrice;
            show.ModifiedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteShowAsync(int id)
        {
            var show = await _context.Shows.FindAsync(id);
            if (show == null) return false;

            _context.Shows.Remove(show);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}