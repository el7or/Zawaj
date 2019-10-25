using Microsoft.EntityFrameworkCore.Migrations;

namespace ZawajAPI.Migrations
{
    public partial class LikeTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Like",
                columns: table => new
                {
                    LikeFromUserId = table.Column<string>(nullable: false),
                    LikeToUserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Like", x => new { x.LikeFromUserId, x.LikeToUserId });
                    table.ForeignKey(
                        name: "FK_Like_AspNetUsers_LikeFromUserId",
                        column: x => x.LikeFromUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Like_AspNetUsers_LikeToUserId",
                        column: x => x.LikeToUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Like_LikeToUserId",
                table: "Like",
                column: "LikeToUserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Like");
        }
    }
}
