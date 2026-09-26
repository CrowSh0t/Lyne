using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domains.Entities
{

    public enum InquiryStatus
    {
        New,
        InProgress,
        Resolved
    }

    public class SupportInquiry
    {
        public int Id { get; set; }

        public string? UserId { get; set; }
        public User? User { get; set; }

        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Subject { get; set; } = null!;
        public string Message { get; set; } = null!;

        public InquiryStatus Status { get; set; } = InquiryStatus.New;
        public string? AdminNote { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
