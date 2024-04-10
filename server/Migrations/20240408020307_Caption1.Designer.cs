﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using server.Models;

#nullable disable

namespace server.Migrations
{
    [DbContext(typeof(AacSargikDbContext))]
    [Migration("20240408020307_Caption1")]
    partial class Caption1
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .UseCollation("utf8mb4_0900_ai_ci")
                .HasAnnotation("ProductVersion", "7.0.16")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.HasCharSet(modelBuilder, "utf8mb4");

            modelBuilder.Entity("server.Models.BoundingBox", b =>
                {
                    b.Property<int>("BoundingBoxId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("bounding_box_id");

                    b.Property<int>("ImageId")
                        .HasColumnType("int")
                        .HasColumnName("image_id");

                    b.Property<string>("Label")
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)")
                        .HasColumnName("label");

                    b.Property<string>("Message")
                        .HasColumnType("text")
                        .HasColumnName("message");

                    b.Property<int>("XMax")
                        .HasColumnType("int")
                        .HasColumnName("x_max");

                    b.Property<int>("XMin")
                        .HasColumnType("int")
                        .HasColumnName("x_min");

                    b.Property<int>("YMax")
                        .HasColumnType("int")
                        .HasColumnName("y_max");

                    b.Property<int>("YMin")
                        .HasColumnType("int")
                        .HasColumnName("y_min");

                    b.HasKey("BoundingBoxId")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "ImageId" }, "image_id");

                    b.ToTable("bounding_boxes", (string)null);
                });

            modelBuilder.Entity("server.Models.Image", b =>
                {
                    b.Property<int>("ImageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("image_id");

                    b.Property<string>("Caption")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("Id")
                        .HasColumnType("int")
                        .HasColumnName("id");

                    b.Property<int?>("ImageHeight")
                        .HasColumnType("int")
                        .HasColumnName("image_height");

                    b.Property<string>("ImageUri")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("image_uri");

                    b.Property<int?>("ImageWidth")
                        .HasColumnType("int")
                        .HasColumnName("image_width");

                    b.HasKey("ImageId")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "Id" }, "id");

                    b.ToTable("images", (string)null);
                });

            modelBuilder.Entity("server.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("varchar(255)")
                        .HasColumnName("email");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)")
                        .HasColumnName("first_name");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)")
                        .HasColumnName("last_name");

                    b.Property<string>("ProfilePictureUri")
                        .HasColumnType("text")
                        .HasColumnName("profile_picture_uri");

                    b.Property<string>("UserGoogleId")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)")
                        .HasColumnName("user_google_id");

                    b.HasKey("Id")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "Email" }, "email")
                        .IsUnique();

                    b.ToTable("users", (string)null);
                });

            modelBuilder.Entity("server.Models.BoundingBox", b =>
                {
                    b.HasOne("server.Models.Image", "Image")
                        .WithMany("BoundingBoxes")
                        .HasForeignKey("ImageId")
                        .IsRequired()
                        .HasConstraintName("bounding_boxes_ibfk_1");

                    b.Navigation("Image");
                });

            modelBuilder.Entity("server.Models.Image", b =>
                {
                    b.HasOne("server.Models.User", "IdNavigation")
                        .WithMany("Images")
                        .HasForeignKey("Id")
                        .IsRequired()
                        .HasConstraintName("images_ibfk_1");

                    b.Navigation("IdNavigation");
                });

            modelBuilder.Entity("server.Models.Image", b =>
                {
                    b.Navigation("BoundingBoxes");
                });

            modelBuilder.Entity("server.Models.User", b =>
                {
                    b.Navigation("Images");
                });
#pragma warning restore 612, 618
        }
    }
}
