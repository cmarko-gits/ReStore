using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
    public class PagedList<T> : List<T>
    {
        public PagedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            MetaData = new API.RequestHelper.MetaData // Use fully qualified name
            {
                TotalCount = count,
                PageSize = pageSize,
                CurrentPage = pageNumber,
                TotalPages = (int)Math.Ceiling(count / (double)pageSize)
            };
            AddRange(items);
        }

        public API.RequestHelper.MetaData MetaData { get; set; } // Fully qualified MetaData reference

        public static async Task<PagedList<T>> ToPageList(IQueryable<T> query, int pageNumber, int pageSize)
        {
            if (pageNumber < 1)
                pageNumber = 1;

            var count = await query.CountAsync();
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PagedList<T>(items, count, pageNumber, pageSize);
        }
    }
}
