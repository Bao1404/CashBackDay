using System.ComponentModel.DataAnnotations;

namespace CashBackDay.Models
{
    public class RegisterViewModel
    {
        [Required(ErrorMessage = "Tên không được để trống!")]
        public string FullName { get; set; }
        [Required(ErrorMessage = "Email không được để trống")]
        public string Email { get; set; }
        [Required(ErrorMessage = "SĐT không được để trống")]
        public string PhoneNumber { get; set; }
        [Required(ErrorMessage = "Bắt buộc")]
        public string Password { get; set; }
        [Required(ErrorMessage = "Bắt buộc")]
        [Compare("Password", ErrorMessage = "Mật khẩu không khớp")]
        public string ConfirmPassword { get; set; }
    }
}
