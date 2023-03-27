using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class SearchRequest
    {
        private string query;
        private int page;
        private string[] orderby;

        public SearchRequest(string query, int page, string[] orderby)
        {
            this.query = query;
            this.page = page;
            this.orderby = orderby;
        }

        public string Query { get => query; set => query = value; }
        public int Page { get => page; set => page = value; }
        public string[] Orderby { get => orderby; set => orderby = value; }
    }
}