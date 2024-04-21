using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class ChangeBoundingBoxDataTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "y_min",
                table: "bounding_boxes",
                type: "float",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<float>(
                name: "y_max",
                table: "bounding_boxes",
                type: "float",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<float>(
                name: "x_min",
                table: "bounding_boxes",
                type: "float",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<float>(
                name: "x_max",
                table: "bounding_boxes",
                type: "float",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "y_min",
                table: "bounding_boxes",
                type: "int",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "float");

            migrationBuilder.AlterColumn<int>(
                name: "y_max",
                table: "bounding_boxes",
                type: "int",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "float");

            migrationBuilder.AlterColumn<int>(
                name: "x_min",
                table: "bounding_boxes",
                type: "int",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "float");

            migrationBuilder.AlterColumn<int>(
                name: "x_max",
                table: "bounding_boxes",
                type: "int",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "float");
        }
    }
}
