using System;
using System.Linq; 
using Service.Education.Executes.General.FeatureGroups;
using Service.Education.Executes.General.Groups;  
using Service.Utility.Variables;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public GroupViewModel GroupOne(int? id)
        {
            CheckDbConnect();
            var result = Context.Groups.Where(x => x.Id == id).Select(x => new GroupViewModel()
            {
                Id = x.Id,
                Code = x.Code,
                Name = x.Name,
                Description = x.Description,
                Priority = x.Priority,
                Status = x.Status,
                AllowPortal = x.AllowPortal,
                AllowHrm = x.AllowHrm,
                AllowData = x.AllowData
            }).FirstOrDefault();
            if (result != null)
            {
                result.FeatureGroups = FeatureGroupMany(new SearchFeatureGroupModel()
                {
                    GroupId = result.Id
                });
                 
                  
            }
            return result;
        }

        public string GetGroupNameById(int? id)
        {
            if (!id.HasValue)
                return "";
            var gs = GroupMany(new SearchGroupModel()
            {
                Cache = true
            }, new OptionResult() {Unlimited = true}).Many;

            var g = gs.FirstOrDefault(x => x.Id == id);
            if (g != null)
                return g.Name;
            return "";
        }
    }
}
