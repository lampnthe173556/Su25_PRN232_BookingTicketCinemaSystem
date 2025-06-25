using BookingTicketSysten.Models.DTOs.CinemaHallDTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingTicketSysten.Services.CinemaHallServices
{
    public interface ICinemaHallService
    {
        Task<List<CinemaHallDto>> GetAllCinemaHallsWithSeatsAsync();
        Task<CinemaHallDto?> GetCinemaHallByIdAsync(int hallId);
    }
}
