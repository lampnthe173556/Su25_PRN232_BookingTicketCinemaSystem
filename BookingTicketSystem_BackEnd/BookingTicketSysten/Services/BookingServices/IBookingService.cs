using BookingTicketSysten.Models;
using BookingTicketSysten.Models.DTOs.BookingDTOs;

namespace BookingTicketSysten.Services.BookingServices
{
    public interface IBookingService
    {
        Task<IEnumerable<BookingDto>> GetAllBookingsAsync();
        Task<BookingDto?> GetBookingByIdAsync(int id);
        Task<BookingDto?> CreateBookingAsync(CreateBookingDto dto);
        Task<bool> CancelBookingAsync(int id);
        Task<IEnumerable<BookingDto>> GetBookingsByUserIdAsync(int userId);
        Task<IEnumerable<BookingDto>> GetBookingsByShowDateAsync(DateOnly date);
        Task<RevenueStatisticsDto> GetRevenueStatisticsAsync(DateTime? fromDate, DateTime? toDate);
        Task<List<DailyRevenueDto>> GetDailyRevenueAsync(DateTime fromDate, DateTime toDate);
        // Dashboard APIs
        Task<IEnumerable<TopMovieDto>> GetTopMoviesAsync(int topN = 5);
        Task<IEnumerable<TopUserDto>> GetTopUsersAsync(int topN = 5);
        Task<IEnumerable<BookingDto>> GetRecentBookingsAsync(int topN = 5);
    }
}
