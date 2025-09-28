using System;
using System.Collections.Generic;

namespace CashBackObject.Models;

public partial class Video
{
    public int VideoId { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public string? ImgUrl { get; set; }

    public string? Duration { get; set; }

    public string? Category { get; set; }

    public DateTime? UploadDate { get; set; }

    public int? TotalViews { get; set; }
}
