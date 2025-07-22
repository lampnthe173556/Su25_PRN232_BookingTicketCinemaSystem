namespace BookingTicketSysten.Models.DTOs.BookingDTOs
{
    public class RevenueStatisticsDto
    {
        public decimal TotalRevenue { get; set; }
        public int TotalBookings { get; set; }
        public decimal AverageRevenue { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class TopMovieDto
    {
        public string MovieTitle { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TicketsSold { get; set; }
    }

    public class TopUserDto
    {
        public string UserName { get; set; }
        public int TicketsBought { get; set; }
        public decimal TotalSpent { get; set; }
    }

    public class DailyRevenueDto
    {
        public string Date { get; set; } // yyyy-MM-dd
        public decimal Revenue { get; set; }
    }
} 