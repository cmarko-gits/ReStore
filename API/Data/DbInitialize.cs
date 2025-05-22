using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Data{
    public  static class DbInitialize {

        public static async Task   DbInitial(StoreContext context , UserManager<User> userManager) {

            if (!userManager.Users.Any())
{
    var user = new User
    {
        UserName = "bob",
        Email = "bob@test.com"
    };

            await userManager.CreateAsync(user, "Pa$$w0rd");

        await userManager.AddToRoleAsync(user, "Member");


    var admin = new User
    {
        UserName = "admin",
        Email = "admin@test.com"
    };

             await userManager.CreateAsync(admin, "Pa$$w0rd");

        await userManager.AddToRolesAsync(admin, new[] { "Member", "Admin" });

}

             if(context.Products.Any()) return;

             var products = new List<Product> {
new Product {
    Name = "Nike Air Zoom Pegasus 40",
    Description = "Versatile running shoes with responsive cushioning for daily training.",
    Price = 20000,
    PictureUrl = "https://www.futbolemotion.com/imagesarticulos/189023/grandes/zapatilla-nike-air-zoom-pegasus-40-premium-negro-0.webp",
    Brand = "Nike",
    Type = "Shoes",
    QuantityInStock = 100
},
new Product {
    Name = "Adidas Ultraboost Light",
    Description = "Lightweight running shoe with high energy return and Primeknit upper.",
    Price = 25000,
    PictureUrl = "https://www.futbolemotion.com/imagesarticulos/203474/grandes/zapatilla-adidas-ultraboost-light-negro-0.webp",
    Brand = "Adidas",
    Type = "Shoes",
    QuantityInStock = 100
},
new Product {
    Name = "Puma Future Rider Play On",
    Description = "Retro-style sneakers inspired by 80s running shoes.",
    Price = 18000,
    PictureUrl = "https://dynamic.zacdn.com/XFYsjjg0hVky9gCDkvUobzVkwcA=/filters:quality(70):format(webp)/https://static-ph.zacdn.com/p/puma-3942-7159982-2.jpg",
    Brand = "Puma",
    Type = "Shoes",
    QuantityInStock = 100
},
new Product {
    Name = "Reebok Nano X3",
    Description = "Training shoe built for strength training and agility workouts.",
    Price = 22000,
    PictureUrl = "https://assets.roguefitness.com/f_auto,q_auto,c_limit,w_1600,b_rgb:ffffff/catalog/Shoes/Training%20Shoes/Reebok/IG0965/Reebok-Nano-X3-IG0965-Web5_pypa7i.png",
    Brand = "Reebok",
    Type = "Shoes",
    QuantityInStock = 100
},
new Product {
    Name = "Under Armour HOVR Phantom 3",
    Description = "Comfortable training shoe with responsive UA HOVR cushioning.",
    Price = 23000,
    PictureUrl = "https://underarmour.scene7.com/is/image/Underarmour/3026535-001_DEFAULT?wid=600&hei=600&fmt=jpg",
    Brand = "Under Armour",
    Type = "Shoes",
    QuantityInStock = 100
},
new Product {
    Name = "New Balance 327",
    Description = "Heritage-inspired design with modern twist and bold aesthetics.",
    Price = 19000,
    PictureUrl = "https://www.futbolemotion.com/imagesarticulos/187001/grandes/zapatilla-new-balance-327-mujer-sea-salt-0.webp",
    Brand = "New Balance",
    Type = "Shoes",
    QuantityInStock = 100
},
new Product {
    Name = "Nike Dri-FIT Hoodie",
    Description = "Lightweight and breathable hoodie for running and training.",
    Price = 8000,
    PictureUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJsC2GKabd6cci7ZwVsaNzHCd2palQUNxJmQ&s",
    Brand = "Nike",
    Type = "Hoodies",
    QuantityInStock = 100
},
new Product {
    Name = "Adidas Essentials Fleece Hoodie",
    Description = "Soft fleece hoodie for everyday comfort.",
    Price = 7000,
    PictureUrl = "https://eplaneta.rs/media/catalog/product/cache/b3a0f5a22a0716a4157a475ec9eda9df/h/1/h12211_98312.jpg",
    Brand = "Adidas",
    Type = "Hoodies",
    QuantityInStock = 100
},
new Product {
    Name = "Puma Power Hoodie",
    Description = "Casual hoodie with a relaxed fit for all-day wear.",
    Price = 7500,
    PictureUrl = "https://www.footkorner.com/cdn/shop/products/footkorner-sweat-capuche-puma-power-noir-blanc-vert-673786-37_1.jpg?v=1675326044",
    Brand = "Puma",
    Type = "Hoodies",
    QuantityInStock = 100
},
new Product {
    Name = "Reebok Identity Fleece Hoodie",
    Description = "Comfortable fleece hoodie with a sporty Reebok logo.",
    Price = 6500,
    PictureUrl = "https://m.media-amazon.com/images/I/611HgXEIfgL._AC_UY1000_.jpg",
    Brand = "Reebok",
    Type = "Hoodies",
    QuantityInStock = 100
},
new Product {
    Name = "Under Armour Rival Fleece Hoodie",
    Description = "Super-soft, mid-weight hoodie for warmth and comfort.",
    Price = 8200,
    PictureUrl = "https://www.underarmour.rs/files/watermark/files/images/slike_proizvoda/thumbs_w/1379863-001_4_w_800_1000px.jpg",
    Brand = "Under Armour",
    Type = "Hoodies",
    QuantityInStock = 100
},
new Product {
    Name = "New Balance Core Fleece Hoodie",
    Description = "Classic fleece hoodie for everyday warmth and comfort.",
    Price = 7800,
    PictureUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoPpnxImgWUlSoKJKqBURqjDXu9bem2EkqGg&s",
    Brand = "New Balance",
    Type = "Hoodies",
    QuantityInStock = 100
},
new Product {
    Name = "Nike Everyday Plus Cushioned Socks (3 Pairs)",
    Description = "Durable, sweat-wicking, and comfortable everyday socks.",
    Price = 3000,
    PictureUrl = "https://www.sportvision.rs/files/thumbs/files/images/slike_proizvoda/media/SX7/SX7840-010/images/thumbs_800/SX7840-010_800_800px.jpg",
    Brand = "Nike",
    Type = "Accessories",
    QuantityInStock = 100
},
new Product {
    Name = "Adidas AEROREADY Cap",
    Description = "Breathable and moisture-absorbing training cap.",
    Price = 3200,
    PictureUrl = "https://cdn.sportdepot.bg/files/catalog/detail/HT4819_01.jpg",
    Brand = "Adidas",
    Type = "Accessories",
    QuantityInStock = 100
},
new Product {
    Name = "Puma Running Cap",
    Description = "Lightweight running cap with dryCELL moisture-wicking fabric.",
    Price = 2800,
    PictureUrl = "https://hatstore.imgix.net/4067981530427_1.jpg?auto=compress%2Cformat&w=346&h=277&fit=crop&q=80",
    Brand = "Puma",
    Type = "Accessories",
    QuantityInStock = 100
},
new Product {
    Name = "Reebok Training Gloves",
    Description = "Protective and padded gloves for gym workouts.",
    Price = 3500,
    PictureUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyNL9OtVJEw04Xj23bbCVMQd6YmOoKkTIwPw&s",
    Brand = "Reebok",
    Type = "Accessories",
    QuantityInStock = 100
},
new Product {
    Name = "Under Armour Training Gloves",
    Description = "Grip-enhancing gloves for intense training sessions.",
    Price = 3600,
    PictureUrl = "https://rukminim2.flixcart.com/image/850/1000/sport-glove/p/n/4/na-left-right-na-under-armour-7-75-gym-fitness-gloves-resistor-l-original-imae92hxy9zkwmdn.jpeg?q=90&crop=false",
    Brand = "Under Armour",
    Type = "Accessories",
    QuantityInStock = 100
},
new Product {
    Name = "New Balance Running Cap",
    Description = "Light and breathable running cap with moisture-wicking fabric.",
    Price = 3100,
    PictureUrl = "https://irunsg.com/cdn/shop/files/new-balance-nb-laser-performance-run-hat-3-colours-accessories-irun-singapore-1.jpg?v=1685588613",
    Brand = "New Balance",
    Type = "Accessories",
    QuantityInStock = 100
},
new Product {
    Name = "Nike Heritage Backpack",
    Description = "Classic design with ample storage for daily essentials.",
    Price = 6000,
    PictureUrl = "https://static.super-shop.com/1379664-nike-sb-heritage-backpack-black-black-white.jpg?t=fb",
    Brand = "Nike",
    Type = "Bags",
    QuantityInStock = 100
},
new Product {
    Name = "Adidas Classic Backpack",
    Description = "Durable and spacious backpack for everyday use.",
    Price = 5500,
    PictureUrl = "https://www.footasylum.com/images/products/large/4100505_6.jpg",
    Brand = "Adidas",
    Type = "Bags",
    QuantityInStock = 100
} };

             foreach(var product in products){
                 context.Products.Add(product);
             }

             context.SaveChanges();
         }

     }
}