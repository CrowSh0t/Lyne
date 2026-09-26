using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Application.Contracts.Auth
{
    public record RegisterRequestDto(
         string Login,
         string Email,
         string Password,
         string Name,
         DateTime Dob,       // Тут має бути DateTime, тоді помилка конвертації зникне
         string? Country     // ? означає, що поле може бути порожнім
     );
}
