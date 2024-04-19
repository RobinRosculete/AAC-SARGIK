using System;
using System.Collections.Generic;

namespace server.Models;

public partial class BoundingBox
{
    public int BoundingBoxId { get; set; }

    public int ImageId { get; set; }

    public int XMin { get; set; }

    public int YMin { get; set; }

    public int XMax { get; set; }

    public int YMax { get; set; }

    public string? Label { get; set; }

    public string? Message { get; set; }

    public virtual Image Image { get; set; } = null!;
}
