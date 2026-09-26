using Application.Abstractions;
using Application.Contracts.Selling;
using Microsoft.AspNetCore.Mvc;


namespace LyneBg.Controllers.Selling
{
    [ApiController]
    [Route("api/[controller]")]
    public class SellingController : ControllerBase
    {
        private readonly ISellingService _sellingService;
        private readonly ILogger<SellingController> _logger;

        public SellingController(ISellingService sellingService, ILogger<SellingController> logger)
        {
            _sellingService = sellingService;
            _logger = logger;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SellingDto>>> GetAll()
        {
            try
            {
                var sellings = await _sellingService.GetAllSellingAsync();
                return Ok(sellings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting selling");
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<SellingDto>> GetById(int id)
        {
            try
            {
                var selling = await _sellingService.GetSellingByIdAsync(id);
                return Ok(selling);
            }
            catch (KeyNotFoundException ex) 
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Not found Selling ID {id}");
                return StatusCode(500, "Internal server error");
            }


        }
        [HttpPost]
        public async Task<ActionResult<SellingDto>> Create([FromBody] CreateSellingDto sellingDto) 
        {
            try 
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var createdSelling = await _sellingService.CreateSellingAsync(sellingDto);
                return CreatedAtAction(nameof(GetById), new { id = createdSelling.id }, createdSelling);
            }
            catch (Exception ex) 
            {
                _logger.LogError(ex, "Error creating Selling");
                return StatusCode(500, "Internal server");
            }
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<SellingDto>> Update(int id,[FromBody] UpdateSellingDto updateSellingDto) 
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var updateSelling = await _sellingService.UpdateSellingAsync(id, updateSellingDto);
                return Ok(updateSelling);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);

            }
           
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error update selling");
                return StatusCode(500, "Internal server");
            }
            
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult<SellingDto>> Delete(int id)
        {
            try
            {
                await _sellingService.DeleteSellingAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex) 
            {
                _logger.LogError(ex, $"Error deelete Selling ID {id}");
                return StatusCode(500, "Internal Server");
            }
        }
    }
}
