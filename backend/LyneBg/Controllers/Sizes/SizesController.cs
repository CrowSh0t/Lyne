// LyneBg/Controllers/SizesController.cs
using Application.Contracts.Size;
using Domains.Entities;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LyneBg.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SizesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public SizesController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<List<SizeDto>>> GetAll()
        {
            var sizes = await _context.Sizes.Select(s => new SizeDto
            {
                Id = s.Id,
                Name = s.Name
            }).ToListAsync();
            return Ok(sizes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SizeDto>> GetById(int id)
        {
            var size = await _context.Sizes.FindAsync(id);
            if (size == null) return NotFound();
            return new SizeDto { Id = size.Id, Name = size.Name };
        }

        [HttpPost]
        public async Task<ActionResult<SizeDto>> Create(CreateSizeDto dto)
        {
            var size = new Size { Name = dto.Name };
            _context.Sizes.Add(size);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = size.Id }, new SizeDto { Id = size.Id, Name = size.Name });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var size = await _context.Sizes.FindAsync(id);
            if (size == null) return NotFound();
            _context.Sizes.Remove(size);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}