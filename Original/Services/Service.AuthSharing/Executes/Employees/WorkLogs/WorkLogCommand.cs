using System;
using System.Collections.Generic;
using System.Linq;
using DBContext.AuthSharing.Entities; 
using Service.Utility.Components;    
using Service.AuthSharing.Executes.General.OptionValues; 
using Service.Utility.Variables; 

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        #region ERROR
        public void LogError(string message, string otype, string oid)
        {
            CheckDbConnect();
            var log = new LocalEmpWorkLog
            {
                Type = "Error",
                Date = DateTime.Now,
                UserAgent = HttpContext.UserAgent(),
                IP = HttpContext.GetIpAddress(),
                Message = message,
                ObjectType = otype,
                ObjectId = oid,
                Id = Guid.NewGuid()
            };


            if (Auth != null)
            {
                log.PerformBy = Auth.EmployeeId;
            }
            Context.LocalEmpWorkLogs.Add(log);
            Context.SaveChanges();
        }
        public void LogError(string message, string otype)
        {
            CheckDbConnect();
            var log = new LocalEmpWorkLog
            {
                Type = "Error",
                Date = DateTime.Now,
                UserAgent = HttpContext.UserAgent(),
                IP = HttpContext.GetIpAddress(),
                Message = message,
                ObjectType = otype,
                Id = Guid.NewGuid()
            };
            if (Auth != null)
            {
                log.PerformBy = Auth.EmployeeId;
            }
            Context.LocalEmpWorkLogs.Add(log);
            Context.SaveChanges();
        }
        public void LogError(string message)
        {
            CheckDbConnect();
            var log = new LocalEmpWorkLog
            {
                Type = "Error",
                Date = DateTime.Now,
                UserAgent = HttpContext.UserAgent(),
                IP = HttpContext.GetIpAddress(),
                Message = message,
                Id = Guid.NewGuid()
            };
            if (Auth != null)
            {
                log.PerformBy = Auth.EmployeeId;
            }
            Context.LocalEmpWorkLogs.Add(log);
            Context.SaveChanges();
        }
        #endregion

        #region INFO
        public void LogInfo(string message, string otype, string oid)
        {
            CheckDbConnect();
            var log = new LocalEmpWorkLog()
            {
                Type = "Info",
                Date = DateTime.Now,
                UserAgent = HttpContext.UserAgent(),
                IP = HttpContext.GetIpAddress(),
                Message = message,
                ObjectType = otype,
                ObjectId = oid,
                Id = Guid.NewGuid()
            };
            if (Auth != null)
            {
                log.PerformBy = Auth.EmployeeId;
            }
            Context.LocalEmpWorkLogs.Add(log);
            Context.SaveChanges();
        }
        public void LogInfo(string message, string otype)
        {
            CheckDbConnect();
            var log = new LocalEmpWorkLog()
            {
                Type = "Info",
                Date = DateTime.Now,
                UserAgent = HttpContext.UserAgent(),
                IP = HttpContext.GetIpAddress(),
                Message = message,
                ObjectType = otype,
                Id = Guid.NewGuid()
            };
            if (Auth != null)
            {
                log.PerformBy = Auth.EmployeeId;
            }
            Context.LocalEmpWorkLogs.Add(log);
            Context.SaveChanges();
        }

        public void LogInfo(string message, Guid performBy)
        {
            CheckDbConnect();
            var log = new LocalEmpWorkLog()
            {
                Type = "Info",
                Date = DateTime.Now,
                UserAgent = HttpContext.UserAgent(),
                IP = HttpContext.GetIpAddress(),
                Message = message,
                PerformBy = performBy,
                Id = Guid.NewGuid()
            };
            Context.LocalEmpWorkLogs.Add(log);
            Context.SaveChanges();
        }
        public void LogInfo(string message)
        {
            CheckDbConnect();
            var log = new LocalEmpWorkLog()
            {
                Type = "Info",
                Date = DateTime.Now,
                UserAgent = HttpContext.UserAgent(),
                IP = HttpContext.GetIpAddress(),
                Message = message,
                Id = Guid.NewGuid()
            };
            if (Auth != null)
            {
                log.PerformBy = Auth.EmployeeId;
            }
            Context.LocalEmpWorkLogs.Add(log);
            Context.SaveChanges();
        }
        #endregion

        #region CREATE
        public void LogCreate(string message, string otype, string oid)
        {
            CheckDbConnect();
            var log = new LocalEmpWorkLog
            {
                Message = message,
                Type = "Create",
                Date = DateTime.Now,
                UserAgent = HttpContext.UserAgent(),
                IP = HttpContext.GetIpAddress(),
                ObjectType = otype,
                ObjectId = oid,
                Id = Guid.NewGuid()
            };
            if (Auth != null)
            {
                log.PerformBy = Auth.EmployeeId;
            }
            Context.LocalEmpWorkLogs.Add(log);
            Context.SaveChanges();
        }
        public void LogCreate(string message, string otype)
        {
            CheckDbConnect();
            var log = new LocalEmpWorkLog
            {
                Message = message,
                Type = "Create",
                Date = DateTime.Now,
                UserAgent = HttpContext.UserAgent(),
                IP = HttpContext.GetIpAddress(),
                ObjectType = otype,
                Id = Guid.NewGuid()
            };
            if (Auth != null)
            {
                log.PerformBy = Auth.EmployeeId;
            }
            Context.LocalEmpWorkLogs.Add(log);
            Context.SaveChanges();
        }
        public void LogCreate(string message)
        {
            CheckDbConnect();
            var log = new LocalEmpWorkLog
            {
                Message = message,
                Type = "Create",
                Date = DateTime.Now,
                UserAgent = HttpContext.UserAgent(),
                IP = HttpContext.GetIpAddress(),
                Id = Guid.NewGuid()
            };
            if (Auth != null)
            {
                log.PerformBy = Auth.EmployeeId;
            }
            Context.LocalEmpWorkLogs.Add(log);
            Context.SaveChanges();
        }
        #endregion

        #region EDIT
        public void LogEdit(string message, string otype, string oid, List<string> notes)
        {
            CheckDbConnect();
            var log = new LocalEmpWorkLog
            {
                Type = "Edit",
                Date = DateTime.Now,
                UserAgent = HttpContext.UserAgent(),
                IP = HttpContext.GetIpAddress(),
                Message = message,
                ObjectType = otype,
                ObjectId = oid,
                Id = Guid.NewGuid()
            };
            if (notes != null)
            {
                notes = notes.Where(x => x != "").ToList();
                log.Note = string.Join("<br/>", notes);
                if (Auth != null)
                {
                    log.PerformBy = Auth.EmployeeId;
                }
            }
            

            Context.LocalEmpWorkLogs.Add(log);
            Context.SaveChanges();
        }
        public void LogEdit(string message, string otype, string oid)
        {
            CheckDbConnect();
            var log = new LocalEmpWorkLog
            {
                Type = "Edit",
                Date = DateTime.Now,
                UserAgent = HttpContext.UserAgent(),
                IP = HttpContext.GetIpAddress(),
                Message = message,
                ObjectType = otype,
                Id = Guid.NewGuid()
            };
            if (Auth != null)
            {
                log.PerformBy = Auth.EmployeeId;
            }

            Context.LocalEmpWorkLogs.Add(log);
            Context.SaveChanges();
        }
        public void LogEdit(string message, List<string> notes)
        {
            CheckDbConnect();
            var log = new LocalEmpWorkLog
            {
                Type = "Edit",
                Date = DateTime.Now,
                UserAgent = HttpContext.UserAgent(),
                IP = HttpContext.GetIpAddress(),
                Message = message,
                Id = Guid.NewGuid()
            };
            notes = notes.Where(x => x != "").ToList();
            log.Note = string.Join("<br/>", notes);
            if (Auth != null)
            {
                log.PerformBy = Auth.EmployeeId;
            }

            Context.LocalEmpWorkLogs.Add(log);
            Context.SaveChanges();
        }
        public void LogEdit(string message)
        {
            CheckDbConnect();
            var log = new LocalEmpWorkLog
            {
                Type = "Edit",
                Date = DateTime.Now,
                UserAgent = HttpContext.UserAgent(),
                IP = HttpContext.GetIpAddress(),
                Message = message,
                Id = Guid.NewGuid()
            };
            if (Auth != null)
            {
                log.PerformBy = Auth.EmployeeId;
            }

            Context.LocalEmpWorkLogs.Add(log);
            Context.SaveChanges();
        }
        #endregion

        #region DELETE
        public void LogDelete(string message, string otype, string oid)
        {
            CheckDbConnect();
            var log = new LocalEmpWorkLog
            {
                Type = "Delete",
                Date = DateTime.Now,
                UserAgent = HttpContext.UserAgent(),
                IP = HttpContext.GetIpAddress(),
                Message = message,
                ObjectType = otype,
                ObjectId = oid,
                Id = Guid.NewGuid()
            };
            if (Auth != null)
            {
                log.PerformBy = Auth.EmployeeId;
            }
            Context.LocalEmpWorkLogs.Add(log);
            Context.SaveChanges();
        }
        public void LogDelete(string message, string otype)
        {
            CheckDbConnect();
            var log = new LocalEmpWorkLog
            {
                Type = "Delete",
                Date = DateTime.Now,
                UserAgent = HttpContext.UserAgent(),
                IP = HttpContext.GetIpAddress(),
                Message = message,
                ObjectType = otype,
                Id = Guid.NewGuid()
            };
            if (Auth != null)
            {
                log.PerformBy = Auth.EmployeeId;
            }
            Context.LocalEmpWorkLogs.Add(log);
            Context.SaveChanges();
        }
        public void LogDelete(string message)
        {
            CheckDbConnect();
            var log = new LocalEmpWorkLog
            {
                Type = "Delete",
                Date = DateTime.Now,
                UserAgent = HttpContext.UserAgent(),
                IP = HttpContext.GetIpAddress(),
                Message = message,
                Id = Guid.NewGuid()
            };
            if (Auth != null)
            {
                log.PerformBy = Auth.EmployeeId;
            }
            Context.LocalEmpWorkLogs.Add(log);
            Context.SaveChanges();
        }
        #endregion

        #region CHANGE COMPARE
        public string ChangeCompare(string title, string oldValue, string newValue)
        {
            if (oldValue != newValue)
                return "cập nhật " + title + " từ \"" + oldValue + "\" thành \"" + newValue + "\"";
            return "";
        }
        public string ChangeCompare(string title, DateTime? oldValue, DateTime? newValue)
        {
            if (oldValue != newValue)
                return "cập nhật " + title + " từ \""
                       + (oldValue.HasValue ? oldValue.Value.ToString("dd/MM/yyyy") : "")
                       + "\" thành \"" + (newValue.HasValue ? newValue.Value.ToString("dd/MM/yyyy") : "") + "\"";
            return "";
        }
        public string ChangeCompare(string title, TimeSpan? oldValue, TimeSpan? newValue)
        {
            if (oldValue != newValue)
                return "cập nhật " + title + " từ \""
                       + (oldValue.HasValue ? oldValue.Value.ToString(@"hh\:mm") : "")
                       + "\" thành \"" + (newValue.HasValue ? newValue.Value.ToString(@"hh\:mm") : "") + "\"";
            return "";
        }
        public string ChangeCompare(string title, int? oldValue, int? newValue)
        {
            if (oldValue != newValue)
                return "cập nhật " + title + " từ \"" + oldValue + "\" thành \"" + newValue + "\"";
            return "";
        }
        public string ChangeCompare(string title, int oldValue, int newValue)
        {
            if (oldValue != newValue)
                return "cập nhật " + title + " từ \"" + oldValue + "\" thành \"" + newValue + "\"";
            return "";
        }
        public string ChangeCompare(string title, float oldValue, float newValue)
        {
            if (!Equals(oldValue, newValue))
                return "cập nhật " + title + " từ \"" + oldValue + "\" thành \"" + newValue + "\"";
            return "";
        }
        public string ChangeCompare(string title, decimal? oldValue, decimal? newValue)
        {
            if (!Equals(oldValue, newValue))
                return "cập nhật " + title + " từ \"" + oldValue + "\" thành \"" + newValue + "\"";
            return "";
        }

        public string ChangeCompare(string title, double? oldValue, double? newValue)
        {
            if (!Equals(oldValue, newValue))
                return "cập nhật " + title + " từ \"" + oldValue + "\" thành \"" + newValue + "\"";
            return "";
        }
         
        public string ChangeOptionCompare(string title, int? oldValue, int? newValue, string type)
        {
            if (oldValue != newValue)
            {
                CheckDbConnect();
                var options = OptionValueBaseList(type);

                var old = options.FirstOrDefault(x => x.Id == oldValue);
                var n = options.FirstOrDefault(x => x.Id == newValue);
                return "cập nhật " + title + " từ \"" + (old != null ? old.Name : "") + " thành \"" + (n != null ? n.Name : "");
            }

            return "";
        }

        public string ChangeOptionCodeCompare(string title, string oldValue, string newValue, string type)
        { 
            return "";
        }
         
        public string ChangeCompare(string title, bool? oldValue, bool? newValue)
        {
            if (oldValue != newValue)
                return "cập nhật " + title + " từ \"" + (oldValue.HasValue && oldValue.Value ? "đúng" : "sai" ) 
                       + " thành \"" + (newValue.HasValue && newValue.Value ? "đúng" : "sai");
            return "";
        }
        #endregion
    }
}
