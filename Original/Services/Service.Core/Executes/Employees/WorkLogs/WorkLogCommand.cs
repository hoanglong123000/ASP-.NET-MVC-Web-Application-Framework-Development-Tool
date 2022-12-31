using System;
using System.Collections.Generic;
using System.Linq;
using DBServer.Entities;  
using Service.Core.Executes.Employees.Employees; 
using Service.Utility.Components;
using Service.Utility.Variables;

namespace Service.Core.Executes.Base
{
    public partial class ServerService
    {
        //#region ERROR
        //public void LogError(string message, string otype, string oid)
        //{
        //    CheckDbConnect();
        //    var log = new EmployeeWorkLog
        //    {
        //        Type = "Error",
        //        Date = DateTime.Now,
        //        UserAgent = HttpContext.UserAgent(),
        //        IP = HttpContext.GetIpAddress(),
        //        Message = message,
        //        ObjectType = otype,
        //        ObjectId = oid
        //    };
        //    if (Auth != null)
        //    {
        //        log.PerformBy = Auth.EmployeeId;
        //    }
        //    Context.EmployeeWorkLogs.Add(log);
        //    Context.SaveChanges();
        //}
        //public void LogError(string message, string otype)
        //{
        //    CheckDbConnect();
        //    var log = new EmployeeWorkLog
        //    {
        //        Type = "Error",
        //        Date = DateTime.Now,
        //        UserAgent = HttpContext.UserAgent(),
        //        IP = HttpContext.GetIpAddress(),
        //        Message = message,
        //        ObjectType = otype
        //    };
        //    if (Auth != null)
        //    {
        //        log.PerformBy = Auth.EmployeeId;
        //    }
        //    Context.EmployeeWorkLogs.Add(log);
        //    Context.SaveChanges();
        //}
        //public void LogError(string message)
        //{
        //    CheckDbConnect();
        //    var log = new EmployeeWorkLog
        //    {
        //        Type = "Error",
        //        Date = DateTime.Now,
        //        UserAgent = HttpContext.UserAgent(),
        //        IP = HttpContext.GetIpAddress(),
        //        Message = message
        //    };
        //    if (Auth != null)
        //    {
        //        log.PerformBy = Auth.EmployeeId;
        //    }
        //    Context.EmployeeWorkLogs.Add(log);
        //    Context.SaveChanges();
        //}
        //#endregion

        //#region INFO
        //public void LogInfo(string message, string otype, string oid)
        //{
        //    CheckDbConnect();
        //    var log = new EmployeeWorkLog()
        //    {
        //        Type = "Info",
        //        Date = DateTime.Now,
        //        UserAgent = HttpContext.UserAgent(),
        //        IP = HttpContext.GetIpAddress(),
        //        Message = message,
        //        ObjectType = otype,
        //        ObjectId = oid
        //    };
        //    if (Auth != null)
        //    {
        //        log.PerformBy = Auth.EmployeeId;
        //    }
        //    Context.EmployeeWorkLogs.Add(log);
        //    Context.SaveChanges();
        //}
        //public void LogInfo(string message, string otype)
        //{
        //    CheckDbConnect();
        //    var log = new EmployeeWorkLog()
        //    {
        //        Type = "Info",
        //        Date = DateTime.Now,
        //        UserAgent = HttpContext.UserAgent(),
        //        IP = HttpContext.GetIpAddress(),
        //        Message = message,
        //        ObjectType = otype,
        //    };
        //    if (Auth != null)
        //    {
        //        log.PerformBy = Auth.EmployeeId;
        //    }
        //    Context.EmployeeWorkLogs.Add(log);
        //    Context.SaveChanges();
        //}

