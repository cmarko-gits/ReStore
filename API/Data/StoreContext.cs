using Microsoft.EntityFrameworkCore;
using API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Diagnostics;
using API.Entities.OrderAggregate;

public class StoreContext : IdentityDbContext<User, Role, int>
{
    public StoreContext(DbContextOptions<StoreContext> options) : base(options) { }

    public DbSet<Product> Products { get; set; }
    public DbSet<Basket> Baskets { get; set; }
    public DbSet<Order> Orders { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.ConfigureWarnings(warnings =>
            warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<UserAddress>()
    .HasKey(ua => ua.Id);  // Dodajte primarni ključ
    
        builder.Entity<User>()
            .HasOne(a => a.Address)
            .WithOne()
            .HasForeignKey<UserAddress>(a => a.Id)
            .OnDelete(DeleteBehavior.Cascade);


        // Ensuring roles are seeded with explicit GUIDs
        builder.Entity<Role>().HasData(
            new Role
            {
                Id = 1, // integer ID
                Name = "Member",
                NormalizedName = "MEMBER"
            },
            new Role
            {
                Id = 2, // integer ID
                Name = "Admin",
                NormalizedName = "ADMIN"
            }
        );


       
    }
}
