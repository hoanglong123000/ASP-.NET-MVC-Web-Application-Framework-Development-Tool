using System.Linq;
using DBContext.AuthSharing.Entities;
using Service.Utility.Components; 
using Service.Utility.Variables;
using Service.Core.Executes.Email;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public QueryResult<LocalEmailTask> EmailTaskMany(SearchEmailTaskModel model, OptionResult option)
        {
            IQueryable<LocalEmailTask> query = Context.LocalEmailTasks;

            if (model.Status.HasValue)
            {
                query = query.Where(x => x.Status == model.Status.Value);
            }

            if (model.CreatedDateFrom.HasValue)
            {
                query = query.Where(x => x.CreatedDate >= model.CreatedDateFrom.Value);
            }

            if (model.CreatedDateTo.HasValue)
            {
                var td = model.CreatedDateTo.Value.AddDays(1);
                query = query.Where(x => x.CreatedDate < td);
            }

            if (model.SentDateFrom.HasValue)
            {
                query = query.Where(x => x.SentDate >= model.SentDateFrom.Value);
            }

            if (model.SentDateTo.HasValue)
            {
                var td = model.SentDateTo.Value.AddDays(1);
                query = query.Where(x => x.SentDate < td);
            }

            if (model.Receivers.HasValue())
            {
                query = query.Where(x => x.Receivers.Contains(model.Receivers));
            }
             
            query = query.OrderByDescending(x => x.CreatedDate);
            var result = new QueryResult<LocalEmailTask>(query, option);
            return result;
        }
    }
}
