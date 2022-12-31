
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Service.Core.Executes.Employees.Employees;
using Service.AuthSharing.Executes.Employees.Employees;
using DBContext.AuthSharing.Entities;
using System.Web.Helpers;
using Service.Utility.Components;
using System.Net.Configuration;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public CommandResult<LocalEmployee> LocalEmployeeCommand(LocalEmployeeEditModel model)
        {
            CheckDbConnect();

            var e = Context.LocalEmployees
                .FirstOrDefault(x => x.Id == model.Id) ?? new LocalEmployee
                {
                    Id = Guid.Empty,
                    CreatedBy = model.CreatedBy,
                    CreatedDate = DateTime.Now,


                };

            e.StaffCode = model.StaffCode;
            e.FullName = model.FullName;
            e.EmailCongTy = model.EmailCongTy;
            e.Avatar = model.Avatar;
            e.DiDong = model.DiDong; 
            e.Locked = model.Locked;
            e.LoginName = model.LoginName;
            e.JobPositionId = model.JobPositionId;
            e.OrganizationId = model.OrganizationId;
            e.UpdatedBy = model.UpdatedBy;
            e.UpdatedDate = DateTime.Now;

            if (model.Password.HasValue())
            {
                e.Password = Crypto.HashPassword(model.Password);
            }

            e.JobPositionId = model.JobPositionId;
            e.OrganizationId = model.OrganizationId;

            e.Keyword = (model.StaffCode + " " + model.FullName + " " + model.EmailCongTy).ToKeyword() + " " + model.FullName;

            if (e.Id == Guid.Empty)
            {
                e.Id = Guid.NewGuid();
                Context.LocalEmployees.Add(e);
            }

            Context.SaveChanges();

            return new CommandResult<LocalEmployee>(e);
        }

        public void DeleteEmployeeByIds(List<Guid> ids, Guid userId)
        {
            CheckDbConnect();
            var arr = ids.Select(x => "'" + x + "'").ToList();
            var idStr = string.Join("','", arr);
            Context.Database.ExecuteSqlCommand(
                "update LocalEmployees set Status = -1, UpdatedBy = '" + userId + "', UpdatedDate = getdate() " +
                "where Id in (" + idStr + ")");
            LogDelete("xóa nhân viên", "Employee", idStr);
        }
        public void RestoreEmployeeById(Guid id, Guid userId)
        {
            CheckDbConnect();
            Context.Database.ExecuteSqlCommand(
                "update Employees set Status = 0, UpdatedBy = '" + userId + "', UpdatedDate = getdate() " +
                "where Id = '" + id + "' ");

            UpdateOrgTotalEmployee();

            LogDelete("phụ hồi dữ liệu nhân viên", "Employee", id.ToString());
        }

        public CommandResult<object> EditEmployeeSecurity(EmployeeEditModel model)
        {

            return new CommandResult<object>(true);
        }

    }
}