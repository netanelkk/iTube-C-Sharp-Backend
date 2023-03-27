using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class RespondSingleData<T>
    {
        private T data;

        public RespondSingleData(T data)
        {
            this.data = data;
        }

        public T Data { get => data; set => data = value; }
    }
}