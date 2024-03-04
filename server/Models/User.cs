using System;
using System.Collections.Generic;

namespace server.Models;

public partial class User
{
    public int UserId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? ProfilePictureUri { get; set; }

    public virtual ICollection<Image> Images { get; set; } = new List<Image>();
}
