using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Web.Student.Models
{
    public class LoginModel
    {
        [Required(ErrorMessage = "Tên đăng nhập không được rỗng")]
        public string LoginName { get; set; }
        [Required(ErrorMessage = "Mật khẩu không được rỗng")]
        public string Password { get; set; }
        public string ReturnUrl { get; set; }
        public int Role { get; set; }


    }
    public class CustomSerializeModel
    {
        public Guid UserId { get; set; }
        public string FullName { get; set; }
        public string RoleName { get; set; }

    }

    public class ChangePasswordModel
    {
        [Required(ErrorMessage = "Anh/chị vui lòng nhập mật khẩu mới")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required(ErrorMessage = "Anh/chị vui lòng nhập lại mật khẩu mới")]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Lỗi: mật khẩu nhập lại không đúng")]
        public string ConfirmPassword { get; set; }

        public bool Success { get; set; }
        public string Message { get; set; }
    }
    public class RegistrationView
    {
        [Required(ErrorMessage = "User Name required")]
        [Display(Name = "User Name")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Họ tên không phù hợp! Mời nhập lại")]
        [Display(Name = "Họ tên")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Tên không phù hợp! Mời  nhập lại")]
        [Display(Name = "Tên")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Email không phù hợp! Mời  nhập lại")]
        [DataType(DataType.EmailAddress)]
        [Display(Name = "Email")]
        public string Email { get; set; }
        [Required]
        public Guid ActivationCode { get; set; }

        [Required(ErrorMessage = "Password required")]
        [DataType(DataType.Password)]
        [Display(Name = "Mật khẩu")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Confirm Password required")]
        [DataType(DataType.Password)]
        [Display(Name = "Nhập lại Mật khẩu")]
        [Compare("Password", ErrorMessage = "Error : Mục mật khẩu nhập lại chưa khớp với mục nhập mật khẩu")]
        public string ConfirmPassword { get; set; }



    }
}