using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controller
{
    public class AccountController : BaseApiController
    {

        readonly UserManager<User> _userManager ;
        readonly TokenService _tokenService;
        readonly StoreContext _context;
    
        public AccountController(UserManager<User> userManager , TokenService tokenService , StoreContext context){
                this._userManager = userManager;
                this._tokenService = tokenService;
                this._context = context;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto){

            var user = await _userManager.FindByNameAsync(loginDto.Username);


            if(user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                return Unauthorized();

            var userBasket = await RetrieveBasketAsync(loginDto.Username);
            var annonBasket =  await RetrieveBasketAsync(Request.Cookies["buyerId"]);

            if(annonBasket != null ) {
 
                if(userBasket != null )  _context.Baskets.Remove(userBasket);

                annonBasket.BuyerId = user.UserName;
                Response.Cookies.Delete("buyerId");
                await _context.SaveChangesAsync();

            }
           

            
            return new UserDto{
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = annonBasket != null ? annonBasket.MapBasketToBasketDto() : userBasket?.MapBasketToBasketDto()
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Registger(Registger registerDto){
            var user = new User{
                UserName = registerDto.Username,
                Email = registerDto.Email,
            };

            var result = await _userManager.CreateAsync(user , registerDto.Password);

            if(!result.Succeeded){
                foreach(var error in result.Errors){
                    ModelState.AddModelError(error.Code,error.Description);
                }

                return ValidationProblem();
            }

            await _userManager.AddToRoleAsync(user , "Member");

            return StatusCode(201);
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser(){
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            var  userBasket = await RetrieveBasketAsync(User.Identity.Name);
            return new UserDto{
                Email  = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket =  userBasket?.MapBasketToBasketDto()
            };
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

        
        [Authorize]
        [HttpGet("getAddress")]
        public async Task<ActionResult<UserAddress>> GetSavedAddress(){
            return await _userManager.Users
                    .Where(x => x.UserName == User.Identity.Name)
                    .Select(user => user.Address)
                    .FirstOrDefaultAsync();
        }
    }

}