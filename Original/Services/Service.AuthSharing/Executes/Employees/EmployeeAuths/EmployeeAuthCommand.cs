using System;
using System.Linq;
using System.Web.Helpers;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {

        public void LockUser(Guid id, bool locked)
        {
            CheckDbConnect();
            var u = Context.LocalEmployees.FirstOrDefault(x => x.Id == id);
            if (u != null)
            {
                Context.SaveChanges();
            }
        }

        //public bool UpdateResetPassNumber(Guid emplyeeId, string resetNumber)
        //{
        //    CheckDbConnect();
        //    var u = Context.EmployeeAuths.FirstOrDefault(x => x.EmployeeId == emplyeeId);
        //    if (u != null)
        //    {
        //        u.ResetPassNumber = resetNumber;
        //        Context.SaveChanges();
        //        return true;
        //    }

        //    return false;
        //}
        //public bool UpdateEmployeePassword(int authId, string password)
        //{
        //    CheckDbConnect();
        //    var auth = Context.EmployeeAuths.FirstOrDefault(x => x.Id == authId);
        //    if (auth != null)
        //    {
        //        auth.PasswordHash = Crypto.HashPassword(password);
        //        Context.SaveChanges();
        //        return true;
        //    }

        //    return false;
        //}
    }
}
