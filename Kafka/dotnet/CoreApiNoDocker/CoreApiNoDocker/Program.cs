using CoreApiNoDocker;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
var kafka = new Kafka();

app.MapGet("/subjectRegistration", async (int subjectId, int studentId) =>
{
    kafka.RegisterSubject(subjectId, studentId);
    var msg = await kafka.GetResult();
    return new SubjectRegistrationResponse(Result: msg);
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();

internal record SubjectRegistrationResponse(string Result);