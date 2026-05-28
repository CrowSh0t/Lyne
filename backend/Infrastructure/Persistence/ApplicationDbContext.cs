using Domains.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public DbSet<User> UserProfiles => Set<User>();
        public DbSet<Products> Products => Set<Products>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Brand> Brands { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Category>()
                .HasMany(c => c.Products)
                .WithMany(p => p.Categories);

            builder.Entity<Products>()
                .HasOne(p => p.Brand)
                .WithMany(b => b.Products)
                .HasForeignKey(p => p.BrandId)  
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Products>()
                .Property(p => p.CategoriesId)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries)
                           .Select(int.Parse).ToList()
                );

            builder.Entity<Products>()
                .Property(p => p.MatchProductsId)
                .HasConversion(
                    v => v != null ? string.Join(',', v) : null,
                    v => v != null ? v.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                       .Select(int.Parse).ToList() : null
                );

            builder.Entity<Products>()
                .Property(p => p.ImageUrl)
                .HasConversion(
                    v => v != null ? string.Join('|', v) : null,
                    v => v != null ? v.Split('|', StringSplitOptions.RemoveEmptyEntries).ToList() : null
                );

            builder.Entity<Products>()
                .Property(p => p.Color)
                .HasConversion<int>();

            builder.Entity<Products>()
                .Property(p => p.Size)
                .HasConversion<int>();
        }
    }
}