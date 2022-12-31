using Service.AuthSharing.Executes.General.Groups;
using Service.Utility.Variables;
using System.Linq;
using Service.AuthSharing.Executes.General.JobTitles;
using Service.Core.Executes.General.JobTitles;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public LocalJobTitleViewModel LocalJobTitleOne(int id)
        {
            CheckDbConnect();
            var result = Context.Database.SqlQuery<LocalJobTitleViewModel>("select top 1 * from LocalJobTitles where Id = " + id)
                .FirstOrDefault();

            if (result != null)
            {
                
            }

            return result;
        }

        public string GetJobTitleNameById(int? id)
        {
            if (!id.HasValue)
                return "";
            var js = JobTitleMany(new SearchJobTitleModel()
            {
                Cache = true
            }, new OptionResult() { Unlimited = true }).Many;
            var j = js.FirstOrDefault(x => x.Id == id);
            if (j != null)
                return j.Name;
            return "";
        }
    }
}
