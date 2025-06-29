using BookingTicketSysten.Models.DTOs.UserDTOs;
using BookingTicketSysten.Services.UserSerivce;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectHouseWithLeaves.Helper.PasswordHasing;

namespace BookingTicketSysten.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllUserAsync()
        {
            var users = await _userService.GetAllUserAsync();
            if (!users.Any())
            {
                return Ok(new
                {
                    Message = "Empty user"
                });
            }
            return Ok(new
            {
                Message = "Success",
                data = users
            });
        }
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromForm] UserCreateDTOs userCreateDTO)
        {
            var result = await _userService.CreateUserAsync(userCreateDTO);
            if (result == null)
            {
                return BadRequest(new { message = "Email đã tồn tại" });
            }
            return Ok(new { message = "Tạo tài khoản thành công" });
        }
        [HttpPut("{email}")]
        public async Task<IActionResult> UpdateUserByEmail(string email, [FromForm] UserUpdateDTOs userUpdateDTO)
        {
            var result = await _userService.UpdateUserAsync(email, userUpdateDTO);
            if (result == null)
            {
                return BadRequest(new { message = "Email Không tồn tại" });
            }
            return Ok(new
            {
                message = "Update thành công",
                data = userUpdateDTO
            });
        }
        [HttpGet("{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var user = await _userService.GetUserByEmailAsync(email);
            if (user != null)
            {
                return Ok(new
                {
                    Message = "Successfull",
                    data = user
                });
            }
            return Ok(new
            {
                Message = "fail data not exits"
            });
        }
        [HttpDelete("{email}")]
        public async Task<IActionResult> DeleteUserByEmail(string email)
        {
            var result = await _userService.DeleteUserAsync(email);
            if (result)
            {
                return Ok(new
                {
                    Message = "Delete success"
                });
            }
            return Ok(new
            {
                Message = "Delete fail"
            });
        }
        [HttpPost("update-password-forgetpassword")]
        public async Task<IActionResult> UpdatePasswordByEmail([FromBody] UpdatePasswordDTO updatePasswordDTO)
        {
            if (updatePasswordDTO.Password != updatePasswordDTO.ConfirmPassword)
            {
                return BadRequest(new
                {
                    Message = "password and confirm password is not match"
                });
            }
            var result = await _userService.UpdatePasswordAsync(updatePasswordDTO.Email, updatePasswordDTO.Password);
            if (result == null)
            {
                return BadRequest(new { message = "Email không tồn tại" });
            }
            return Ok(new
            {
                Message = "Update sucessfully"
            });
        }
        [HttpPost("change-password-upadateprofile")]
        public async Task<IActionResult> ChangePasswordByEmail([FromBody] ChangePasswordDtos changePasswordDtos)
        {
            var user = await _userService.GetUserByEmailAsync(changePasswordDtos.Email);
            if (user == null)
            {
                return BadRequest(new { message = "Email không tồn tại" });
            }

            var passwordEnter = PasswordHassing.ComputeSha256Hash(changePasswordDtos.OldPassword);
            if (user.PasswordHash != passwordEnter)
            {
                return BadRequest(new { message = "mật khẩu cũ không đúng" });
            }
            if (changePasswordDtos.Password != changePasswordDtos.ConfirmPassword)
            {
                return BadRequest(new { message = "mật khẩu mới nhập không trùng" });
            }
            var result = await _userService.UpdatePasswordAsync(changePasswordDtos.Email, changePasswordDtos.Password);
            if (result == null)
            {
                return BadRequest(new { message = "Email không tồn tại" });
            }
            return Ok(new
            {
                Message = "Thay đổi mật thành công"
            });
        }
    }
}
