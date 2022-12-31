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
using System.Web.Script.Serialization; 
using Service.AuthSharing.Executes.Base; 
using Service.Utility.Components;
using Service.Utility.Variables;
using Service.AuthSharing.Components;

namespace Service.Core.Components
{ 
    public class EmailComponent 
    {
        public string MailTo { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public AuthSharingService Service { get; set; } 
        public EmailComponent(AuthSharingService sev)
        {
            Service = sev;
        }
        public EmailComponent()
        {

        }

        private AlternateView GetEmbeddedLogo(string htmlBody)
        {
            var settings = Service.LocalSettingMany(true);
            var logo = settings.GetValue("general", "logo_web");
            LinkedResource res = new LinkedResource(FileComponent.GetFullPath(logo));
            res.ContentId = "logo";
            AlternateView alternateView = AlternateView.CreateAlternateViewFromString(htmlBody, null, MediaTypeNames.Text.Html);
            alternateView.LinkedResources.Add(res);
            return alternateView;
        }

        public CommandResult<bool> Send(MailObj email)
        {
            var settings = Service.LocalSettingMany(true);

            var host = settings.GetValue("general", "smtp_host");
            var port = settings.GetValue("general", "smtp_port");
            var ssl = settings.GetValue("general", "smtp_ssl");
            var m = settings.GetValue("general", "email_method");
            var method = m.HasValue() ? Int32.Parse(m) : 0;
            var sender = settings.GetValue("general", "smtp_sender_email");
            var name = settings.GetValue("general", "smtp_sender_name");
            var pass = settings.GetValue("general", "smtp_sender_password");
            var key = settings.GetValue("general", "smtp_client_key");

            try
            {
                if (method == 0)
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
                                var fp = FileComponent.GetFullPath(logo);
                                if (System.IO.File.Exists(fp))
                                {
                                    LinkedResource res = new LinkedResource(fp);
                                    res.ContentId = "logo";
                                    alternateView.LinkedResources.Add(res);
                                }
                                else
                                {
                                    Console.WriteLine("File not found: " + fp);
                                }
                            }
                        }

                        if (email.AlternateViews != null && email.AlternateViews.Any())
                        {
                            foreach (var item in email.AlternateViews)
                            {
                                var fp = FileComponent.GetFullPath(item.Path);
                                if (System.IO.File.Exists(fp))
                                {
                                    LinkedResource res = new LinkedResource(fp);
                                    res.ContentId = item.ContenId;
                                    alternateView.LinkedResources.Add(res);
                                }
                                else
                                {
                                    Console.WriteLine("File not found: " + fp);
                                }
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
                                if (System.IO.File.Exists(fp))
                                {
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
                            else
                            {
                                if (sender.HasValue() && pass.HasValue())
                                {
                                    smtpClient.Credentials = new NetworkCredential(sender, pass);
                                }
                                smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;

                                if (port.HasValue())
                                {
                                    smtpClient.Port = Int32.Parse(port);
                                    smtpClient.EnableSsl = ssl == "true";
                                }
                            }
                            //smtpClient.SendCompleted += new SendCompletedEventHandler(SendCompletedCallback);

                            smtpClient.Send(mailMessage);
                            mailMessage.Attachments.Dispose();
                            mailMessage.Dispose();
                        }
                    }
                }
                else
                {
                    var js = new JavaScriptSerializer();
                    var od = new
                    {
                        username = sender,
                        password = pass,
                        isLdap = true,
                        isOrg = true,
                        genToken = true,
                        clientName = "HRM",
                        clientKey = key
                    };
                    var result = HtmlComponent.PostDataToUrl("http://10.0.10.29/login", js.Serialize(od));

                    if (result != null)
                    {
                        var auth = js.Deserialize<OauthLoginResult>(result);
                        if (auth != null)
                        {
                            if (auth.Data != null)
                            {
                                try
                                {
                                    if (auth.Data.Items != null)
                                    {
                                        var ai = auth.Data.Items[0];
                                         
                                        var model = new EmailApiDataModel()
                                        {
                                            ClientKey = key,
                                            SenderName = name,
                                            Content = email.Body,
                                            HtmlBody = true,
                                            To = string.Join(",", email.To),
                                            Cc = email.Cc != null ? string.Join(",", email.Cc) : "",
                                            Subject = email.Subject,
                                            Attachs = new List<AttachApiDataModel>()
                                        };
                                        
                                        if (email.Attachs != null)
                                        {
                                            foreach (var a in email.Attachs)
                                            {
                                                var fp = FileComponent.GetFullPath(a);
                                                if (File.Exists(fp))
                                                {
                                                    byte[] bytes;
                                                    using (FileStream file = new FileStream(fp, FileMode.Open, FileAccess.Read))
                                                    {
                                                        bytes = new byte[file.Length];
                                                        file.Read(bytes, 0, (int)file.Length);

                                                        var f = new AttachApiDataModel
                                                        {
                                                            FileName = Path.GetFileName(fp),
                                                            Data = bytes
                                                        };
                                                        model.Attachs.Add(f);
                                                    }
                                                }
                                            }
                                        } 

                                        var r = PostEmailToken(host, js.Serialize(model), ai.token.access_token);
                                        if (r.Success)
                                        {
                                            return new CommandResult<bool>(true);
                                        }
                                        return new CommandResult<bool>(r.Message);
                                    }
                                }
                                catch (Exception e)
                                { 
                                    Service.LogError(e.GetInner());
                                    return new CommandResult<bool>(e.GetInner());
                                }
                            }
                        } 
                    }   
                }

                return new CommandResult<bool>(true);
            }
            catch (SmtpFailedRecipientsException e)
            {
                Service.LogError(e.Message + " - " + string.Join(";", email.To));
                return new CommandResult<bool>(e.Message + " - " + string.Join(";", email.To));
            }
            catch (Exception e)
            {
                var arr = new List<string>() { e.Message };
                if (e.InnerException != null)
                {
                    var i = e.InnerException;
                    arr.Add(i.Message);
                    if (i.InnerException != null)
                    {
                        var i2 = i.InnerException;
                        arr.Add(i2.Message);
                        if (i2.InnerException != null)
                        {
                            arr.Add(i2.InnerException.Message);
                        }
                    }
                }
                Service.LogError(string.Join(";", arr));
                return new CommandResult<bool>(string.Join(";", arr));
            } 
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
            var settings = Service.LocalSettingMany(true);
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
         
        private CommandResult<string> PostEmailToken(string url, string data, string token)
        {
            try
            { 
                var httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
                httpWebRequest.ContentType = "application/json; charset=utf-8";
                httpWebRequest.Method = "POST";
                httpWebRequest.Accept = "application/json; charset=utf-8";
                httpWebRequest.Headers.Add("Authorization", "Bearer " + token);

                using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                { 
                    streamWriter.Write(data);
                    streamWriter.Flush();
                    streamWriter.Close(); 
                    var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                    using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                    {
                        var jsonStr = streamReader.ReadToEnd();
                        return new CommandResult<string>(true, jsonStr);
                    }
                } 
            }
            catch (Exception e)
            {
                return new CommandResult<string>(e.GetInner());
            }
        }
    }
}