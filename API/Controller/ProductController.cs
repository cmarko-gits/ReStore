using System.Text.Json;
using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;    

namespace API.Controller
{
    public class ProductController : BaseApiController
    {
        private readonly StoreContext _context;

        public ProductController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery]ProductParams productParams)
        {
            var query = _context.Products
                .Sort(productParams.OrderBy)
                .Search(productParams.SearchTerm)
                .Filter(productParams.Brands, productParams.Types);

            var products =  await  PagedList<Product>.ToPageList(query,productParams.PageNumber,productParams.PageSize);

            Response.AddPagingHeader(products.MetaData);

            return products; 
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null) return NotFound();

            return product;
        }

      [HttpGet("filters")]
public async Task<ActionResult<object>> GetFilters()
{
    var brands = await _context.Products
                                .Select(p => p.Brand)
                                .Distinct()
                                .ToArrayAsync();

    var types = await _context.Products
                               .Select(p => p.Type)
                               .Distinct()
                               .ToArrayAsync();

    // Return the filters as an object (you can use an anonymous object or create a DTO class)
    return Ok(new { brands, types });
}

    }
}