        //public void LogInfo(string message, Guid performBy)
        //{
        //    CheckDbConnect();
        //    var log = new EmployeeWorkLog()
        //    {
        //        Type = "Info",
        //        Date = DateTime.Now,
        //        UserAgent = HttpContext.UserAgent(),
        //        IP = HttpContext.GetIpAddress(),
        //        Message = message,
        //        PerformBy = performBy
        //    };
        //    Context.EmployeeWorkLogs.Add(log);
        //    Context.SaveChanges();
        //}
        //public void LogInfo(string message)
        //{
        //    CheckDbConnect();
        //    var log = new EmployeeWorkLog()
        //    {
        //        Type = "Info",
        //        Date = DateTime.Now,
        //        UserAgent = HttpContext.UserAgent(),
        //        IP = HttpContext.GetIpAddress(),
        //        Message = message
        //    };
        //    if (Auth != null)
        //    {
        //        log.PerformBy = Auth.EmployeeId;
        //    }
        //    Context.EmployeeWorkLogs.Add(log);
        //    Context.SaveChanges();
        //}
        //#endregion

        //#region CREATE
        //public void LogCreate(string message, string otype, string oid)
        //{
        //    CheckDbConnect();
        //    var log = new EmployeeWorkLog
        //    {
        //        Message = message,
        //        Type = "Create",
        //        Date = DateTime.Now,
        //        UserAgent = HttpContext.UserAgent(),
        //        IP = HttpContext.GetIpAddress(),
        //        ObjectType = otype,
        //        ObjectId = oid
        //    };
        //    if (Auth != null)
        //    {
        //        log.PerformBy = Auth.EmployeeId;
        //    }
        //    Context.EmployeeWorkLogs.Add(log);
        //    Context.SaveChanges();
        //}
        //public void LogCreate(string message, string otype)
        //{
        //    CheckDbConnect();
        //    var log = new EmployeeWorkLog
        //    {
        //        Message = message,
        //        Type = "Create",
        //        Date = DateTime.Now,
        //        UserAgent = HttpContext.UserAgent(),
        //        IP = HttpContext.GetIpAddress(),
        //        ObjectType = otype
        //    };
        //    if (Auth != null)
        //    {
        //        log.PerformBy = Auth.EmployeeId;
        //    }
        //    Context.EmployeeWorkLogs.Add(log);
        //    Context.SaveChanges();
        //}
        //public void LogCreate(string message)
        //{
        //    CheckDbConnect();
        //    var log = new EmployeeWorkLog
        //    {
        //        Message = message,
        //        Type = "Create",
        //        Date = DateTime.Now,
        //        UserAgent = HttpContext.UserAgent(),
        //        IP = HttpContext.GetIpAddress()
        //    };
        //    if (Auth != null)
        //    {
        //        log.PerformBy = Auth.EmployeeId;
        //    }
        //    Context.EmployeeWorkLogs.Add(log);
        //    Context.SaveChanges();
        //}
        //#endregion

        //#region EDIT
        //public void LogEdit(string message, string otype, string oid, List<string> notes)
        //{
        //    CheckDbConnect();
        //    var log = new EmployeeWorkLog
        //    {
        //        Type = "Edit",
        //        Date = DateTime.Now,
        //        UserAgent = HttpContext.UserAgent(),
        //        IP = HttpContext.GetIpAddress(),
        //        Message = message,
        //        ObjectType = otype,
        //        ObjectId = oid
        //    };
        //    if (notes != null)
        //    {
        //        notes = notes.Where(x => x != "").ToList();
        //        log.Note = string.Join("<br/>", notes);
        //        if (Auth != null)
        //        {
        //            log.PerformBy = Auth.EmployeeId;
        //        }
        //    }
            

        //    Context.EmployeeWorkLogs.Add(log);
        //    Context.SaveChanges();
        //}
        //public void LogEdit(string message, string otype, string oid)
        //{
        //    CheckDbConnect();
        //    var log = new EmployeeWorkLog
        //    {
        //        Type = "Edit",
        //        Date = DateTime.Now,
        //        UserAgent = HttpContext.UserAgent(),
        //        IP = HttpContext.GetIpAddress(),
        //        Message = message,
        //        ObjectType = otype
        //    };
        //    if (Auth != null)
        //    {
        //        log.PerformBy = Auth.EmployeeId;
        //    }

