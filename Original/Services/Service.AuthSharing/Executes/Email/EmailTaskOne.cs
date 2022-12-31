using System.Linq;
using DBContext.AuthSharing.Entities;
using Service.AuthSharing.Executes.Email;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public LocalEmailTaskViewModel EmailTaskOne(int id)
        {
            CheckDbConnect();
            var result =  Context.Database.SqlQuery<LocalEmailTaskViewModel>("select top 1 * from LocalEmailTasks where Id = " + id)
                .FirstOrDefault();
             
            return result;
        }
    }
}
