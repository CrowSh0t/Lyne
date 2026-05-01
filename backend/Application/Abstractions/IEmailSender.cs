using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Abstractions
{
    public interface iEmailSender
    {
        Task SendAsync(string to, string subject, string html);
    }
}
