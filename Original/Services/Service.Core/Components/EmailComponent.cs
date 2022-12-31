using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc; 
using Service.Core.Executes.Base;
using Service.Core.Executes.Email;
using Service.Utility.Variables;

namespace Service.Core.Components
{
    public class MailObj
    {
        public List<string> To { get; set; }
        public string SenderName { get; set; }
        public List<string> Cc { get; set; }
        public List<string> Attachs { get; set; }
        [AllowHtml]
        public string Body { get; set; }
        public string Subject { get; set; }
        public bool HasLogo { get; set; }
        public List<AlternateViewModel> AlternateViews { get; set; }
    }
    public class EmailComponent
    { 
        public string MailTo { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        private ServerService Service { get; set; }

        public EmailComponent(ServerService sev)
        {
            Service = sev;
        }

        private AlternateView GetEmbeddedLogo(string htmlBody)
        {
            var settings = Service.AppSettingMany(true); 
            var logo = settings.GetValue("general", "logo_web");
            LinkedResource res = new LinkedResource(FileComponent.GetFullPath(logo));
            res.ContentId = "logo"; 
            AlternateView alternateView = AlternateView.CreateAlternateViewFromString(htmlBody, null, MediaTypeNames.Text.Html);
            alternateView.LinkedResources.Add(res);
            return alternateView;
        }

        public CommandResult<bool> Send(MailObj email)
        { 
            var settings = Service.AppSettingMany(true);
            var host = settings.GetValue("general", "smtp_host");
            var sender = settings.GetValue("general", "smtp_sender_email");
            var name = settings.GetValue("general", "smtp_sender_name");
            var pass = settings.GetValue("general", "smtp_sender_password");

            try
            {
                using (var mailMessage = new MailMessage())
                {
                    foreach (var e in email.To)
                    {
                        mailMessage.To.Add(e);
                    }

                    var body = email.Body;
                    AlternateView alternateView = AlternateView.CreateAlternateViewFromString(body, null, MediaTypeNames.Text.Html);

                    if (email.HasLogo)
                    {
                        var logo = settings.GetValue("general", "logo_web");
                        if (logo.HasValue())
                        {
                            LinkedResource res = new LinkedResource(FileComponent.GetFullPath(logo));
                            res.ContentId = "logo";
                            alternateView.LinkedResources.Add(res);
                        } 
                    }



                    if (email.AlternateViews != null && email.AlternateViews.Any())
                    {  
                        foreach (var item in email.AlternateViews)
                        {
                            var fp = FileComponent.GetFullPath(item.Path);
                            LinkedResource res = new LinkedResource(fp);
                            res.ContentId = item.ContenId;
                            alternateView.LinkedResources.Add(res);
                        }
                    } 

                    mailMessage.AlternateViews.Add(alternateView); 
                    mailMessage.From = new MailAddress(sender, name, Encoding.UTF8);
                    mailMessage.Subject = email.Subject;
                    
                    mailMessage.IsBodyHtml = true;
                    mailMessage.SubjectEncoding = Encoding.UTF8;

                    if (email.Cc != null)
                    {
                        foreach (var c in email.Cc)
                        {
                            mailMessage.CC.Add(c);
                        }
                    }
                    

                    if (email.Attachs != null)
                    {
                        foreach (var a in email.Attachs)
                        {
                            var fp = FileComponent.GetFullPath(a);
                            Attachment data = new Attachment(fp, MediaTypeNames.Application.Octet);
                            // Add time stamp information for the file.
                            ContentDisposition disposition = data.ContentDisposition;
                            disposition.CreationDate = System.IO.File.GetCreationTime(fp);
                            disposition.ModificationDate = System.IO.File.GetLastWriteTime(fp);
                            disposition.ReadDate = System.IO.File.GetLastAccessTime(fp);
                            disposition.FileName = Path.GetFileName(fp);
                            mailMessage.Attachments.Add(data);
                        }
                    }
                    using (SmtpClient smtpClient = new SmtpClient())
                    {
                        smtpClient.Host = host;
                        smtpClient.UseDefaultCredentials = true;

                        if (host == "smtp.gmail.com")
                        {
                            smtpClient.EnableSsl = true;
                            smtpClient.Port = 25;
                            smtpClient.Credentials = new NetworkCredential(sender, pass);
                            smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                        }

                        //smtpClient.SendCompleted += new SendCompletedEventHandler(SendCompletedCallback);

                        smtpClient.Send(mailMessage); 
                        mailMessage.Attachments.Dispose();
                        mailMessage.Dispose();

                    }
                }

                return new CommandResult<bool>(true);
            }
            catch (Exception e)
            {
                Service.LogError(e.Message);
                return new CommandResult<bool>(e.Message);
            }

            //string smtp_host = string.Format(Functiontring.ReturnStringFormatthongtincauhinhmail("smtp_host"));
            //string smtp_user_mailgui = string.Format(Functiontring.ReturnStringFormatthongtincauhinhmail("smtp_user"));
            //System.Net.Mail.MailMessage message = new System.Net.Mail.MailMessage(smtp_user_mailgui, mailbankiemsoat);
            //message.From = new MailAddress(smtp_user_mailgui.Trim(), subjectgm, System.Text.Encoding.UTF8);
            //message.Subject = subjectgm;
            //message.Body = sb.ToString();
            //message.BodyEncoding = System.Text.Encoding.UTF8;
            //message.IsBodyHtml = true;
            //message.Priority = MailPriority.High;
            //SmtpClient client = new SmtpClient(smtp_host);
            //client.UseDefaultCredentials = true;
            //try
            //{
            //    client.Send(message);
            //    return "1";
            //}
            //catch (Exception ex)
            //{
            //    Console.WriteLine("Exception caught in CreateTestMessage2(): {0}", ex.ToString());
            //    return "-1";
            //}
        }
        public void Send(string mailTo, string subject, string body)
        {
            MailTo = mailTo;
            Subject = subject;
            Body = body;
            new Task(SendAsync).Start();
        }

        private void SendAsync()
        {
            var settings = Service.AppSettingMany(true);
            var sender = settings.GetValue("general", "smtp_email");
            var pass = settings.GetValue("general", "smtp_email_password");
            MailMessage mailMessage = new MailMessage();
            mailMessage.To.Add(MailTo);
            mailMessage.From = new MailAddress(
                sender, string.Format("=?utf-8?B?{0}?=", Convert.ToBase64String(Encoding.UTF8.GetBytes("Spress.vn"))));
            mailMessage.Subject = Subject;
            mailMessage.Body = Body;
            mailMessage.IsBodyHtml = true;
            mailMessage.SubjectEncoding = Encoding.UTF8;
            try
            {
                using (SmtpClient smtpClient = new SmtpClient())
                {
                    smtpClient.EnableSsl = true;
                    smtpClient.Host = "smtp.gmail.com";
                    smtpClient.Port = 25;
                    smtpClient.UseDefaultCredentials = true;
                    smtpClient.Credentials = new NetworkCredential(sender, pass);
                    smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                    //smtpClient.SendCompleted += new SendCompletedEventHandler(SendCompletedCallback);
                    smtpClient.Send(mailMessage);
                }
            }
            catch (Exception e)
            {
                Service.LogError(e.Message);
            }
        }
    }
}