
using AutoMapper;
using BookingTicketSysten.Models.DTOs.BookingDTOs;
using BookingTicketSysten.Models.DTOs.ShowDTOS;
using BookingTicketSysten.Models;

namespace BookingTicketSysten.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Show Mapping
            CreateMap<Show, ShowDto>()
                .ForMember(dest => dest.MovieTitle, opt => opt.MapFrom(src => src.Movie.Title))
                .ForMember(dest => dest.HallName, opt => opt.MapFrom(src => src.Hall.Name));

            CreateMap<CreateShowDto, Show>();

            // Booking Mapping
            CreateMap<Booking, BookingDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.Name))
                .ForMember(dest => dest.MovieTitle, opt => opt.MapFrom(src => src.Show.Movie.Title))
                .ForMember(dest => dest.ShowStartTime, opt => opt.MapFrom(src => src.Show.StartTime))
                .ForMember(dest => dest.ShowDate, opt => opt.MapFrom(src => src.Show.ShowDate))
                .ForMember(dest => dest.Seats, opt => opt.MapFrom(src => src.BookedSeats.Select(bs => bs.Seat)));

            CreateMap<CreateBookingDto, Booking>();

            // Seat mapping to SeatInfoDto (used inside BookingDto)
            CreateMap<Seat, SeatInfoDto>();

            // User mapping
            CreateMap<User, BookingTicketSysten.Models.DTOs.UserDTOs.UserDisplayDTOs>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.RoleId))
                .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Role != null ? src.Role.RoleName : null));
        }
    }
}