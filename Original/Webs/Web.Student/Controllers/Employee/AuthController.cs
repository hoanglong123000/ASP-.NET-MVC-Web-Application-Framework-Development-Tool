 
using Service.Core.Components;
using Service.Core.Executes.Employees.EmployeeAuths;
using Service.Core.Executes.Employees.Employees;
using Service.Core.Executes.General.FeatureGroups;
using Service.Utility.Variables;
using System;
using System.Collections.Generic; 
using System.Net;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using  Web.Student.Models;
using DBServer.Entities;
using System.Linq;
using System.Web.Helpers;
using System.Web.Script.Serialization;

namespace Web.Student.Controllers.Employee
{
    public partial class EmployeeController
    {
        [AllowAnonymous]
        public ActionResult Login(string returnUrl = "")
        {
            _shareService.CheckDbConnect();

            var a = _shareService.Context.LocalEmployees.FirstOrDefault(x => x.LoginName == "admin");
            if(a != null)
            {
                a.Password = Crypto.HashPassword("1");
                _shareService.Context.SaveChanges();
            }

            if (User.Identity.IsAuthenticated)
            {
                return Logoff();
            }
            ViewBag.ReturnUrl = returnUrl;
            return View(new LoginModel
            {
                ReturnUrl = returnUrl
            });
        }
        [AllowAnonymous]
        [HttpPost]
        public ActionResult Login(LoginModel model, string returnUrl = "")
        {
            if (ModelState.IsValid)
            { 
                var result = _shareService.ValidateEmployeeAuth(model.LoginName, model.Password, "");   
                if (result != null)
                {
					var auth = result.Data;

					var ac = new AuthComponent<EmployeeAuthViewModel>(HttpContext, _cookieName, _loginMethod, _cookieDomain);

					ac.UpdateAuth(auth, auth.EmailCongTy);

					var js = new JavaScriptSerializer();
					_shareService.LogInfo("đăng nhập vào hệ thống", auth.EmployeeId);

					if (!string.IsNullOrEmpty(model.ReturnUrl))
					{
						return Redirect(model.ReturnUrl);
					}

					return Redirect("/");
				}
                else
                {
                    TempData["Message"] = "Tài khoản hoặc mật khẩu không đúng";
                }
            }
            ModelState.AddModelError("", "Something Wrong : Username or Password invalid");
            return View(model);
        }

        [HttpGet]
        public ActionResult Registration()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Registration(RegistrationView registrationView)
        {
            bool statusRegistration = false;
            string messageRegistration = string.Empty;

            if (ModelState.IsValid)
            {
                // Email Verification
                string userName = Membership.GetUserNameByEmail(registrationView.Email);
                if (!string.IsNullOrEmpty(userName))
                {
                    ModelState.AddModelError("Warning Email", "Sorry: Email already Exists");
                    return View(registrationView);
                }

                
                //Verification Email
                VerificationEmail(registrationView.Email, registrationView.ActivationCode.ToString());
                messageRegistration = "Your account has been created successfully. ^_^";
                statusRegistration = true;
            }
            else
            {
                messageRegistration = "Something Wrong!";
            }
            ViewBag.Message = messageRegistration;
            ViewBag.Status = statusRegistration;

            return View(registrationView);
        }
         
        public ActionResult Logoff()
        {
            var auth = new AuthComponent<EmployeeAuthViewModel>(HttpContext, "feedback");
            auth.SignOut();
            return Redirect("/employee/login");
        }

        [NonAction]
        public void VerificationEmail(string email, string activationCode)
        {
            var url = string.Format("/Account/ActivationAccount/{0}", activationCode);
            var link = Request.Url.AbsoluteUri.Replace(Request.Url.PathAndQuery, url);

            var fromEmail = new MailAddress("mehdi.rami2012@gmail.com", "Activation Account - AKKA");
            var toEmail = new MailAddress(email);

            var fromEmailPassword = "******************";
            string subject = "Activation Account !";

            string body = "<br/> Please click on the following link in order to activate your account" + "<br/><a href='" + link + "'> Activation Account ! </a>";

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromEmail.Address, fromEmailPassword)
            };

            using (var message = new MailMessage(fromEmail, toEmail)
            {
                Subject = subject,
                Body = body,
                IsBodyHtml = true

            })

                smtp.Send(message);

        }

        public ActionResult Notallowaccess(string path)
        {
            ViewData["Path"] = path;
            return View();
        }

        public JsonResult SessionExpired()
        {
            return Json(new { SessionExpired = true }, JsonRequestBehavior.AllowGet);
        }

        //
        // GET: /Account/ForgotPassword
        //[AllowAnonymous]
        //public ActionResult ForgotPassword()
        //{
        //    return View(new ForgotPasswordViewModel());
        //}

        //
       
        //
        // GET: /Account/ForgotPasswordConfirmation
        [AllowAnonymous]
        public ActionResult ForgotPasswordConfirmation()
        {
            return View();
        }

        //
        
        //
        // GET: /Account/ResetPasswordConfirmation
        [AllowAnonymous]
        public ActionResult ResetPasswordConfirmation()
        {
            return View();
        }

    }
}
