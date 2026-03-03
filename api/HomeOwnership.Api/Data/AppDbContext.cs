using HomeOwnership.Api.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HomeOwnership.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : IdentityDbContext<IdentityUser>(options)
{
    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
    public DbSet<BudgetItem> BudgetItems => Set<BudgetItem>();
    public DbSet<MessageThread> MessageThreads => Set<MessageThread>();
    public DbSet<MessagePost> MessagePosts => Set<MessagePost>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<UserProfile>(entity =>
        {
            entity.HasIndex(e => e.UserId).IsUnique();
            entity.Property(e => e.CurrentMortgageRate).HasColumnType("decimal(5,2)");
            entity.Property(e => e.HomeOwnersInsuranceMonthly).HasColumnType("decimal(10,2)");
            entity.Property(e => e.MonthlyTakeHome).HasColumnType("decimal(10,2)");
            entity.Property(e => e.CurrentMortgageBalance).HasColumnType("decimal(12,2)");
        });

        builder.Entity<BudgetItem>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
        });

        builder.Entity<MessageThread>(entity =>
        {
            entity.HasIndex(e => e.UpdatedUtc);
            entity.HasIndex(e => e.CreatedByUserId);
            entity.HasMany(e => e.Posts)
                  .WithOne(e => e.Thread)
                  .HasForeignKey(e => e.ThreadId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<MessagePost>(entity =>
        {
            entity.HasIndex(e => new { e.ThreadId, e.CreatedUtc });
        });
    }
}
