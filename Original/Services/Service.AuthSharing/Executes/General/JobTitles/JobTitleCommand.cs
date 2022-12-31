using System;
using System.Collections.Generic;
using System.Linq;
using DBContext.AuthSharing.Entities;
using Service.Utility.Components;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public LocalJobTitle LocalJobTitleCommand(LocalJobTitle model)
        {
            CheckDbConnect();
            var d = Context.LocalJobTitles.FirstOrDefault(x => x.Id == model.Id) ?? new LocalJobTitle
            {
                Id = 0,
                CreatedDate = DateTime.Now, 
                CreatedBy = model.CreatedBy 
            };

            d.Keyword = model.Name.ToKeyword();  
            d.CreatedBy = model.CreatedBy;
            d.Name = model.Name;
            d.UpdatedBy = model.UpdatedBy;
            d.UpdatedDate = DateTime.Now;
            d.Priority = model.Priority;

            if (d.Id == 0)
            {
                Context.LocalJobTitles.Add(d);
            }

            LogCreate("tại mới chức danh", "JobTitle", d.Id.ToString());

            Context.SaveChanges();
            return d;
        } 
        public bool DeleteJobTitleByIds(List<int> ids, Guid userid)
        {
            CheckDbConnect();
            var idStr = string.Join(",", ids);
            Context.Database.ExecuteSqlCommand(
                "update JobTitles set Status = -1, UpdatedBy = '" + userid + "', UpdatedDate = getdate() " +
                "where Id in (" + idStr + ")");
            Caching.Delete("JobTitles", "general");

            LogDelete("xóa chức danh", "JobTitle", idStr);

            return true;
        }
    }
}
