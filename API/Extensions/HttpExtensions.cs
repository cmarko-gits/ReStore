    using System.Text.Json;
    using API.RequestHelper;

    namespace API.Extensions
    {
        public static class HttpExtensions
        {
            public static void AddPagingHeader(this HttpResponse response , MetaData metaData){
                var options = new  JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

                response.Headers.Add("Pagination" , JsonSerializer.Serialize(metaData,options));
                response.Headers.Add("Access-Control-Expose-Header" , "Pagination");
            }
        }
    }