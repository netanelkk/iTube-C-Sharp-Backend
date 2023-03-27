using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class RespondSingleDataComments<T> : RespondSingleData<T>
    {
        private Dictionary<string, int> tags;

        public RespondSingleDataComments(T data, Dictionary<string, int> tags) : base(data)
        {
            this.tags = tags;
        }

        public Dictionary<string, int> Tags { get => tags; set => tags = value; }
    }
}