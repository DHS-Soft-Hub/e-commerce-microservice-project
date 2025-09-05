using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Orders.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class OrderSagaDataChangeMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CompletedAt",
                table: "OrderCreateSagaStates",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "OrderCreateSagaStates",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "InventoryReservationId",
                table: "OrderCreateSagaStates",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InventoryStatus",
                table: "OrderCreateSagaStates",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastError",
                table: "OrderCreateSagaStates",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "PaymentId",
                table: "OrderCreateSagaStates",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PaymentProcessedAt",
                table: "OrderCreateSagaStates",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RetryCount",
                table: "OrderCreateSagaStates",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ShipmentId",
                table: "OrderCreateSagaStates",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ShippedAt",
                table: "OrderCreateSagaStates",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShippingStatus",
                table: "OrderCreateSagaStates",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompletedAt",
                table: "OrderCreateSagaStates");

            migrationBuilder.DropColumn(
                name: "Currency",
                table: "OrderCreateSagaStates");

            migrationBuilder.DropColumn(
                name: "InventoryReservationId",
                table: "OrderCreateSagaStates");

            migrationBuilder.DropColumn(
                name: "InventoryStatus",
                table: "OrderCreateSagaStates");

            migrationBuilder.DropColumn(
                name: "LastError",
                table: "OrderCreateSagaStates");

            migrationBuilder.DropColumn(
                name: "PaymentId",
                table: "OrderCreateSagaStates");

            migrationBuilder.DropColumn(
                name: "PaymentProcessedAt",
                table: "OrderCreateSagaStates");

            migrationBuilder.DropColumn(
                name: "RetryCount",
                table: "OrderCreateSagaStates");

            migrationBuilder.DropColumn(
                name: "ShipmentId",
                table: "OrderCreateSagaStates");

            migrationBuilder.DropColumn(
                name: "ShippedAt",
                table: "OrderCreateSagaStates");

            migrationBuilder.DropColumn(
                name: "ShippingStatus",
                table: "OrderCreateSagaStates");
        }
    }
}
