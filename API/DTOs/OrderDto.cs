using API.Entities.OrderAggregate;

namespace API.DTOs
{
    public class OrderDto
    {
        public int Id {get;set;}
        public string BuyerId {get;set;}
        public ShippingAddress ShippingAddress {get;set;}
        public DateTime OrderDate {get;set;} 
        public List<OrderItemDto> OrderItems { get; set; } // Changed to OrderItemDto

        public long Subtotal {get;set;}
        public long DeliveryFree {get;set;}
        public string OrderStatus {get;set;}
        public long Total {get;set;}
    }
}