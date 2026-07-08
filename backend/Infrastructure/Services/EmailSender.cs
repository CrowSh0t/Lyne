using Application.Abstractions;

namespace Infrastructure.Services
{
    public class EmailSender : IEmailSender
    {
        public Task SendAsync(string email, string subject, string message)
        {
            Console.WriteLine($"--- EMAIL SENT TO {email} ---");
            Console.WriteLine($"Subject: {subject}");
            Console.WriteLine($"Message: {message}");

            return Task.CompletedTask;
        }
    }
}