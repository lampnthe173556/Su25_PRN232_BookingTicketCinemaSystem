using Amazon.Runtime;
using Amazon.S3;
using BookingTicketSysten.Extensions;
using BookingTicketSysten.Middleware;
using BookingTicketSysten.Models;
using BookingTicketSysten.Models.DTOs.StoreDTO;
using BookingTicketSysten.Services.CinemaHallServices;
using BookingTicketSysten.Services.CinemaServices;
using BookingTicketSysten.Services.CommentServices;
using BookingTicketSysten.Services.GenerService;
using BookingTicketSysten.Services.MovieServices;
using BookingTicketSysten.Services.PersonServices;
using BookingTicketSysten.Services.SeatServices;
using BookingTicketSysten.Services.StoreService;
using BookingTicketSysten.Services.VoteServices;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProjectHouseWithLeaves.Helper.Email;
using System.Text;
using System.Text.Json.Serialization;

namespace BookingTicketSysten
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            #region Database_Context
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                });
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
            builder.Services.AddScoped<BookingTicketSysten.Services.VoteServices.IVoteService, BookingTicketSysten.Services.VoteServices.VoteService>();
            builder.Services.AddScoped<BookingTicketSysten.Services.MovieServices.IMovieFavoriteService, BookingTicketSysten.Services.MovieServices.MovieFavoriteService>();
            builder.Services.AddScoped<IVoteService, VoteService>();
            builder.Services.AddScoped<ICommentService, CommentService>();
            builder.Services.AddScoped<ICinemaService, CinemaService>();
            builder.Services.AddScoped<ICinemaHallService, CinemaHallService>();
            builder.Services.AddScoped<ISeatService, SeatService>();



            // Add Payment Services
            builder.Services.AddPaymentServices();
            
            // Add City Services
            builder.Services.AddCityServices();

            #endregion

            #region IConfiguration
            builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
            #endregion
            #region mapper
            
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

            // Add Payment Logging Middleware
            app.UsePaymentLogging();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
