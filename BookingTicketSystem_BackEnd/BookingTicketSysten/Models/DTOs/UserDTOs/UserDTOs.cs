namespace BookingTicketSysten.Models.DTOs.UserDTOs
{
    public class UserDisplayDTOs()
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public decimal? LoyaltyPoints { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool? IsActive { get; set; }
    }
}
