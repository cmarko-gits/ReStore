using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;

namespace API.Controller
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        readonly StoreContext _context;
        public OrdersController(StoreContext context){
            this._context = context;
        }

        [HttpGet]
            public async Task<ActionResult<List<OrderDto>>> GetOrders()
            {
                return await _context.Orders
                .ProjectToOrderDto()
                .Where(x => x.BuyerId == User.Identity.Name)
                .ToListAsync();   
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> getOrder(int id ){
            return await _context.Orders
                        .ProjectToOrderDto()
                        .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
                        .FirstOrDefaultAsync();
        }

        [HttpPost]
public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
{
    // Retrieve the user's basket
    var basket = await _context.Baskets
        .Include(b => b.Items)
        .ThenInclude(i => i.Product)
        .FirstOrDefaultAsync(b => b.BuyerId == User.Identity.Name);

    if (basket == null) 
        return BadRequest(new ProblemDetails { Title = "Could not locate basket" });

    var items = new List<OrderItem>();

    // Create order items and update product stock
    foreach (var basketItem in basket.Items)
    {
        var product = await _context.Products.FindAsync(basketItem.ProductId);
        if (product == null) 
            return BadRequest($"Product with ID {basketItem.ProductId} not found.");

        if (product.QuantityInStock < basketItem.Quantity)
            return BadRequest($"Not enough stock for product: {product.Name}");

        var itemOrdered = new ProductItemOrdered
        {
            ProductId = product.Id,
            Name = product.Name,
            pictureUrl = product.PictureUrl
        };

        var orderItem = new OrderItem
        {
            ItemOrdered = itemOrdered,
            Price = product.Price,
            Quantity = basketItem.Quantity
        };

        items.Add(orderItem);
        product.QuantityInStock -= basketItem.Quantity;
    }

    // Calculate subtotal and delivery fee
    var subtotal = items.Sum(item => item.Price * item.Quantity);
    var deliveryFee = subtotal > 1000 ? 0 : 500;

    // Create the order
    var order = new Order
    {
        OrderItems = items,
        BuyerId = User.Identity.Name,
        ShippingAddress = orderDto.ShippingAddress,
        Subtotal = subtotal,
        DeliveryFree = deliveryFee
    };

    _context.Orders.Add(order);
    _context.Baskets.Remove(basket);

    // Save user address if requested
    if (orderDto.SaveAddress)
    {
        var user = await _context.Users.
        Include(x => x.Address).
        FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);
        if (user == null) 
            return Unauthorized("User not found.");

        var address = new UserAddress
        {
            FullName = orderDto.ShippingAddress.FullName,
            Address1 = orderDto.ShippingAddress.Address1,
            Address2 = orderDto.ShippingAddress.Address2,
            City = orderDto.ShippingAddress.City,
            State = orderDto.ShippingAddress.State,
            Zip = orderDto.ShippingAddress.Zip,
            Country = orderDto.ShippingAddress.Country
        };

        user.Address = address;

        _context.Update(user);
    }

    // Save changes to the database
    var result = await _context.SaveChangesAsync() > 0;
    if (!result)
        return BadRequest("Problem creating order");

    return Ok(order);
}

    }
}