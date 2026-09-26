using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LyneBg.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public int ReturnBaseNumber()
        {
            return 67;
        }
    }
}
