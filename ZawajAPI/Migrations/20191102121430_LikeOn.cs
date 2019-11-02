using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ZawajAPI.Migrations
{
    public partial class LikeOn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LikeOn",
                table: "Like",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "ReadOn",
                table: "Like",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LikeOn",
                table: "Like");

            migrationBuilder.DropColumn(
                name: "ReadOn",
                table: "Like");
        }
    }
}
