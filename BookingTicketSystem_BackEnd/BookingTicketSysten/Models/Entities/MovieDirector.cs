﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace BookingTicketSysten.Models;

public partial class MovieDirector
{
    public int MovieDirectorId { get; set; }

    public int MovieId { get; set; }

    public int PersonId { get; set; }

    public virtual Movie Movie { get; set; }

    public virtual Person Person { get; set; }
}