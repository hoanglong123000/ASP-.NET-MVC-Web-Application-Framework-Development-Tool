
using Service.Education.Components; 
using Service.Education.Executes.Employees.Employees; 
using Service.Utility.Components;
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.Linq; 
namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public EmployeeViewModel IsExistEmployee(SearchEmployeeModel model)
        {
            CheckDbConnect();
            var sql = "select * from Employees where ";

            var w = new List<string>();

            if (model.Id.HasValue)
            {
                w.Add(" Id = '" + model.Id.Value + "' ");
            }

            if (model.StaffCode.HasValue())
            {
                w.Add(" StaffCode = '" + model.StaffCode + "' ");
            }

            if (model.EmailCongTy.HasValue())
            {
                w.Add(" EmailCongTy = '" + model.EmailCongTy + "' ");
            }
            if (model.CMND.HasValue())
            {
                w.Add(" CMND = '" + model.CMND + "' ");
            }

            if (model.DiDong.HasValue())
            {
                w.Add(" DiDong = '" + model.DiDong + "' ");
            }

            sql += string.Join(" or ", w);

            var result = Context.Database.SqlQuery<EmployeeViewModel>(sql).FirstOrDefault();

            return result;
        }

        public EmployeeViewModel EmployeeOne(SearchEmployeeModel model)
        {
            CheckDbConnect();
            var sql = "select top 1 * from Employees where ";
            if (model.Id.HasValue)
            {
                sql += "Id = '" + model.Id.Value + "'";
            }

            if (!string.IsNullOrEmpty(model.Email))
            {
                sql += " Email = '" + model.Email + "'";
            }

            if (model.CMND.HasValue())
            {
                sql += " CMND = '" + model.CMND + "' ";
            }

            if (model.DiDong.HasValue())
            {
                sql += " DiDong = '" + model.DiDong + "' ";
            }

            var result = Context.Database.SqlQuery<EmployeeViewModel>(sql).FirstOrDefault();
            if (result == null) return null;
             
            return result;
        }

        public EmployeeViewModel EmployeeOneByJobTitleCode(SearchEmployeeModel model)
        {
            var sql = "select top 1 e.* from Employees e " +
                      "join EmployeeOrganizations eo on e.Id = eo.EmployeeId " +
                      "join JobPositions j on eo.JobPositionId = j.Id " +
                      "join JobTitles tl on tl.Id = j.JobTitleId " +
                      "where tl.Code = '" + model.JobTitleCode + "'";


            var result = Context.Database.SqlQuery<EmployeeViewModel>(sql).FirstOrDefault();
            if (result == null) return null;
        
           
            if (model.HasAuth)
            {
                result.EmployeeAuth = EmployeeAuthByEmpId(result.Id);
            }
              
           

            return result;
        }
         
        public EmployeeViewModel EmployeeSummaryOne(Guid id)
        {
            CheckDbConnect();
            var result = Context.Database.SqlQuery<EmployeeViewModel>("select Id, EmployeeCode, FullName, Email, PhoneNumber from Employees where Id = '" + id + "'").FirstOrDefault();
            return result;
        }

        

        public string GetNewStaffCode()
        {
            return CodeComponent.Gen("Employee", null, 6);
            //CheckDbConnect();
            //var sql = "select COUNT(*) from Employees";
            //var result = Context.Database.SqlQuery<int>(sql).FirstOrDefault();

            //return StringComponent.ToAid(result + 1, "");
        }
 
        public bool EmployeeIsAdmin(Guid id)
        {
            var settings = AppSettingMany(true);
            var admins = settings.GetValue("security", "admins");
            if (string.IsNullOrEmpty(admins))
                return false;

            var arr = admins.Split(';').Where(x => x != "").Select(x => new Guid(x)).ToList();
            if (arr.Contains(id))
                return true;
            return false;
        }
          
    }
}