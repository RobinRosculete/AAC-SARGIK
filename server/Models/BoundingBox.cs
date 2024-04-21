using System;
using System.Collections.Generic;

namespace server.Models;

public partial class BoundingBox
{
    public int BoundingBoxId { get; set; }

    public int ImageId { get; set; }

    public float XMin { get; set; }

    public float YMin { get; set; }

    public float XMax { get; set; }

    public float YMax { get; set; }

    public string? Label { get; set; }

    public string? Message { get; set; }

    public virtual Image Image { get; set; } = null!;
}
