using Service.Utility.Components;  
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.Linq;
using Service.AuthSharing.Components; 
using Service.Core.Executes.Employees.Employees;
using DBContext.Core.Entities;
using DBContext.AuthSharing.Entities;
using Service.AuthSharing.Executes.Employees.Employees;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {

        public EmployeeViewModel EmployeeOneByJobTitleCode(SearchEmployeeModel model)
        { 
            return _coreService.EmployeeOneByJobTitleCode(model);    
        }
         
        public Employee EmployeeSummaryOne(Guid id)
        {
            return _coreService.EmployeeSummaryOne(id);

            //CheckDbConnect();
            //var result = Context.Database.SqlQuery<EmployeeViewModel>("select Id, EmployeeCode, FullName, Email, PhoneNumber from Employees where Id = '" + id + "'").FirstOrDefault();
            //return result;
        }

        public EmployeeSuggestion EmployeeSuggestionOne(SearchEmployeeModel model)
        { 
            return new EmployeeSuggestion() ;
        }

        public string GetNewStaffCode()
        {
            return CodeComponent.Gen("Employee", null, 6);
            //CheckDbConnect();
            //var sql = "select COUNT(*) from Employees";
            //var result = Context.Database.SqlQuery<int>(sql).FirstOrDefault();

            //return StringComponent.ToAid(result + 1, "");
        }

        public EmployeeBaseView GetOwner(int orgId, int? jobPositionId)
        {
            return _coreService.GetOwner(new SearchOwnerModel
            {
                OrganizationId = orgId,
                JobPositionId = jobPositionId
            });
        }

        public bool EmployeeIsAdmin(Guid id)
        {
            if (_dataMethod == 1)
                return _coreService.EmployeeIsAdmin(id);

            var settings = LocalSettingMany(true);
            var admins = settings.GetValue("security", "admins");
            if (string.IsNullOrEmpty(admins))
                return false;

            var arr = admins.Split(';').Where(x => x != "").Select(x => new Guid(x)).ToList();
            if (arr.Contains(id))
                return true;
            return false;
        }
      
        public EmployeeBaseView EmployeeBaseViewOne(SearchEmployeeModel model)
        {
            if (_dataMethod == 1)
                return _coreService.EmployeeBaseViewOne(model);

            IQueryable<LocalEmployeeBaseView> q = Context.LocalEmployeeBaseViews;
            if (model.JobPositionId.HasValue)
            {
                q = q.Where(x => x.JobPositionId.HasValue && x.JobPositionId.Value == model.JobPositionId.Value);
            }

            if (model.JobTitleCode.HasValue())
            {
                var tt = JobTitleBaseList().FirstOrDefault(x => x.Code == model.JobTitleCode);
                if (tt != null)
                {
                    q = q.Where(x => x.JobTitleId == tt.Id);
                }
            }

            if (model.EmailCongTy.HasValue())
            {
                q = q.Where(x => x.EmailCongTy == model.EmailCongTy);
            }
            if (model.OrganizationId.HasValue)
            {
                q = q.Where(x => x.OrganizationId == model.OrganizationId.Value);
            }
            if (model.Id.HasValue)
            {
                q = q.Where(x => x.Id == model.Id);
            }

            if (model.StaffCode.HasValue())
            {
                q = q.Where(x => x.StaffCode == model.StaffCode);
            }

            var result = q.Select(x => new EmployeeBaseView
            {
                Id = x.Id,
                Avatar = x.Avatar,
                EmailCongTy = x.EmailCongTy,
                FullName = x.FullName,
                JobPositionId = x.JobPositionId,
                OrganizationId = x.OrganizationId,
                JobPositionName = x.JobPositionName,
                OrganizationName = x.OrganizationName,
                JobTitleName = x.JobTitleName,
                JobTitleId = x.JobTitleId,
                StaffCode = x.StaffCode
            }).FirstOrDefault();
            return result;
        }

        public LocalEmployeeViewModel LocalEmployeeOne(Guid empId)
        {
            CheckDbConnect();

            var result = Context.Database
                .SqlQuery<LocalEmployeeViewModel>
                ("select top 1 * from LocalEmployeeViews where Id = '" + empId + "'").FirstOrDefault();

            return result;
        }
    }
}