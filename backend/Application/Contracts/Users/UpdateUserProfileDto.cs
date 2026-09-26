using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts.Users
{
    public class UpdateUserProfileDto
    {
        public string? Avatar { get; set; }
        public string? Country { get; set; }
        public string? Status { get; set; }
    }
}
