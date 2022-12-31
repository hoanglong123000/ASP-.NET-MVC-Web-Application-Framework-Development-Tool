using DBContext.Core.Entities; 
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Text;
using Service.Core.Components;
using Service.Utility.Components;
using Service.Utility.Variables;
using Service.AuthSharing.Executes.General.LocalEmailTemplates;
using DBContext.AuthSharing.Entities;

namespace Service.AuthSharing.Executes.Base
{
	public partial class AuthSharingService
	{
        public LocalEmailTemplate CreateLocalEmailTemplate(LocalEmailTemplateEditModel model)
        {
            CheckDbConnect();

            var s = new LocalEmailTemplate()
            {
                Name = model.Name,
                Id = 0, 
                Status = 0,
                Code = model.Code,
                Subject = model.Subject,
                UpdatedDate = DateTime.Now, 
                UpdatedBy = model.UpdatedBy, 
                Attributes = model.Attributes
            };
            s.Keyword = model.Name.ToKeyword();
            Context.LocalEmailTemplates.Add(s);
            Context.SaveChanges();


            return s;
        }
        public LocalEmailTemplate EditLocalEmailTemplate(LocalEmailTemplateEditModel model)
        {
            CheckDbConnect();
            var e = Context.LocalEmailTemplates.FirstOrDefault(x => x.Id == model.Id);
            if (e != null)
            {
                e.Name = model.Name;
                e.Code = model.Code;
                e.Keyword = model.Name.ToKeyword(); 
                e.UpdatedBy = model.UpdatedBy;
                e.UpdatedDate = DateTime.Now;
                e.Subject = model.Subject;
                e.Attributes = model.Attributes;

                Context.SaveChanges();

                return e;
            }

            return null;
        }
        
        public CommandResult<LocalEmailTemplate> UpdateLocalEmailTemplateDetail(LocalEmailTemplateEditModel model)
        {
            CheckDbConnect();

            var e = Context.LocalEmailTemplates.FirstOrDefault(x => x.Id == model.Id);
            if (e != null)
            {
                var str = model.DetailStr;

                if (str.HasValue())
                {
                    if (str.Contains("src=\"data:image"))
                    {
                        var settings = AppSettingMany(true);
                        var url = settings.GetValue("general", "domain_api");
                        str = FileComponent.SaveDetailImages(str, StringComponent.Guid(10, null), "upload", url);
                    }
                }

                e.Detail = str;

                e.Subject = model.Subject;

                Context.SaveChanges();
            }
            return new CommandResult<LocalEmailTemplate>(true);
        }
        public bool DeleteLocalEmailTemplateByIds(List<int> ids, Guid userid)
        {
            CheckDbConnect();
            var idStr = string.Join(",", ids);
            Context.Database.ExecuteSqlCommand(
                "update LocalEmailTemplates set Status = -1, UpdatedBy = '" + userid + "', UpdatedDate = getdate() " +
                "where Id in (" + idStr + ")");

            LogDelete("xóa mẫu email", "LocalEmailTemplate", idStr);

            return true;
        }

    }
}