        //    Context.EmployeeWorkLogs.Add(log);
        //    Context.SaveChanges();
        //}
        //public void LogEdit(string message, List<string> notes)
        //{
        //    CheckDbConnect();
        //    var log = new EmployeeWorkLog
        //    {
        //        Type = "Edit",
        //        Date = DateTime.Now,
        //        UserAgent = HttpContext.UserAgent(),
        //        IP = HttpContext.GetIpAddress(),
        //        Message = message
        //    };
        //    notes = notes.Where(x => x != "").ToList();
        //    log.Note = string.Join("<br/>", notes);
        //    if (Auth != null)
        //    {
        //        log.PerformBy = Auth.EmployeeId;
        //    }

        //    Context.EmployeeWorkLogs.Add(log);
        //    Context.SaveChanges();
        //}
        //public void LogEdit(string message)
        //{
        //    CheckDbConnect();
        //    var log = new EmployeeWorkLog
        //    {
        //        Type = "Edit",
        //        Date = DateTime.Now,
        //        UserAgent = HttpContext.UserAgent(),
        //        IP = HttpContext.GetIpAddress(),
        //        Message = message
        //    };
        //    if (Auth != null)
        //    {
        //        log.PerformBy = Auth.EmployeeId;
        //    }

        //    Context.EmployeeWorkLogs.Add(log);
        //    Context.SaveChanges();
        //}
        //#endregion

        //#region DELETE
        //public void LogDelete(string message, string otype, string oid)
        //{
        //    CheckDbConnect();
        //    var log = new EmployeeWorkLog
        //    {
        //        Type = "Delete",
        //        Date = DateTime.Now,
        //        UserAgent = HttpContext.UserAgent(),
        //        IP = HttpContext.GetIpAddress(),
        //        Message = message,
        //        ObjectType = otype,
        //        ObjectId = oid
        //    };
        //    if (Auth != null)
        //    {
        //        log.PerformBy = Auth.EmployeeId;
        //    }
        //    Context.EmployeeWorkLogs.Add(log);
        //    Context.SaveChanges();
        //}
        //public void LogDelete(string message, string otype)
        //{
        //    CheckDbConnect();
        //    var log = new EmployeeWorkLog
        //    {
        //        Type = "Delete",
        //        Date = DateTime.Now,
        //        UserAgent = HttpContext.UserAgent(),
        //        IP = HttpContext.GetIpAddress(),
        //        Message = message,
        //        ObjectType = otype
        //    };
        //    if (Auth != null)
        //    {
        //        log.PerformBy = Auth.EmployeeId;
        //    }
        //    Context.EmployeeWorkLogs.Add(log);
        //    Context.SaveChanges();
        //}
        //public void LogDelete(string message)
        //{
        //    CheckDbConnect();
        //    var log = new EmployeeWorkLog
        //    {
        //        Type = "Delete",
        //        Date = DateTime.Now,
        //        UserAgent = HttpContext.UserAgent(),
        //        IP = HttpContext.GetIpAddress(),
        //        Message = message
        //    };
        //    if (Auth != null)
        //    {
        //        log.PerformBy = Auth.EmployeeId;
        //    }
        //    Context.EmployeeWorkLogs.Add(log);
        //    Context.SaveChanges();
        //}
        //#endregion

