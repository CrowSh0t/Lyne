// LyneBg/Controllers/Favorites/FavoritesController.cs
using Application.Abstractions;
using Application.Contracts.Favorites;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LyneBg.Controllers.Favorites
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FavoritesController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;
        private readonly ILogger<FavoritesController> _logger;

        public FavoritesController(IFavoriteService favoriteService, ILogger<FavoritesController> logger)
        {
            _favoriteService = favoriteService;
            _logger = logger;
        }

        // GET api/favorites — всі улюблені поточного користувача
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserFavoriteDto>>> GetMyFavorites()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null) return Unauthorized();

                var favorites = await _favoriteService.GetUserFavoritesAsync(userId);
                return Ok(favorites);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting favorites");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET api/favorites/{productId}/check — чи є товар в улюблених
        [HttpGet("{productId}/check")]
        public async Task<ActionResult<bool>> CheckIsFavorite(int productId)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null) return Unauthorized();

                var isFavorite = await _favoriteService.IsFavoriteAsync(userId, productId);
                return Ok(isFavorite);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error checking favorite for product {productId}");
                return StatusCode(500, "Internal server error");
            }
        }

        // POST api/favorites/{productId} — додати до улюблених
        [HttpPost("{productId}")]
        public async Task<ActionResult<UserFavoriteDto>> AddToFavorites(int productId)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null) return Unauthorized();

                var favorite = await _favoriteService.AddToFavoritesAsync(userId, productId);
                return Ok(favorite);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error adding product {productId} to favorites");
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE api/favorites/{productId} — видалити з улюблених
        [HttpDelete("{productId}")]
        public async Task<ActionResult> RemoveFromFavorites(int productId)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null) return Unauthorized();

                await _favoriteService.RemoveFromFavoritesAsync(userId, productId);
                return NoContent(); // 204 — без тіла відповіді
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error removing product {productId} from favorites");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
