using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace iTube.Models
{
    public class FetchVideoHistoryRow : FetchVideoRow
    {
        private string historyDate;

        public FetchVideoHistoryRow(int id, string title, string uploadDate, int duration, string videoPath, string thumbnailPath,
                            int publisher, string username, string picturePath, int userId, int views, string historyDate)
            : base(id, title, uploadDate, duration, videoPath, thumbnailPath, publisher, username, picturePath, userId, views)
        {
            this.historyDate = historyDate;
        }

        public string HistoryDate { get => historyDate; set => historyDate = value; }
    }
}