        //#region CHANGE COMPARE
        //public string ChangeCompare(string title, string oldValue, string newValue)
        //{
        //    if (oldValue != newValue)
        //        return "cập nhật " + title + " từ \"" + oldValue + "\" thành \"" + newValue + "\"";
        //    return "";
        //}
        //public string ChangeCompare(string title, DateTime? oldValue, DateTime? newValue)
        //{
        //    if (oldValue != newValue)
        //        return "cập nhật " + title + " từ \""
        //               + (oldValue.HasValue ? oldValue.Value.ToString("dd/MM/yyyy") : "")
        //               + "\" thành \"" + (newValue.HasValue ? newValue.Value.ToString("dd/MM/yyyy") : "") + "\"";
        //    return "";
        //}
        //public string ChangeCompare(string title, TimeSpan? oldValue, TimeSpan? newValue)
        //{
        //    if (oldValue != newValue)
        //        return "cập nhật " + title + " từ \""
        //               + (oldValue.HasValue ? oldValue.Value.ToString(@"hh\:mm") : "")
        //               + "\" thành \"" + (newValue.HasValue ? newValue.Value.ToString(@"hh\:mm") : "") + "\"";
        //    return "";
        //}
        //public string ChangeCompare(string title, int? oldValue, int? newValue)
        //{
        //    if (oldValue != newValue)
        //        return "cập nhật " + title + " từ \"" + oldValue + "\" thành \"" + newValue + "\"";
        //    return "";
        //}
        //public string ChangeCompare(string title, int oldValue, int newValue)
        //{
        //    if (oldValue != newValue)
        //        return "cập nhật " + title + " từ \"" + oldValue + "\" thành \"" + newValue + "\"";
        //    return "";
        //}
        //public string ChangeCompare(string title, float oldValue, float newValue)
        //{
        //    if (!Equals(oldValue, newValue))
        //        return "cập nhật " + title + " từ \"" + oldValue + "\" thành \"" + newValue + "\"";
        //    return "";
        //}
        //public string ChangeCompare(string title, decimal? oldValue, decimal? newValue)
        //{
        //    if (!Equals(oldValue, newValue))
        //        return "cập nhật " + title + " từ \"" + oldValue + "\" thành \"" + newValue + "\"";
        //    return "";
        //}
        //public string ChangeCompare(string title, double? oldValue, double? newValue)
        //{
        //    if (!Equals(oldValue, newValue))
        //        return "cập nhật " + title + " từ \"" + oldValue + "\" thành \"" + newValue + "\"";
        //    return "";
        //}
        //public string ChangeEmployeeCompare(string title, Guid? oldId, Guid? newId)
        //{
        //    if (oldId != newId)
        //    {
        //        var userIds = new List<Guid>();
        //        if (oldId.HasValue)
        //        {
        //            userIds.Add(oldId.Value);
        //        }
        //        if (newId.HasValue)
        //        {
        //            userIds.Add(newId.Value);
        //        }
        //        CheckDbConnect();
        //        var users = EmployeeSuggestions(new SearchEmployeeModel() { Ids = userIds },
        //            new OptionResult() { Unlimited = true });
        //        var h = "cập nhật " + title + " từ \"";
        //        if (oldId.HasValue)
        //        {
        //            h += users.FirstOrDefault(x => x.Id == oldId.Value)?.FullName;
        //        }

        //        h += "\" thành ";
        //        if (newId.HasValue)
        //        {
        //            h += users.FirstOrDefault(x => x.Id == newId.Value)?.FullName;
        //        }
        //        h += "\"";
        //        return h;
        //    }
        //    return "";
        //}

        //public string ChangeOptionCompare(string title, int? oldValue, int? newValue, string type)
        //{
        //    if (oldValue != newValue)
        //    {
        //        CheckDbConnect();
        //        var options = OptionValueMany(new SearchOptionValueModel()
        //        {
        //            Cache = true,
        //            Type = type
        //        }, new OptionResult() { Unlimited = true }).Many;

        //        var old = options.FirstOrDefault(x => x.Id == oldValue);
        //        var n = options.FirstOrDefault(x => x.Id == newValue);
        //        return "cập nhật " + title + " từ \"" + (old != null ? old.Name : "") + " thành \"" + (n != null ? n.Name : "");
        //    }

        //    return "";
        //}
        //public string ChangeOptionCodeCompare(string title, string oldValue, string newValue, string type)
        //{
        //    if (oldValue != newValue)
        //    {
        //        CheckDbConnect();
        //        var options = OptionValueMany(new SearchOptionValueModel()
        //        {
        //            Cache = true,
        //            Type = type
        //        }, new OptionResult() { Unlimited = true }).Many;

        //        var old = options.FirstOrDefault(x => x.Code == oldValue);
        //        var n = options.FirstOrDefault(x => x.Code == newValue);
        //        return "cập nhật " + title + " từ \"" + (old != null ? old.Name : "") + " thành \"" + (n != null ? n.Name : "");
        //    }

