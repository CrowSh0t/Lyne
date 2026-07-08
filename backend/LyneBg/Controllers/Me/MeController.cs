using Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[ApiController]
[Route("api/me")]
[Authorize]
public sealed class MeController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public MeController(ApplicationDbContext db)
    {
        _db = db;
    }
    [HttpGet]
    public async Task<IActionResult> GetMe(CancellationToken ct)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var user = await _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId, ct);
        if (user == null) return NotFound("User not found");

        return Ok(new
        {
            id = user.Id,
            email = user.Email,
            name = user.Name,
            dob = user.Dob,
            country = user.Country,
            role = user.Role,
        });
    }
}