var builder = WebApplication.CreateBuilder(args);

// 1. РЕЄСТРУЄМО CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()    // Дозволяє запити з будь-яких адрес (localhost:3000, 5173 тощо)
              .AllowAnyHeader()    // Дозволяє будь-які заголовки (Content-Type, Authorization)
              .AllowAnyMethod();   // Дозволяє будь-які методи (GET, POST, PUT, DELETE)
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 2. ВМИКАЄМО CORS (Важливо: має бути перед UseAuthorization!)
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();