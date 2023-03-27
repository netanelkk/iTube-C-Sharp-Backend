using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class RespondMessage
    {
        private string message;

        public RespondMessage(string message)
        {
            this.message = message;
        }

        public string Message { get => message; set => message = value; }
    }
}