using System.ComponentModel.DataAnnotations.Schema;
using API.Entities;


[Table("BasketItem")]
public class BasketItem
{
    public int Id { get; set; }
    public int Quantity { get; set; }
    public int ProductId { get; set; }
    public Product Product { get; set; }
    public int BasketId { get; set; }
    public Basket Basket { get; set; }

    // Parameterless constructor for EF Core
    public BasketItem() { }

    // Constructor that takes a Product and Quantity
    public BasketItem(Product product, int quantity)
    {
        Product = product;
        ProductId = product.Id;
        Quantity = quantity;
    }
}
