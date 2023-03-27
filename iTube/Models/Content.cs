using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class Content
    {
        private string content;

        public Content(string content)
        {
            this.content = content;
        }

        public string GetContent()
        {
            return (content == null) ? "" : content;
        }
    }
}