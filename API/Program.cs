using System.Text;
using System.Text.Json.Serialization;
using API.Data;
using API.Entities;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Register DbContext with the connection string
builder.Services.AddDbContext<StoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c=>{
    var JwtSecuritySheme = new OpenApiSecurityScheme{
        
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header , 
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "Put Barrer + your token in the box below",
        Reference = new OpenApiReference{
            Id = JwtBearerDefaults.AuthenticationScheme ,
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition(JwtSecuritySheme.Reference.Id,JwtSecuritySheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement{
        {
            JwtSecuritySheme , Array.Empty<string> ()
        }
    });
});
builder.Services.AddIdentityCore<User>(opt=>{
     opt.User.RequireUniqueEmail = true;
})
    .AddRoles<Role>()
    .AddEntityFrameworkStores<StoreContext>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt=>{
        opt.TokenValidationParameters = new TokenValidationParameters{

            ValidateAudience = false , 
            ValidateIssuer = false , 
            ValidateLifetime = true, 
            ValidateIssuerSigningKey  = true , 
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddScoped<TokenService>();
var app = builder.Build();

// Postavljanje rutiranja (mora doći pre autorizacije)
app.UseRouting();

// CORS middleware (opciono)
app.UseCors(opt =>
{
    opt.AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
        .WithOrigins("http://localhost:3000")
        .WithExposedHeaders("Pagination");
});

// Middleware za autentifikaciju i autorizaciju
app.UseAuthentication();
app.UseAuthorization();

// Middleware za Swagger (za razvojnu okolinu)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>{
        c.ConfigObject.AdditionalItems.Add("persistAuthorization",true);
    });
}

// HTTPS redirekcija (opciono)
app.UseHttpsRedirection();

// Mapiranje kontrolera
app.MapControllers();

// Migracija baze podataka i inicijalizacija
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
    var ilogger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        await context.Database.MigrateAsync();
        await DbInitialize.DbInitial(context, userManager); // Inicijalizacija baze
    }
    catch (Exception e)
    {
        ilogger.LogError(e, "Problem during migrations or initialization");
    }
}

// Pokretanje aplikacije
app.Run();
