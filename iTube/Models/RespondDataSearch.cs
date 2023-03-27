using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class RespondDataSearch<T> : RespondData<T>
    {
        private int count;

        public RespondDataSearch(List<T> data, int count) : base(data)
        {
            this.count = count;
        }

        public int Count { get => count; set => count = value; }
    }
}