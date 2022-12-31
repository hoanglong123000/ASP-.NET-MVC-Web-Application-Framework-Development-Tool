using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Text; 
using System.Web.Script.Serialization;
using DBContext.AuthSharing.Entities;
using Service.AuthSharing.Components;
using Service.Core.Components;
using Service.Core.Executes.Email;
using Service.Utility.Components; 
using Service.Utility.Variables;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public CommandResult<bool> EmailTaskCommand(LocalEmailTask model)
        {
            CheckDbConnect();
            try
            {
                var d = new LocalEmailTask
                {
                    Id = 0,
                    CreatedDate = DateTime.Now,
                    Subject = model.Subject,
                    ReceiverType = model.ReceiverType,
                    Receivers = model.Receivers,
                    CC = model.CC,
                    CCType = model.CCType,
                    BodyPath = model.BodyPath,
                    Attachs = model.Attachs,
                    Note = model.Note,
                    ObjectGuid = model.ObjectGuid,
                    ObjectId = model.ObjectId,
                    AlternateViews = model.AlternateViews,
                    Module = model.Module,
                    EmailType = model.EmailType,
                    SentNumber = model.SentNumber,
                    Remind = model.Remind,
                    Status = model.Status
                };

                if (d.Id == 0)
                {
                    Context.LocalEmailTasks.Add(d);
                }

                Context.SaveChanges();

                if (d.Status == 0)
                {
                    return SendLocalEmail(d);
                }

                return new CommandResult<bool>(true);
            }
            catch (DbEntityValidationException e)
            {
                var message = "";
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        message += new StringBuilder().AppendFormat("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName, ve.ErrorMessage).ToString();
                    }
                }
                Console.WriteLine(message);
                LogError(message, "EmailTask");

                return null;
            }
        }

        public CommandResult<bool> CreateEmailTaskWithBody(LocalEmailTask model, string body)
        {
            var path = FileComponent.DateFolder("/media/emails/", null) + "/" + StringComponent.Guid(10) + ".html";
            var fp = FileComponent.GetFullPath(path);
            if (!System.IO.File.Exists(fp))
            {
                System.IO.File.Create(fp).Dispose();
            }
            System.IO.File.WriteAllText(fp, body);
            model.BodyPath = path;
             
            return EmailTaskCommand(model);
        }

        private CommandResult<bool> SendLocalEmail(LocalEmailTask email)
        {
            CheckDbConnect();
            var settings = LocalSettingMany(true);

            var sender = new EmailComponent(this);
             
            bool allowSent;
            string message;

            var exceptions = settings.GetValue("general", "exception_email");
              
            allowSent = true;
            message = "";

            if (email.Receivers.HasValue())
            {
                email.Receivers = RemoveException(email.Receivers, exceptions);
                if (email.CC.HasValue())
                {
                    email.CC = RemoveException(email.CC, exceptions);
                }

                if (IsNotException(email, exceptions))
                {
                    var eo = new MailObj()
                    {
                        Subject = email.Subject
                    };
                    if (email.BodyPath.HasValue())
                    {
                        var fp = FileComponent.GetFullPath(email.BodyPath);
                        if (!System.IO.File.Exists(fp))
                        {
                            email.Status = 2;
                            email.Error = "Không tìm thấy file nội dung: " + fp;
                            Context.SaveChanges();
                            Console.WriteLine(email.Id + " - Khong tim thay file : " + fp);
                        }
                        else
                        {
                            eo.Body = System.IO.File.ReadAllText(fp);
                            eo.To = email.Receivers.Split(';').Where(x => x != "").ToList();

                            if (email.CC.HasValue())
                            {
                                eo.Cc = email.CC.Split(';').Where(x => x != "").ToList();
                            }


                            if (email.Attachs.HasValue())
                            {
                                eo.Attachs = email.Attachs.Split(';').Where(x => x != "").ToList();
                            }

                            if (email.AlternateViews.HasValue())
                            {
                                var js = new JavaScriptSerializer();
                                eo.AlternateViews = js.Deserialize<List<AlternateViewModel>>(email.AlternateViews);
                            }

                            var result = sender.Send(eo);
                            if (result.Success)
                            {
                                email.SentDate = DateTime.Now;
                                email.Status = 1;
                                Context.SaveChanges();
                            }
                            else
                            {
                                email.Status = 2;
                                email.SentDate = DateTime.Now;
                                email.Error = result.Message.Sub(2990);
                                Context.SaveChanges();
                                LogError(result.Message, "SendEmail");
                            }

                            return result;
                        }
                    }
                    else
                    {
                        email.Status = 2;
                        email.Error = "Không tìm thấy file nội dung email";
                        Context.SaveChanges();
                        return new CommandResult<bool>("Gửi email thất bại: Không tìm thấy người nhận emails");
                    }
                }
                else
                {
                    email.Status = 3;
                    email.Error = "Email chứa địa chỉ ngoại lệ.";
                    Context.SaveChanges();
                    return new CommandResult<bool>("Gửi email thất bại: Email chứa địa chỉ ngoại lệ.");
                }
            }
            else
            {
                email.Status = 3;
                email.Error = "Không tìm thấy người nhận emails";
                Context.SaveChanges();
                return new CommandResult<bool>("Gửi email thất bại: Không tìm thấy người nhận emails");
            }
            email.Status = 3;
            email.Error = message.Sub(2990);
            Context.SaveChanges();
            return new CommandResult<bool>(message);
        }
        public string RemoveException(string emailStr, string exceptions)
        {
            CheckDbConnect();
            if (exceptions.HasValue())
            {
                var exps = exceptions.Split(';').ToList();

                if (emailStr.Contains(","))
                {
                    emailStr = emailStr.Replace(",", ";");
                }
                var v1 = emailStr.Split(';').ToList();

                var v2 = v1.Where(x => !exps.Contains(x)).ToList();

                return string.Join(";", v2);
            }
            return emailStr;
        }
        public bool IsNotException(LocalEmailTask email, string exceptions)
        {
            var result = true;
            CheckDbConnect();
            if (exceptions.HasValue())
            {
                // check receives
                var receives = email.Receivers;
                if (receives.Contains(","))
                {
                    receives = receives.Replace(",", ";");
                }

                var arr = receives.Split(';').ToList();

                foreach (var r in arr)
                {
                    if (exceptions.Contains(r))
                    {
                        result = false;
                        break;
                    }
                }

                // check CC
                if (email.CC.HasValue())
                {
                    var cc = email.CC;
                    if (cc.Contains(","))
                    {
                        cc = cc.Replace(",", ";");
                    }
                    var ccs = cc.Split(';').ToList();
                    foreach (var r in ccs)
                    {
                        if (exceptions.Contains(r))
                        {
                            result = false;
                            // return false;
                            break;
                        }
                    }
                }
            }
            return result;
        }
    }
}
