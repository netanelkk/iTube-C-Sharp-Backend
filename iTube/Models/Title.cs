using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class Title
    {
        private string title;

        public Title(string title)
        {
            this.title = title;
        }

        public string GetTitle()
        {
            return (title == null) ? "" : title;
        }
    }
}