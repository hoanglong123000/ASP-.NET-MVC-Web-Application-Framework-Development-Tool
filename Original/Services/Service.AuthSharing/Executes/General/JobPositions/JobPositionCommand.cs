 
using System;
using System.Collections.Generic;
using System.Linq;
using DBContext.AuthSharing.Entities;
using Service.Utility.Variables;
using Service.Utility.Components;
using System.Runtime.InteropServices.WindowsRuntime;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public CommandResult<LocalJobPosition> LocalJobPositionCommand(LocalJobPosition model)
        {
            CheckDbConnect();
            var d = Context.LocalJobPositions
                .FirstOrDefault(x =>  x.Id == model.Id && x.Status >= 0) ?? new LocalJobPosition
            {
                Id = 0,
                CreatedDate = DateTime.Now, 
                CreatedBy = model.CreatedBy 
            };

            d.Priority = model.Priority; 
            d.Keyword = ( model.Name).ToKeyword().ToKeyword();
            d.CreatedBy = model.CreatedBy;
            d.Name = model.Name;
            d.UpdatedBy = model.UpdatedBy;
            d.GroupId = model.GroupId;
            d.UpdatedDate = DateTime.Now;
            d.JobTitleId = model.JobTitleId;
            d.ExternalTitle = model.ExternalTitle;
            d.RequestRecruitment = model.RequestRecruitment;
            d.Jobs = model.Jobs;
            d.Active = model.Active;

            if (d.Id == 0)
            {
                Context.LocalJobPositions.Add(d);
            }

            Context.SaveChanges();

            LogCreate("tại mới vị trí công việc", "LocalJobPosition", d.Id.ToString());

            Caching.Delete("LocalJobPosition", "general");
            return new CommandResult<LocalJobPosition>(true, d);
        }  

        public bool DeleteLocalJobPositionByIds(List<int> ids, Guid userid)
        {

            CheckDbConnect();
            var idStr = string.Join(",", ids);
            Context.Database.ExecuteSqlCommand(
                "update LocalJobPositions set Status = -1, UpdatedBy = '" + userid + "', UpdatedDate = getdate() " +
                "where Id in (" + idStr + ")");
            Caching.Delete("LocalJobPosition", "general");
            LogDelete("xóa vị trí công việc", "LocalJobPosition", idStr);
            return true;
        }

        public  CommandResult<bool> ActiveLocalJobPosition(int id , bool active)
        {
            CheckDbConnect();

            var p = Context.LocalJobPositions.FirstOrDefault(x => x.Id == id);
            if(p != null)
            {
                p.Active = active;
                Context.SaveChanges();
            }
            return new CommandResult<bool>(true);
        }
    }
}
