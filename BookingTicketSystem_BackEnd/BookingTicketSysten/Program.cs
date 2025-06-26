using Amazon.Runtime;
using Amazon.S3;
using BookingTicketSysten.Models;
using BookingTicketSysten.Models.DTOs.StoreDTO;
using BookingTicketSysten.Services.BookingServices;
using BookingTicketSysten.Services.GenerService;
using BookingTicketSysten.Services.MovieServices;
using BookingTicketSysten.Services.PersonServices;
using BookingTicketSysten.Services.ShowServices;
using BookingTicketSysten.Services.StoreService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace BookingTicketSysten
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            #region Database_Context
            builder.Services.AddControllers();
            builder.Services.AddDbContext<MovieTicketBookingSystemContext>(options =>
                 options.UseSqlServer(builder.Configuration.GetConnectionString("MyCnn")));
            #endregion
           
            #region CORS
            // Add CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder =>
                    {
                        builder.AllowAnyOrigin()
                               .AllowAnyMethod()
                               .AllowAnyHeader();
                    });
            });
            #endregion

            #region s3Client_with_DI
            builder.Services.Configure<R2Config>(builder.Configuration.GetSection("R2"));
            var r2Config = builder.Configuration.GetSection("R2").Get<R2Config>();

            var s3Config = new AmazonS3Config { ServiceURL = r2Config.Endpoint };
            var credentials = new BasicAWSCredentials(r2Config.AccessKey, r2Config.SecretKey);
            builder.Services.AddSingleton<IAmazonS3>(new AmazonS3Client(credentials, s3Config));

            #endregion

            #region DI_Services

            builder.Services.AddScoped<IPersonService, PersonService>();
            builder.Services.AddScoped<IMovieService, MovieService>();
            builder.Services.AddScoped<IGenreService, GenreService>();
            builder.Services.AddScoped<IStorageService, R2StorageService>();

            builder.Services.AddScoped<IShowService, ShowService>();
            builder.Services.AddScoped<IBookingService, BookingService>();

            #endregion


            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors("AllowAll");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
