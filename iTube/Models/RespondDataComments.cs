using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class RespondDataComments<T> : RespondData<T>
    {
        private int count;
        private Dictionary<string, int> tags;

        public RespondDataComments(List<T> data, int count, Dictionary<string, int> tags):base(data)
        {
            this.count = count;
            this.tags = tags;
        }

        public int Count { get => count; set => count = value; }
        public Dictionary<string, int> Tags { get => tags; set => tags = value; }
    }
}