using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts.Inquiries
{
    public class UpdateInquiryStatusDto
    {
        public int Status { get; set; }
        public string? AdminNote { get; set; }
    }
}
