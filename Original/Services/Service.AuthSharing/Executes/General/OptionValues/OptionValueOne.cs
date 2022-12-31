using System.Linq;
using DBContext.AuthSharing.Entities;


namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public LocalOptionValue OptionValueOne(int id)
        {
            CheckDbConnect();
            return Context.LocalOptionValues.FirstOrDefault(x => x.Id == id);
        }
    }
}