﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace BookingTicketSysten.Models;

public partial class BookedSeat
{
    public int BookedSeatId { get; set; }

    public int BookingId { get; set; }

    public int SeatId { get; set; }

    public int ShowId { get; set; }

    public virtual Booking Booking { get; set; }

    public virtual Seat Seat { get; set; }

    public virtual Show Show { get; set; }
}