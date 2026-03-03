using System.ComponentModel.DataAnnotations;

namespace HomeOwnership.Api.Data.Entities;

public class MessageThread
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = default!;

    public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedUtc { get; set; } = DateTime.UtcNow;

    [Required]
    [MaxLength(450)]
    public string CreatedByUserId { get; set; } = default!;

    /// <summary>Snapshot of UserProfile.MessageBoardUserName at creation time.</summary>
    [Required]
    [MaxLength(50)]
    public string CreatedByDisplayName { get; set; } = default!;

    public ICollection<MessagePost> Posts { get; set; } = new List<MessagePost>();
}
