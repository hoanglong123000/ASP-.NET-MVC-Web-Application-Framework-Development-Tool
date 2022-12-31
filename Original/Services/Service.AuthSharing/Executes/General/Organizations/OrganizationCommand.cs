
using Service.Utility.Components;
using Service.AuthSharing.Executes.General.LocalOrganizations;
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.Linq;
using DBContext.AuthSharing.Entities;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public CommandResult<LocalOrganization> LocalOrganizationCommand(LocalOrganizationEditModel model)
        {
            CheckDbConnect();
            var d = Context.LocalOrganizations.FirstOrDefault(x => x.Id == model.Id) ?? new LocalOrganization
            {
                Id = 0,
                CreatedBy = model.CreatedBy,
                CreatedDate = DateTime.Now
            };
             
            d.Name = model.Name;
            d.Code = model.Code; 
            d.Type = model.Type;
            d.KhuVuc = model.KhuVuc; 
            d.Priority = Context.LocalOrganizations.Count();
            d.Stopped = model.Stopped;
            d.UpdatedDate = DateTime.Now;
            d.UpdatedBy = model.UpdatedBy;
            d.OwnerId = model.OwnerId;
            d.InOwnerId1 = model.InOwnerId1;
            d.InOwnerId2 = model.InOwnerId2;
            d.InOwnerId3 = model.InOwnerId3;
            d.InOwnerId4 = model.InOwnerId4;

            d.Keyword = (model.Code + " " + model.Name).ToKeyword();

            if(d.Id == 0)
            {
                Context.LocalOrganizations.Add(d);
            }

            Context.SaveChanges();

            Caching.Delete("Organization", "general"); 
            Caching.Delete("OrganizationsForChart", "general");
            Caching.Delete("OrganizationPosition", "general");

            return new CommandResult<LocalOrganization>(true, d);
        }

        public bool DeleteLocalOrganizationByIds(List<int> ids, Guid userid)
        {
            CheckDbConnect();
            var idStr = string.Join(",", ids);
            Context.Database.ExecuteSqlCommand(
                "update LocalOrganizations set Status = -1, UpdatedBy = '" + userid + "', UpdatedDate = getdate() " +
                "where Id in (" + idStr + ")");
            Caching.Delete("Organizations", "general");
            LogDelete("xóa đơn vị tổ chức", "LocalOrganization", idStr);
            return true;
        }


        public bool UpdateOrgTotalEmployee()
        {
            CheckDbConnect();
            Context.Database.ExecuteSqlCommand("execute sp_UpdateOrgTotalEmployee");

            Caching.Delete("Organization", "general");
            Caching.Delete("EmployeeOrganization", "users");
            return true;
        }
    }
}
