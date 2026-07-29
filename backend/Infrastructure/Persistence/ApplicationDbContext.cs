using Domains.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace Infrastructure.Persistence
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public DbSet<User> UserProfiles => Set<User>();
        public DbSet<Products> Products => Set<Products>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Color> Colors { get; set; }
        public DbSet<Size> Sizes { get; set; }
        public DbSet<Discount> Discounts { get; set; }
        public DbSet<Selling> Sellings { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<UserFavorite> UserFavorites { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // === Categories <-> Products many-to-many ===
            builder.Entity<Category>()
                .HasMany(c => c.Products)
                .WithMany(p => p.Categories);

            // === Brand -> Products one-to-many ===
            builder.Entity<Products>()
                .HasOne(p => p.Brand)
                .WithMany(b => b.Products)
                .HasForeignKey(p => p.BrandId)
                .OnDelete(DeleteBehavior.Cascade);

            // === Color -> Products one-to-many ===
            builder.Entity<Products>()
                .HasOne(p => p.Color)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.ColorId);

            // === Size -> Products one-to-many ===
            builder.Entity<Products>()
                .HasOne(p => p.Size)
                .WithMany(s => s.Products)
                .HasForeignKey(p => p.SizeId);

            // === Discount -> Product one-to-many ===
            builder.Entity<Discount>()
                .HasOne(d => d.Product)
                .WithMany(p => p.Discounts)
                .HasForeignKey(d => d.ProductId);

            // === Category self-reference (parent) ===
            builder.Entity<Category>()
                .HasOne(c => c.ParentCategory)
                .WithMany()
                .HasForeignKey(c => c.ParentCategoryId);

            // === OrderItem -> Product ===
            builder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId);

            // === Enum Type для Category як рядок ===
            builder.Entity<Category>()
                .Property(c => c.Type)
                .HasConversion<string>();

            // === Конвертації для списків у Products ===
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
            // Seed Colors
            builder.Entity<Color>().HasData(
                new Color { Id = 1, Name = "Black", HexCode = "#000000" },
                new Color { Id = 2, Name = "White", HexCode = "#FFFFFF" },
                new Color { Id = 3, Name = "Red", HexCode = "#FF0000" },
                new Color { Id = 4, Name = "Green", HexCode = "#00FF00" },
                new Color { Id = 5, Name = "Blue", HexCode = "#0000FF" },
                new Color { Id = 6, Name = "Yellow", HexCode = "#FFFF00" },
                new Color { Id = 7, Name = "Pink", HexCode = "#FFC0CB" },
                new Color { Id = 8, Name = "Purple", HexCode = "#800080" },
                new Color { Id = 9, Name = "Orange", HexCode = "#FFA500" }
            );

            // Seed Sizes
            builder.Entity<Size>().HasData(
                new Size { Id = 1, Name = "XS" },
                new Size { Id = 2, Name = "S" },
                new Size { Id = 3, Name = "M" },
                new Size { Id = 4, Name = "L" },
                new Size { Id = 5, Name = "XL" },
                new Size { Id = 6, Name = "XXL" }
            );
            // ❌ Видалено оці два рядки (вони спричиняли помилку):
            // builder.Entity<Products>().Property(p => p.Color).HasConversion<int>();
            // builder.Entity<Products>().Property(p => p.Size).HasConversion<int>();

            builder.Entity<UserFavorite>()
    .HasOne(f => f.User).WithMany().HasForeignKey(f => f.UserId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<UserFavorite>()
                .HasOne(f => f.Product).WithMany().HasForeignKey(f => f.ProductId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<UserFavorite>()
                .HasIndex(f => new { f.UserId, f.ProductId }).IsUnique();
        }
    }
}