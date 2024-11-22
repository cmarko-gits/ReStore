using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controller{

    [ApiController] 
    [Route("(api/[controller])")]
    public class ProductController : ControllerBase{

        readonly StoreContext _context ; 

        public ProductController(StoreContext context){
            this._context = context;
        }

        [HttpGet]
        public  ActionResult<List<Product>> getProducts(){
            var products = _context.Products.ToList();

            return Ok(products);
        }

        [HttpGet("{id}")]
        public ActionResult<Product> GetProduct(int id){

            return _context.Products.Find(id);
        }

    }
}