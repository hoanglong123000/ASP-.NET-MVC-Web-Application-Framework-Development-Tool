using System.Collections.Generic;
using System.Linq;
using System.Net.Configuration;
using DBContext.AuthSharing.Entities;
using DBContext.Core.Entities;
using Service.AuthSharing.Executes.General.LocalEmailTemplates;
using Service.Core.Executes.General.Processes;
using Service.Utility.Components;
using Service.Utility.Variables;

namespace Service.AuthSharing.Executes.Base
{
	public partial class AuthSharingService
	{
        public QueryResult<LocalEmailTemplateViewModel> LocalEmailTemplateMany(SearchLocalEmailTemplateModel model, OptionResult option)
        {
            CheckDbConnect();

            IQueryable<LocalEmailTemplate> q = Context.LocalEmailTemplates.Where(x => x.Status >= 0); 
             

            if (model.Code.HasValue())
            {
                q = q.Where(x => x.Code.Contains(model.Code));
            }

            if (model.Keyword.HasValue())
            {
                q = q.Where(x => x.Keyword.Contains(model.Keyword));
            } 
             
            var r = (from x in q select new LocalEmailTemplateViewModel()
                     {
                         Id = x.Id,
                         Name = x.Name,
                         Code = x.Code,
                         Status = x.Status, 
                         Subject = x.Subject,
                         UpdatedDate = x.UpdatedDate 
                     });

            r = r.OrderBy(x => x.Code);

            var result = new QueryResult<LocalEmailTemplateViewModel>(r, option);

            return result;
        }

        public List<LocalEmailTemplateViewModel> LocalEmailTemplateSummaryList(SearchLocalEmailTemplateModel model)
        {
            CheckDbConnect();

            IQueryable<LocalEmailTemplate> q = Context.LocalEmailTemplates.Where(x => x.Status >= 0);
            
            if (model.Keyword.HasValue())
            {
                q = q.Where(x => x.Keyword.Contains(model.Keyword));
            }
             
            
            var r = (from x in q select new LocalEmailTemplateViewModel
                     {
                         Id = x.Id,
                         Detail = x.Detail, 
                         Status = x.Status, 
                         Name = x.Name, 
                         Code = x.Code, 
                         Subject = x.Subject, 
                     });

            r = r.OrderBy(x => x.Code);

            return r.ToList();
        }
         
    }
}