        //    return "";
        //}
        //public string ChangeObjectCompare(string title, int? oldValue, int? newValue, string type)
        //{

        //    switch (type)
        //    {
        //        case "Country":
        //            {
        //                if (oldValue != newValue)
        //                {
        //                    var str = "cập nhật " + title + " từ \"";
        //                    var lst = CountryMany(true).Many;
        //                    if (oldValue.HasValue)
        //                    {
        //                        var oc = lst.FirstOrDefault(x => x.Id == oldValue.Value);
        //                        str += oc != null ? oc.Name : "";
        //                    }

        //                    str += "\" thành \"";
        //                    if (newValue.HasValue)
        //                    {
        //                        var nc = lst.FirstOrDefault(x => x.Id == newValue.Value);
        //                        str += nc != null ? nc.Name : "";
        //                    }

        //                    str += "\"";
        //                    return str;
        //                }
        //            }
        //            break;
        //        case "District":
        //            {
        //                if (oldValue != newValue)
        //                {
        //                    var str = "cập nhật " + title + " từ \"";
        //                    var lst = DistrictMany(new SearchDistrictModel() { Cache = true }, new OptionResult() { Unlimited = true }).Many;
        //                    if (oldValue.HasValue)
        //                    {
        //                        var oc = lst.FirstOrDefault(x => x.Id == oldValue.Value);
        //                        str += oc != null ? oc.Name : "";
        //                    }

        //                    str += "\" thành \"";
        //                    if (newValue.HasValue)
        //                    {
        //                        var nc = lst.FirstOrDefault(x => x.Id == newValue.Value);
        //                        str += nc != null ? nc.Name : "";
        //                    }

        //                    str += "\"";
        //                    return str;
        //                }
        //            }
        //            break;
        //        case "Ward":
        //            {
        //                if (oldValue != newValue)
        //                {
        //                    var str = "cập nhật " + title + " từ \"";
        //                    var lst = WardMany(0, true);
        //                    if (oldValue.HasValue)
        //                    {
        //                        var oc = lst.FirstOrDefault(x => x.Id == oldValue.Value);
        //                        str += oc != null ? oc.Name : "";
        //                    }

        //                    str += "\" thành \"";
        //                    if (newValue.HasValue)
        //                    {
        //                        var nc = lst.FirstOrDefault(x => x.Id == newValue.Value);
        //                        str += nc != null ? nc.Name : "";
        //                    }

        //                    str += "\"";
        //                    return str;
        //                }
        //            }
        //            break;
               
        //        case "JobPosition":
        //        {
        //            if (oldValue != newValue)
        //            {
        //                var str = "cập nhật " + title + " từ \"";
        //                var lst = JobPositionViewMany(new SearchJobPositionModel()
        //                {
        //                    Cache = true
        //                }, new OptionResult() { Unlimited = true }).Many;
        //                if (oldValue.HasValue)
        //                {
        //                    var oc = lst.FirstOrDefault(x => x.Id == oldValue.Value);
        //                    str += oc != null ? oc.Name : "";
        //                }

        //                str += "\" thành \"";
        //                if (newValue.HasValue)
        //                {
        //                    var nc = lst.FirstOrDefault(x => x.Id == newValue.Value);
        //                    str += nc != null ? nc.Name : "";
        //                }

        //                str += "\"";
        //                return str;
        //            }
        //        }
        //            break;  
        //    }

        //    return "";
        //}
        //public string ChangeObjectCodeCompare(string title, string oldValue, string newValue, string type)
        //{

        //    switch (type)
        //    {
        //        case "Country":
        //            {
        //                if (oldValue != newValue)
        //                {
        //                    var str = "cập nhật " + title + " từ \"";
        //                    var lst = CountryMany(true).Many;
        //                    //if (oldValue.HasValue())
        //                    //{
        //                    //    var oc = lst.FirstOrDefault(x => x.Code == oldValue);
        //                    //    str += oc != null ? oc.Name : "";
        //                    //}

