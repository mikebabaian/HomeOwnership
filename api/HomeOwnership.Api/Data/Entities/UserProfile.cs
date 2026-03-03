using System.ComponentModel.DataAnnotations;

namespace HomeOwnership.Api.Data.Entities;

public class UserProfile
{
    public int Id { get; set; }

    /// <summary>FK to AspNetUsers.Id — enforces 1:1 via unique index.</summary>
    [Required]
    [MaxLength(450)]
    public string UserId { get; set; } = default!;

    /// <summary>
    /// Display name for community message boards.
    /// Once set (non-null/non-empty), it becomes immutable.
    /// </summary>
    [MaxLength(50)]
    public string? MessageBoardUserName { get; set; }

    public decimal? CurrentMortgageRate { get; set; }

    public decimal? HomeOwnersInsuranceMonthly { get; set; }

    public decimal? MonthlyTakeHome { get; set; }

    public decimal? CurrentMortgageBalance { get; set; }

    public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedUtc { get; set; } = DateTime.UtcNow;
}
