using System.ComponentModel.DataAnnotations;

namespace HomeOwnership.Api.Data.Entities;

public class BudgetItem
{
    public int Id { get; set; }

    /// <summary>FK to AspNetUsers.Id</summary>
    [Required]
    [MaxLength(450)]
    public string UserId { get; set; } = default!;

    /// <summary>e.g. "Utilities", "Housing", "Debt", "Insurance", "Other"</summary>
    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = default!;

    /// <summary>e.g. "Electric", "Mortgage", "Water"</summary>
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = default!;

    /// <summary>Monthly amount in dollars (>= 0)</summary>
    public decimal Amount { get; set; }

    [MaxLength(250)]
    public string? Notes { get; set; }

    public int SortOrder { get; set; }

    public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedUtc { get; set; } = DateTime.UtcNow;
}
