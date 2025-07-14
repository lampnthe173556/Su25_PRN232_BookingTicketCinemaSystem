using BookingTicketSysten.Models;
using BookingTicketSysten.Models.DTOs.ShowDTOS;

namespace BookingTicketSysten.Services.ShowServices
{
    public interface IShowService
    {
        Task<IEnumerable<ShowDto>> GetAllShowsAsync();
        Task<ShowDto?> GetShowByIdAsync(int id);
        Task<ShowDto> CreateShowAsync(CreateShowDto dto);
        Task<bool> UpdateShowAsync(int id, CreateShowDto dto);
        Task<bool> DeleteShowAsync(int id);
    }
}