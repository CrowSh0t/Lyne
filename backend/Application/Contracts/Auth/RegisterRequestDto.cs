using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Application.Contracts.Auth
{
    public class RegisterRequestDto
    {
        [Required, StringLength(50)]
        public string Name { get; set; } = "";

        [Required, EmailAddress, StringLength(254)]
        public string Email { get; set; } = "";

        [Required] // "YYYY-MM-DD"
        public string Dob { get; set; } = "";

        [Required, StringLength(2)]
        public string Country { get; set; } = "UK";

    }
}
