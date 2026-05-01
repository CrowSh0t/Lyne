using Application.Abstractions;

namespace Infrastructure.Services
{
    public class EmailSender : IEmailSender
    {
        public Task SendAsync(string email, string subject, string message)
        {
            // Поки що просто імітуємо відправку (виводимо в консоль)
            Console.WriteLine($"--- EMAIL SENT TO {email} ---");
            Console.WriteLine($"Subject: {subject}");
            Console.WriteLine($"Message: {message}");

            return Task.CompletedTask;
        }
    }
}