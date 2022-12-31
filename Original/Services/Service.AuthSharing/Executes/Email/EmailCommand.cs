using System;
using System.Net;
using System.Net.Mail;
using System.Text;
using Service.AuthSharing.Components;
using Service.Core.Executes.Email;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        private string SmtpHost { get; set; }
        private string SmtpEmail { get; set; }
        private string SmtpPassword { get; set; }

        private void EmailInit()
        {
            var settings = LocalSettingMany(true);
            SmtpHost = settings.GetValue("general", "smtp_host");
            SmtpEmail = settings.GetValue("general", "smtp_email");
            SmtpPassword = settings.GetValue("general", "smtp_email_password");
        }
        public bool SendEmail(EmailModel email, string body)
        {
            EmailInit();
            MailMessage mailMessage = new MailMessage();
            foreach (var receiver in email.Receivers)
            {
                mailMessage.To.Add(receiver);
            }

            mailMessage.From = new MailAddress(SmtpEmail, "", Encoding.UTF8);
            mailMessage.Subject = email.Subject;
            mailMessage.IsBodyHtml = true;
            mailMessage.Body = body;
            mailMessage.SubjectEncoding = Encoding.UTF8;
            try
            {
                using (SmtpClient client = new SmtpClient())
                {
                    client.EnableSsl = true;
                    client.Host = SmtpHost; // "smtp.gmail.com";
                    client.Port = 25;
                    client.UseDefaultCredentials = true;
                    client.Credentials = new NetworkCredential(SmtpEmail, SmtpPassword);
                    client.DeliveryMethod = SmtpDeliveryMethod.Network;

                    //smtpClient.SendCompleted += new SendCompletedEventHandler(SendCompletedCallback);
                    client.Send(mailMessage);


                    LogInfo("Đã gửi email đến " + string.Join(", ", email.Receivers), "Email");
                }

                return true;
            }
            catch (Exception e)
            {
                LogError(e.Message, "Email");
                return false;
            }
        }
        public bool SendEmail(EmailModel email, AlternateView alternateView)
        {
            EmailInit();
            MailMessage mailMessage = new MailMessage();
            foreach (var receiver in email.Receivers)
            {
                mailMessage.To.Add(receiver);
            }
            mailMessage.From = new MailAddress(SmtpEmail, "", Encoding.UTF8);
            mailMessage.Subject = email.Subject;
            mailMessage.IsBodyHtml = true;
            mailMessage.SubjectEncoding = Encoding.UTF8;
            mailMessage.AlternateViews.Add(alternateView);
            try
            {
                using (SmtpClient client = new SmtpClient())
                {
                    client.EnableSsl = true;
                    client.Host = "smtp.gmail.com";
                    client.Port = 25;
                    client.UseDefaultCredentials = true;
                    client.Credentials = new NetworkCredential("thson.spys@gmail.com", "hongson123");
                    client.DeliveryMethod = SmtpDeliveryMethod.Network;

                    //client.Host = SmtpHost; // "smtp.gmail.com";
                    //client.EnableSsl = true;
                    //client.Port = 25;
                    //client.Credentials = new NetworkCredential("thson.spys@gmail.com", "hongson123");
                    //client.DeliveryMethod = SmtpDeliveryMethod.Network;

                    //client.UseDefaultCredentials = true;
                    //smtpClient.SendCompleted += new SendCompletedEventHandler(SendCompletedCallback);
                    client.Send(mailMessage);

                    LogInfo("Đã gửi email đến " + string.Join(", ", email.Receivers), "Email");
                }

                return true;
            }
            catch (Exception e)
            {
                LogError(e.Message, "Email");
                return false;
            }
        }
    }
}
