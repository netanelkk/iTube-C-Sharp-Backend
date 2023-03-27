using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class TotalViews
    {
        private int count, count2, count3, count4, count5, count6;

        public TotalViews(int count, int count2, int count3, int count4, int count5, int count6)
        {
            this.count = count;
            this.count2 = count2;
            this.count3 = count3;
            this.count4 = count4;
            this.count5 = count5;
            this.count6 = count6;
        }

        public int Count { get => count; set => count = value; }
        public int Count2 { get => count2; set => count2 = value; }
        public int Count3 { get => count3; set => count3 = value; }
        public int Count4 { get => count4; set => count4 = value; }
        public int Count5 { get => count5; set => count5 = value; }
        public int Count6 { get => count6; set => count6 = value; }
    }
}