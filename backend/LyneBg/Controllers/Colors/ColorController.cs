// LyneBg/Controllers/ColorsController.cs
using Application.Contracts.Color;
using Domains.Entities;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LyneBg.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ColorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ColorsController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<List<ColorDto>>> GetAll()
        {
            var colors = await _context.Colors.Select(c => new ColorDto
            {
                Id = c.Id,
                Name = c.Name,
                HexCode = c.HexCode
            }).ToListAsync();
            return Ok(colors);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ColorDto>> GetById(int id)
        {
            var color = await _context.Colors.FindAsync(id);
            if (color == null) return NotFound();
            return new ColorDto { Id = color.Id, Name = color.Name, HexCode = color.HexCode };
        }

        [HttpPost]
        public async Task<ActionResult<ColorDto>> Create(CreateColorDto dto)
        {
            var color = new Color { Name = dto.Name, HexCode = dto.HexCode };
            _context.Colors.Add(color);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = color.Id }, new ColorDto { Id = color.Id, Name = color.Name, HexCode = color.HexCode });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var color = await _context.Colors.FindAsync(id);
            if (color == null) return NotFound();
            _context.Colors.Remove(color);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}