using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts.Auth
{
    public class LoginRequestDto
    {
        [Required]
        public string Login { get; set; } = ""; // email або username
        [Required]
        public string Password { get; set; } = "";
    }
}
