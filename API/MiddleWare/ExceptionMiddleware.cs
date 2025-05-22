using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _environment;

        // Konstruktor za injektovanje zavisnosti
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment environment)
        {
            _next = next;
            _logger = logger;
            _environment = environment;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while processing the request.");
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = 500;

                var response  = new ProblemDetails{
                    Status = 500,
                    Detail = _environment.IsDevelopment() ? ex.StackTrace.ToString() : null ,
                    Title = ex.Message
                };

                var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};
                var json  = JsonSerializer.Serialize(response,options);

                await context.Response.WriteAsJsonAsync(json);
            }
        }
    }
}
