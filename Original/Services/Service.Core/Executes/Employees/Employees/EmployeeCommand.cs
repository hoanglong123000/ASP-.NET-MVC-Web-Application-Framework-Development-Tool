 
using Service.Education.Executes.Employees.Employees; 
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Helpers;
using DBServer.Entities; 
using Service.Utility.Components;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public CommandResult<object> EmployeeCreate(EmployeeEditModel model)
        {
            CheckDbConnect();

            var emp = IsExistEmployee(new SearchEmployeeModel()
            {
                Id = model.Id, 
                StaffCode = model.StaffCode
            });

            if (emp != null)
            {
                var message = "";
                if (model.Email.HasValue() && model.Email == emp.Email)
                {
                    message += "Email ";
                } 
                return new CommandResult<object>(message + "đã được sử dụng");
            }

            var u = new Employee
            {
                Id = model.Id,
                StaffCode = model.StaffCode,
                FullName = model.FullName,
                Keyword = (model.StaffCode + " " + model.FullName + " " + model.Email).ToKeyword() + " " + model.FullName,
                Email = model.Email,  
                DiDong = model.DiDong,  
                GioiTinh = model.GioiTinh,
                Avatar = model.Avatar,
              
                TrangThaiCongViec = 1, 
                CreatedBy = model.CreatedBy,
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = model.CreatedBy, 
                Priority = Context.Employees.Count() + 1, 
            };
            Context.Employees.Add(u);
            Context.SaveChanges();
               
            if (model.LoginName.HasValue())
            {
                var auth = Context.EmployeeAuths.FirstOrDefault(x => x.EmployeeId == u.Id) ?? new EmployeeAuth
                {
                    Id = 0,
                    EmployeeId = u.Id
                };
                auth.LoginName = model.LoginName;
                auth.PasswordHash = model.Password;
                if (auth.Id == 0)
                {
                    Context.EmployeeAuths.Add(auth);
                    Context.SaveChanges();
                }

            }

            //if (model.Groups.HasValue())
            //{
            //    var groups = model.Groups.Split(',').Select(Int32.Parse).ToList();
            //    foreach (var gr in groups)
            //    {
            //        Context.EmployeeGroups.Add(new EmployeeGroup()
            //        {
            //            EmployeeId = u.Id,
            //            GroupId = gr
            //        });
            //        Context.SaveChanges();
            //    }
            //}
             
            return new CommandResult<object>(true, u);
        }

        public CommandResult<object> EmployeeEditThongTinCaNhan(EmployeeEditModel model)
        {
            CheckDbConnect();
            var u = Context.Employees.FirstOrDefault(x => x.Id == model.Id);
            if (u == null)
                return null;

            var changeType = false;

            var notes = new List<string>()
            {
                 
            };

            if (u.TrangThaiCongViec != model.TrangThaiCongViec)
            {
                changeType = true;
            }
             
            u.StaffCode = model.StaffCode;
            u.FullName = model.FullName; 
            u.Avatar = model.Avatar;
            u.DiDong = model.DiDong;
            u.Email = model.Email; 
            u.GioiTinh = model.GioiTinh;  
            u.Keyword = (model.StaffCode + " " + model.FullName + " " + model.Email).ToKeyword() + " " + model.FullName; 
            u.TrangThaiCongViec = model.TrangThaiCongViec;
            u.Status = model.Status; 
            u.CreatedBy = model.CreatedBy; 
            Context.SaveChanges();
                
            if (changeType)
            {
                if (model.TrangThaiCongViec == 0 || model.TrangThaiCongViec == 3)
                {
                  
                } 
            }

            return new CommandResult<object>(true, u);
        }

        public CommandResult<object> EditEmployeeJobAndGroup(EmployeeEditModel model)
        {
            CheckDbConnect();
            var u = Context.Employees.FirstOrDefault(x => x.Id == model.Id);

            if (u == null)
                return new CommandResult<object>("Không tìm thấy dữ liệu nhân viên");

            //if (u.Organizations != model.Organizations || u.JobPositionId != model.JobPositionId)
            //{
            //    var orgId = model.Organizations.Split(';').Where(x => x != "").Select(Int32.Parse).Last();
            //    ChangeWorkProcess(new EmployeeWorkProcessEditModel()
            //    {
            //        EmployeeId = model.Id,
            //        JobPositionId = model.JobPositionId,
            //        OrganizationId = orgId,
            //        TrangThaiCongViec = "DLV",
            //        StartDate = DateTime.Now,
            //        UpdateRelateEmployee = true
            //    });
            //}

            //u.Organizations = model.Organizations;
            //u.JobPositionId = model.JobPositionId;

            //u.Groups = model.Groups;
            Context.SaveChanges();

            //if (model.Groups.HasValue())
            //{
            //    var groups = model.Groups.Split(',').Select(Int32.Parse).ToList();

            //    // xoa group cũ
            //    Context.Database.ExecuteSqlCommand("delete EmployeeGroups where EmployeeId = '" + u.Id +
            //                                       "' and GroupId not in ( " + model.Groups + ")");

            //    foreach (var gr in groups)
            //    {
            //        var g = Context.EmployeeGroups.FirstOrDefault(x => x.EmployeeId == u.Id && x.GroupId == gr);
            //        if (g == null)
            //        {
            //            Context.EmployeeGroups.Add(new EmployeeGroup()
            //            {
            //                EmployeeId = u.Id,
            //                GroupId = gr
            //            });
            //            Context.SaveChanges();
            //        }
            //    }
            //}
            //else
            //{
            //    Context.Database.ExecuteSqlCommand("delete EmployeeGroups where EmployeeId = '" + u.Id + "'");
            //}

            Caching.Delete("SidebarGroup", "general");
            Caching.Delete("EmployeeGroup", "users");

            return new CommandResult<object>(true);
        }

        public string CreateDefaultEmployeeAvartar()
        {
            var path = FileComponent.DateFolder("/media/user/", null) + "/" + Guid.NewGuid() + ".jpg";
            var desc = FileComponent.GetFullPath(path); 
            if (desc != null)
            { 
                var src = FileComponent.GetFullPath("/media/default/Employee.jpg"); 
                if (File.Exists(src) && !File.Exists(desc))
                {
                    File.Copy(src, desc);
                    return path;
                }
            }

            return null;
        }

        public void DeleteEmployeeByIds(List<Guid> ids, Guid userId)
        {
            CheckDbConnect();
            var arr = ids.Select(x => "'" + x + "'").ToList();
            var idStr = string.Join("','", arr);
            Context.Database.ExecuteSqlCommand(
                "update Employees set Status = -1, UpdatedBy = '" + userId + "', UpdatedDate = getdate() " +
                "where Id in (" + idStr + ")"); 
        }
        public void RestoreEmployeeById(Guid id, Guid userId)
        {
            CheckDbConnect();
            Context.Database.ExecuteSqlCommand(
                "update Employees set Status = 0, UpdatedBy = '" + userId + "', UpdatedDate = getdate() " +
                "where Id = '"+ id +"' ");
              
             
        }
        public void EmployeeUpdateInfo(EmployeeEditModel model)
        {
            CheckDbConnect();
            var Employee = Context.Employees.FirstOrDefault(x => x.Id == model.Id);
            if (Employee != null)
            {
                Employee.FullName = model.FullName;
                Employee.Email = model.Email;

                Context.SaveChanges();
            }
        }

        public CommandResult<object> EditEmployeeSecurity(EmployeeEditModel model)
        {
            CheckDbConnect();

            if (Context.EmployeeAuths.Any(x => x.EmployeeId != model.Id && x.LoginName == model.LoginName))
            {
                return new CommandResult<object>("Tên đăng nhập đã được sử dụng.");
            }

            var auth = Context.EmployeeAuths.FirstOrDefault(x => x.EmployeeId == model.Id) ?? new EmployeeAuth()
            {
                Id = 0,
                EmployeeId = model.Id
            };


            auth.LoginName = model.LoginName;

            if (model.Password.HasValue())
            {
                auth.PasswordHash = Crypto.HashPassword(model.Password);
            }

            if (auth.Id == 0)
            {
                Context.EmployeeAuths.Add(auth);
            }

            Context.SaveChanges();
              
            return new CommandResult<object>(true);
        }
          
        public bool UpdateTrangThaiCongViecEmployee(EmployeeEditModel model)
        {
            CheckDbConnect();
            var employee = Context.Employees.FirstOrDefault(x => x.Id == model.Id);
            if (employee != null)
            {
                var notes = new List<string>()
                {
                    //ChangeOptionCompare("trạng thái công việc", employee.TrangThaiCongViec, model.TrangThaiCongViec, "TrangThaiCongViec")
                };
                employee.TrangThaiCongViec = model.TrangThaiCongViec;
                employee.UpdatedBy = model.UpdatedBy;
                employee.UpdatedDate = DateTime.Now;

                Context.SaveChanges();
                 
                return true;
            }

            return false;
        }
         
        public bool UpdateEmployeeAvatar(Guid employeeId, string path)
        {
            CheckDbConnect();
            var d = Context.Employees.FirstOrDefault(x => x.Id == employeeId);
            if (d != null)
            {
                d.Avatar = path;
                Context.SaveChanges(); 
                return true;
            }

            return false;
        }
         
    }
}