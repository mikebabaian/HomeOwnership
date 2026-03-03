using HomeOwnership.Api.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HomeOwnership.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : IdentityDbContext<IdentityUser>(options)
{
    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();

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
    }
}
