using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Image
{
    public int ImageId { get; set; }

    public int Id { get; set; } // Reprents the user ID with the corresponding image

    public string ImageUri { get; set; } = null!;

    public int? ImageWidth { get; set; }

    public int? ImageHeight { get; set; }

    public string Caption { get; set; } = null!;

    public virtual ICollection<BoundingBox> BoundingBoxes { get; set; } = new List<BoundingBox>();

    public virtual User IdNavigation { get; set; } = null!;
}
