using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class RespondToken
    {
        private string token;

        public RespondToken(string token)
        {
            this.token = token;
        }

        public string Token { get => token; set => token = value; }
    }
}