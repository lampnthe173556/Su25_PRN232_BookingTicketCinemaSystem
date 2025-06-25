using System;
using System.ComponentModel.DataAnnotations;

namespace BookingTicketSysten.Models.DTOs.CinemaDTOs
{
    public class CinemaCreateUpdateDto
    {
        [Required(ErrorMessage = "Cinema name is required.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Address is required.")]
        public string Address { get; set; }

        [Required(ErrorMessage = "City name is required.")]
        [ValidCityName]
        public string CityName { get; set; } 

        [Required(ErrorMessage = "Contact number is required.")]
        [RegularExpression(@"^0\d{9}$", ErrorMessage = "Contact number must have exactly 10 digits and start with 0.")]
        public string ContactInfo { get; set; }


    }

    public class ValidCityNameAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var db = (MovieTicketBookingSystemContext)validationContext.GetService(typeof(MovieTicketBookingSystemContext));
            var cityName = value as string;

            string normalized = cityName.Trim().ToLower();

            var exists = db.Cities
                .AsQueryable()
                .Any(c => c.Name.ToLower() == normalized);

            if (!exists)
            {
                return new ValidationResult("City name does not exist in the system.");
            }

            return ValidationResult.Success;
        }
    }
}
