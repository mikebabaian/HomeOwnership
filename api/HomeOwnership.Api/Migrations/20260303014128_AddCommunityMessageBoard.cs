using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeOwnership.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCommunityMessageBoard : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MessageThreads",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    CreatedUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedByUserId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    CreatedByDisplayName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MessageThreads", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MessagePosts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ThreadId = table.Column<int>(type: "int", nullable: false),
                    Body = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    CreatedUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedByUserId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    CreatedByDisplayName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MessagePosts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MessagePosts_MessageThreads_ThreadId",
                        column: x => x.ThreadId,
                        principalTable: "MessageThreads",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MessagePosts_ThreadId_CreatedUtc",
                table: "MessagePosts",
                columns: new[] { "ThreadId", "CreatedUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_MessageThreads_CreatedByUserId",
                table: "MessageThreads",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MessageThreads_UpdatedUtc",
                table: "MessageThreads",
                column: "UpdatedUtc");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MessagePosts");

            migrationBuilder.DropTable(
                name: "MessageThreads");
        }
    }
}