        //                    //str += "\" thành \"";
        //                    //if (newValue.HasValue())
        //                    //{
        //                    //    var nc = lst.FirstOrDefault(x => x.Code == newValue);
        //                    //    str += nc != null ? nc.Name : "";
        //                    //}

        //                    str += "\"";
        //                    return str;
        //                }
        //            }
        //            break;
        //        case "District":
        //            {
        //                if (oldValue != newValue)
        //                {
        //                    var str = "cập nhật " + title + " từ \"";
        //                    var lst = DistrictMany(new SearchDistrictModel() { Cache = true }, new OptionResult() { Unlimited = true }).Many;
        //                    if (oldValue.HasValue())
        //                    {
        //                        var oc = lst.FirstOrDefault(x => x.Code == oldValue);
        //                        str += oc != null ? oc.Name : "";
        //                    }

        //                    str += "\" thành \"";
        //                    if (newValue.HasValue())
        //                    {
        //                        var nc = lst.FirstOrDefault(x => x.Code == newValue);
        //                        str += nc != null ? nc.Name : "";
        //                    }

        //                    str += "\"";
        //                    return str;
        //                }
        //            }
        //            break;
        //        case "Ward":
        //            {
        //                if (oldValue != newValue)
        //                {
        //                    var str = "cập nhật " + title + " từ \"";
        //                    var lst = WardMany(0, true);
        //                    if (oldValue.HasValue())
        //                    {
        //                        var oc = lst.FirstOrDefault(x => x.Code == oldValue);
        //                        str += oc != null ? oc.Name : "";
        //                    }

        //                    str += "\" thành \"";
        //                    if (newValue.HasValue())
        //                    {
        //                        var nc = lst.FirstOrDefault(x => x.Code == newValue);
        //                        str += nc != null ? nc.Name : "";
        //                    }

        //                    str += "\"";
        //                    return str;
        //                }
        //            }
        //            break;
                
        //        case "JobPosition":
        //            {
        //                if (oldValue != newValue)
        //                {
        //                    var str = "cập nhật " + title + " từ \"";
        //                    var lst = JobPositionViewMany(new SearchJobPositionModel()
        //                    {
        //                        Cache = true
        //                    }, new OptionResult() { Unlimited = true }).Many;
        //                    if (oldValue.HasValue())
        //                    {
        //                        var oc = lst.FirstOrDefault(x => x.Code == oldValue);
        //                        str += oc != null ? oc.Name : "";
        //                    }

        //                    str += "\" thành \"";
        //                    if (newValue.HasValue())
        //                    {
        //                        var nc = lst.FirstOrDefault(x => x.Code == newValue);
        //                        str += nc != null ? nc.Name : "";
        //                    }

        //                    str += "\"";
        //                    return str;
        //                }
        //            }break;
        //        case "JobTitle":
        //        {
        //            if (oldValue != newValue)
        //            {
        //                var str = "cập nhật " + title + " từ \"";
        //                var lst = JobTitleMany(new SearchJobTitleModel()
        //                {
        //                    Cache = true
        //                }, new OptionResult() { Unlimited = true }).Many;
        //                if (oldValue.HasValue())
        //                {
        //                    var oc = lst.FirstOrDefault(x => x.Code == oldValue);
        //                    str += oc != null ? oc.Name : "";
        //                }

        //                str += "\" thành \"";
        //                if (newValue.HasValue())
        //                {
        //                    var nc = lst.FirstOrDefault(x => x.Code == newValue);
        //                    str += nc != null ? nc.Name : "";
        //                }

        //                str += "\"";
        //                return str;
        //            }
        //        }
        //            break; 
        //    }

        //    return "";
        //}
        //public string ChangeCompare(string title, bool? oldValue, bool? newValue)
        //{
        //    if (oldValue != newValue)
        //        return "cập nhật " + title + " từ \"" + (oldValue.HasValue && oldValue.Value ? "đúng" : "sai" ) 
        //               + " thành \"" + (newValue.HasValue && newValue.Value ? "đúng" : "sai");
        //    return "";
        //}
        //#endregion
    }
}
