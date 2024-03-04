using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Image
{
    public int ImageId { get; set; }

    public int UserId { get; set; }

    public string ImageUri { get; set; } = null!;

    public int? ImageWidth { get; set; }

    public int? ImageHeight { get; set; }

    public virtual ICollection<BoundingBox> BoundingBoxes { get; set; } = new List<BoundingBox>();

    public virtual User User { get; set; } = null!;
}
