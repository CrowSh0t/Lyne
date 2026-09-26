using Application.Abstractions;
using Application.Contracts.Inquiries;
using Application.Contracts.Inquiry;
using Domains.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace LyneBg.Controllers.Support
{
    [ApiController]
    [Route("api/[controller]")]
    public class InquiriesController : ControllerBase
    {
        private readonly IInquiryService _inquiryService;

        public InquiriesController(IInquiryService inquiryService)
        {
            _inquiryService = inquiryService;
        }

        // Пользователь отправляет обращение
        [HttpPost]
        public async Task<ActionResult<InquiryDto>> Create([FromBody] CreateInquiryDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var email = User.FindFirstValue(ClaimTypes.Email);
            var name = User.FindFirstValue(ClaimTypes.Name);

            var result = await _inquiryService.CreateInquiryAsync(dto, userId, email, name);
            return Ok(result);
        }

        // Пользователь смотрит историю своих обращений
        [Authorize]
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<InquiryDto>>> GetMyInquiries()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _inquiryService.GetUserInquiriesAsync(userId);
            return Ok(result);
        }

        // === Эндпоинты для админ-панели ===

        // Админ получает все обращения (можно фильтровать: ?status=1)
        [Authorize(Roles = "Admin")]
        [HttpGet("admin/all")]
        public async Task<ActionResult<IEnumerable<InquiryDto>>> GetAllForAdmin([FromQuery] InquiryStatus? status)
        {
            var result = await _inquiryService.GetAllInquiriesAsync(status);
            return Ok(result);
        }

        // Админ открывает карточку конкретного обращения
        [Authorize(Roles = "Admin")]
        [HttpGet("admin/{id:int}")]
        public async Task<ActionResult<InquiryDto>> GetByIdForAdmin(int id)
        {
            var result = await _inquiryService.GetByIdAsync(id);
            return Ok(result);
        }

        // Админ обновляет статус и/или оставляет ответ
        [Authorize(Roles = "Admin")]
        [HttpPatch("admin/{id:int}/status")]
        public async Task<ActionResult<InquiryDto>> UpdateStatus(int id, [FromBody] UpdateInquiryStatusDto dto)
        {
            var result = await _inquiryService.UpdateStatusAsync(id, dto);
            return Ok(result);
        }
    }
}