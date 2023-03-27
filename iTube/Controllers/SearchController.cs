using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using iTube.Models;

namespace iTube.Controllers
{
    public class SearchController : ApiController
    {
        [HttpPost]
        [Route("api/search")]
        // Search video
        public IHttpActionResult SearchVideo(SearchRequest search)
        {
            RespondDataSearch<FetchVideoRow> respondVideos = Video.SearchVideo(search.Query, search.Page, search.Orderby);
            if (respondVideos == null)
            {
                return BadRequest("Couldn't fetch videos");
            }
            return Ok(respondVideos);
        }

        [HttpPost]
        [Route("api/search/suggestion")]
        // Suggestions for video search
        public IHttpActionResult SuggestVideo(Query query)
        {
            if(query == null)
                return BadRequest("Query is null");
            if(query.GetQuery().Length == 0)
                return BadRequest("Query is empty");
            List<FetchVideoRow> videos = Video.SuggestVideo(query.GetQuery());
            if (videos == null)
                return BadRequest("Couldn't fetch videos");
            return Ok(new RespondData<FetchVideoRow>(videos));
        }
    }
}
