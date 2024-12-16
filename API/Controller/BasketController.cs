using System.ComponentModel;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controller
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;

        public BasketController(StoreContext context)
        {
            _context = context;
        }

    

        [HttpGet(Name = "GetBasket")] // Explicit route for getting a basket
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasketAsync(GetBuyerId());

            if (basket == null) 
                return NotFound("Basket not found.");  // Better to provide context in the NotFound

            return basket.MapBasketToBasketDto();
        }

       [HttpPost("basket/item")]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            var basket = await RetrieveBasketAsync(GetBuyerId());
            if (basket == null) 
                basket = CreateBasket();

            var product = await _context.Products.FindAsync(productId);
            if (product == null) 
                return BadRequest(new ProblemDetails{Title = "Product not found"});

            basket.AddItem(product, quantity);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) 
                return CreatedAtRoute("GetBasket", basket.MapBasketToBasketDto());

            return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
        }

        private Basket CreateBasket()
        {


            var buyerId = User.Identity?.Name;
            
            if(string.IsNullOrEmpty(buyerId)){
              buyerId=  Guid.NewGuid().ToString();

            var cookiesOptions = new CookieOptions
            {
                IsEssential = true,
                Expires = DateTime.Now.AddDays(30)
            };

            Response.Cookies.Append("buyerId", buyerId, cookiesOptions);
            }
            
                
            var basket = new Basket(buyerId);
            _context.Baskets.Add(basket);
            return basket;
        }

        [HttpDelete("basket/item")] // Explicit route for removing items from basket
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            var basket = await RetrieveBasketAsync(GetBuyerId());
            if (basket == null) 
                return NotFound();

            basket.RemoveItem(productId, quantity); // Poziva ispravno modifikovanu RemoveItem metodu

            var result = await _context.SaveChangesAsync() > 0;

            if (result) 
                return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem removing item from basket" });
        }

        [HttpGet("retrieve-basket/{buyerId}")]

        public async Task<Basket> RetrieveBasketAsync(string buyerId)
        {

            if(string.IsNullOrEmpty(buyerId)){
                Response.Cookies.Delete("buyerId");
                
                return null ;
            }

            // Retrieves the basket associated with the buyerId stored in the cookies
            return await _context.Baskets
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }

        private string GetBuyerId(){
            return User.Identity?.Name ?? Request.Cookies["buyerId"];
        }


      
    
    }
}
