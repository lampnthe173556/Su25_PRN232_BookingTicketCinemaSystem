using BookingTicketSysten.Models.DTOs;
using BookingTicketSysten.Models.DTOs.PersonDTOs;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingTicketSysten.Services.PersonServices
{
    public interface IPersonService
    {
        Task<IEnumerable<PersonDto>> GetAllAsync();
        Task<PersonDto?> GetByIdAsync(int id);
        Task<PersonDto> CreateAsync(PersonCreateUpdateDto dto);
        Task<PersonDto?> UpdateAsync(int id, PersonCreateUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}