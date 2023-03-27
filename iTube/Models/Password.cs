using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class Password
    {
        private string password;

        public Password(string password)
        {
            this.password = password;
        }

        public string GetPassword()
        {
            return password;
        }
    }
}