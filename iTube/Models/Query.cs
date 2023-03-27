using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class Query
    {
        private string query;

        public Query(string query)
        {
            this.query = query;
        }

        public string GetQuery()
        {
            return query;
        }
    }
}