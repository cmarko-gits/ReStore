using Microsoft.EntityFrameworkCore; // For DbContext and DbSet<T>
using API.Entities; // For the Product class (or wherever the Product class is defined)

namespace API.Data{
    public class StoreContext : DbContext{
        public StoreContext(DbContextOptions options) : base(options) { }

       public DbSet<Product> Products { get; set; }
    }
}