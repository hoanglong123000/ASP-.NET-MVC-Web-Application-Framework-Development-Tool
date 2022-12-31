using System.Linq;
using DBContext.AuthSharing.Entities;
using Service.Core.Executes.Employees.WorkLogs;
using Service.Utility.Variables;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public QueryResult<EmployeeWorkLogViewModel> EmployeeWorkLogMany(SearchEmployeeWorkLogModel model, OptionResult option)
        {
            CheckDbConnect();
            IQueryable<LocalEmpWorkLog> query = Context.LocalEmpWorkLogs;
            if (!string.IsNullOrEmpty(model.Type))
            {
                query = query.Where(x => x.Type == model.Type);
            }

            if (model.Types != null)
            {
                query = query.Where(x => model.Types.Contains(x.Type));
            }
            if (model.PerformBy.HasValue)
            {
                query = query.Where(x => x.PerformBy == model.PerformBy.Value);
            }
            if (!string.IsNullOrEmpty(model.ObjectId))
            {
                query = query.Where(x => x.ObjectId == model.ObjectId);
            }
            if (!string.IsNullOrEmpty(model.ObjectType))
            {
                query = query.Where(x => x.ObjectType == model.ObjectType);
            }
            if (model.FromDate.HasValue)
            {
                query = query.Where(x => x.Date >= model.FromDate.Value);
            }
            if (model.ToDate.HasValue)
            {
                var td = model.ToDate.Value.AddDays(1);
                query = query.Where(x => x.Date < td);
            }
            var r = query.Select(x => new EmployeeWorkLogViewModel()
            {
                Id = x.Id,
                Date = x.Date,
                Message = x.Message,
                Type = x.Type,
                PerformBy = x.PerformBy,
                ObjectId = x.ObjectId,
                ObjectType = x.ObjectType,
                IP = x.IP,
                Note = x.Note
            });
            r = r.OrderByDescending(x => x.Date);
            var result = new QueryResult<EmployeeWorkLogViewModel>(r, option);

            if (result.Many.Any())
            {
                //var users = EmployeeSuggestions(new SearchEmployeeModel()
                //{
                //    Ids = result.Many.Where(x => x.PerformBy.HasValue).Select(x => x.PerformBy.Value).Distinct().ToList()
                //}, new OptionResult() {Unlimited = true});

                //foreach (var item in result.Many)
                //{
                //    item.Perform = users.FirstOrDefault(x => x.Id == item.PerformBy);
                //}
            }
            return result;
        }

    }
}
