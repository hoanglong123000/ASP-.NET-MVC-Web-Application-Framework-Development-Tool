using Service.AuthSharing.Executes.General.JobPositions;
using Service.Core.Executes.Category.JobPositions;
using Service.Core.Executes.General.Groups; 
using Service.Utility.Components; 
using Service.Utility.Variables;
using System.Linq;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public JobPositionViewModel JobPositionOne(int id)
        { 
            if(_dataMethod == 1)
                return JobPositionOne(id);

            CheckDbConnect();
            var result = Context.Database.SqlQuery<JobPositionViewModel>("select top 1 * from LocalJobPositions where Id = " + id)
                .FirstOrDefault();
            if (result != null)
            {
                if (result.JobTitleId.HasValue)
                {
                    var JobTitles = JobTitleList(new Core.Executes.General.JobTitles.SearchJobTitleModel { });
                    result.JobTitle = JobTitles.FirstOrDefault(x => x.Id == result.JobTitleId.Value);
                }

                var groupUsers = GroupMany(new SearchGroupModel()
                {
                    Cache = true
                }, new OptionResult() { Unlimited = true }).Many;
                result.ObjGroup = groupUsers.FirstOrDefault(x => x.Id == result.GroupId);
            }

            return result;
        }
        public LocalJobPositionViewModel LocalJobPositionOne(int id)
        { 
            CheckDbConnect();
            var result = Context.Database.SqlQuery<LocalJobPositionViewModel>("select top 1 * from LocalJobPositions where Id = " + id)
                .FirstOrDefault();
            if (result != null)
            {
                if (result.JobTitleId.HasValue)
                {
                    var JobTitles = JobTitleBaseList();
                    result.JobTitle = JobTitles.FirstOrDefault(x => x.Id == result.JobTitleId.Value);
                }

                //var groupUsers = GroupBaselist
                //result.ObjGroup = groupUsers.FirstOrDefault(x => x.Id == result.GroupId);
            }

            return result;
        }
        public string GetNewJobPositionCode()
        {
           // CheckDbConnect();
            return CodeComponent.Gen("JobPosition", "VT");
            //var sql = "select top 1 Id from JobPositions order by Id desc";
            //var result = Context.Database.SqlQuery<int>(sql).FirstOrDefault();

            //return StringComponent.ToAid(result + 1, "JOB", 4);
        }
    }
}
