using BookingTicketSysten.Models;
using BookingTicketSysten.Services.StoreService;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;
using BookingTicketSysten.Models.DTOs.PersonDTOs;

namespace BookingTicketSysten.Services.PersonServices
{
    public class PersonService : IPersonService
    {
        private readonly MovieTicketBookingSystemContext _context;
        private readonly IStorageService _storageService;
        public PersonService(MovieTicketBookingSystemContext context, IStorageService storageService)
        {
            _context = context;
            _storageService = storageService;
        }
        public async Task<IEnumerable<PersonDto>> GetAllAsync()
        {
            var people = await _context.People.ToListAsync();
            return people.Select(p => new PersonDto
            {
                PersonId = p.PersonId,
                Name = p.Name,
                DateOfBirth = p.DateOfBirth,
                Biography = p.Biography,
                Nationality = p.Nationality,
                PhotoUrl = p.PhotoUrl
            });
        }
        public async Task<PersonDto?> GetByIdAsync(int id)
        {
            var p = await _context.People.FindAsync(id);
            if (p == null) return null;
            return new PersonDto
            {
                PersonId = p.PersonId,
                Name = p.Name,
                DateOfBirth = p.DateOfBirth,
                Biography = p.Biography,
                Nationality = p.Nationality,
                PhotoUrl = p.PhotoUrl
            };
        }
        public async Task<PersonDto> CreateAsync(PersonCreateUpdateDto dto)
        {
            if (await _context.People.AnyAsync(x => x.Name == dto.Name && x.DateOfBirth == dto.DateOfBirth))
                throw new Exception("Người này đã tồn tại!");
            var person = new Person
            {
                Name = dto.Name,
                DateOfBirth = dto.DateOfBirth,
                Biography = dto.Biography,
                Nationality = dto.Nationality,
                CreatedAt = DateTime.UtcNow
            };
            if (dto.Photo != null)
            {
                var url = await _storageService.UploadFileAsync(dto.Photo);
                person.PhotoUrl = url;
            }
            _context.People.Add(person);
            await _context.SaveChangesAsync();
            return new PersonDto
            {
                PersonId = person.PersonId,
                Name = person.Name,
                DateOfBirth = person.DateOfBirth,
                Biography = person.Biography,
                Nationality = person.Nationality,
                PhotoUrl = person.PhotoUrl
            };
        }
        public async Task<PersonDto?> UpdateAsync(int id, PersonCreateUpdateDto dto)
        {
            var existing = await _context.People.FindAsync(id);
            if (existing == null) return null;
            if (await _context.People.AnyAsync(x => x.Name == dto.Name && x.DateOfBirth == dto.DateOfBirth && x.PersonId != id))
                throw new Exception("Người này đã tồn tại!");
            existing.Name = dto.Name;
            existing.DateOfBirth = dto.DateOfBirth;
            existing.Biography = dto.Biography;
            existing.Nationality = dto.Nationality;
            if (dto.Photo != null)
            {
                var url = await _storageService.UploadFileAsync(dto.Photo);
                existing.PhotoUrl = url;
            }
            existing.ModifiedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return new PersonDto
            {
                PersonId = existing.PersonId,
                Name = existing.Name,
                DateOfBirth = existing.DateOfBirth,
                Biography = existing.Biography,
                Nationality = existing.Nationality,
                PhotoUrl = existing.PhotoUrl
            };
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var person = await _context.People.Include(p => p.MovieActors).Include(p => p.MovieDirectors).FirstOrDefaultAsync(p => p.PersonId == id);
            if (person == null) return false;
            if (person.MovieActors.Any() || person.MovieDirectors.Any())
                throw new Exception("Không thể xóa người này vì đang liên kết với phim!");
            _context.People.Remove(person);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}