using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace server.Models;

public partial class AacSargikDbContext : DbContext
{
    public AacSargikDbContext()
    {
    }

    public AacSargikDbContext(DbContextOptions<AacSargikDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<BoundingBox> BoundingBoxes { get; set; }

    public virtual DbSet<Image> Images { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        IConfigurationBuilder builder = new ConfigurationBuilder().AddJsonFile("appsettings.json", optional: false);
        IConfiguration configuration = builder.Build();

        string connectionString = configuration.GetConnectionString("DefaultConnection");
        if (connectionString == null)
        {
            throw new InvalidOperationException("Connection string is null.");
        }

        var serverVersion = Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.34-mysql");

        optionsBuilder.UseMySql(connectionString, serverVersion);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<BoundingBox>(entity =>
        {
            entity.HasKey(e => e.BoundingBoxId).HasName("PRIMARY");

            entity.ToTable("bounding_boxes");

            entity.HasIndex(e => e.ImageId, "image_id");

            entity.Property(e => e.BoundingBoxId).HasColumnName("bounding_box_id");
            entity.Property(e => e.ImageId).HasColumnName("image_id");
            entity.Property(e => e.Label)
                .HasMaxLength(255)
                .HasColumnName("label");
            entity.Property(e => e.Message)
                .HasColumnType("text")
                .HasColumnName("message");
            entity.Property(e => e.XMax).HasColumnName("x_max");
            entity.Property(e => e.XMin).HasColumnName("x_min");
            entity.Property(e => e.YMax).HasColumnName("y_max");
            entity.Property(e => e.YMin).HasColumnName("y_min");

            entity.HasOne(d => d.Image).WithMany(p => p.BoundingBoxes)
                .HasForeignKey(d => d.ImageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("bounding_boxes_ibfk_1");
        });

        modelBuilder.Entity<Image>(entity =>
        {
            entity.HasKey(e => e.ImageId).HasName("PRIMARY");

            entity.ToTable("images");

            entity.HasIndex(e => e.Id, "id");

            entity.Property(e => e.ImageId).HasColumnName("image_id");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ImageHeight).HasColumnName("image_height");
            entity.Property(e => e.ImageUri)
                .HasColumnType("text")
                .HasColumnName("image_uri");
            entity.Property(e => e.ImageWidth).HasColumnName("image_width");

            entity.HasOne(d => d.IdNavigation).WithMany(p => p.Images)
                .HasForeignKey(d => d.Id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("images_ibfk_1");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "email").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(255)
                .HasColumnName("first_name");
            entity.Property(e => e.LastName)
                .HasMaxLength(255)
                .HasColumnName("last_name");
            entity.Property(e => e.ProfilePictureUri)
                .HasColumnType("text")
                .HasColumnName("profile_picture_uri");
            entity.Property(e => e.UserGoogleId)
                .HasMaxLength(255)
                .HasColumnName("user_google_id");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
