
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using DBContext.AuthSharing.Entities;
using Service.Core.Executes.Employees.Employees;
using DBContext.Core.Entities;
using Service.AuthSharing.Executes.Employees.Employees;
using System.Linq;
using System.Windows.Navigation;
using Service.Utility.Components;
using System.Net.Configuration;

namespace Service.AuthSharing.Executes.Base
{
	public partial class AuthSharingService
	{
		public QueryResult<EmployeeViewModel> EmployeeViews(SearchEmployeeModel model, OptionResult option)
		{
			return new QueryResult<EmployeeViewModel>();

		}

		public List<EmployeeSuggestionView> EmployeeSuggestionList(SearchEmployeeModel model, OptionResult option)
		{
			if (_dataMethod == 1)
				return _coreService.EmployeeSuggestionViewList(model, option);

			CheckDbConnect();

			IQueryable<LocalEmployeeView> q = Context.LocalEmployeeViews.Where(x => x.Status >= 0);

			if (!model.HasAdmin)
			{
				q = q.Where(x => !x.IsAdmin);
			}

			if (model.Keyword.HasValue())
			{
				q = q.Where(x => x.Keyword.Contains(model.Keyword));
			}

			var r = q.Select(x => new EmployeeSuggestionView
			{
				Id = x.Id,
				StaffCode = x.StaffCode,
				FullName = x.FullName,
				JobPositionId = x.JobPositionId,
				OrganizationId = x.OrganizationId,
				JobPositionName = x.JobPositionName,
				Avatar = x.Avatar,
				DiDong = x.DiDong,
				EmailCongTy = x.EmailCongTy,
				JobTitleId = x.JobTitleId,
				OrganizationName = x.OrganizationName,

			});

			r = r.OrderBy(x => x.StaffCode);

			return r.ToList();
		}

		public QueryResult<EmployeeSuggestionView> EmployeeSuggestionMany(SearchEmployeeModel model, OptionResult option)
		{
			if (_dataMethod == 1)
				return _coreService.EmployeeSuggestionViewMany(model, option);

			CheckDbConnect();

			IQueryable<LocalEmployeeView> q = Context.LocalEmployeeViews.Where(x => x.Status >= 0);

			if (model.Keyword.HasValue())
			{
				q = q.Where(x => x.Keyword.Contains(model.Keyword));
			}

			var r = q.Select(x => new EmployeeSuggestionView
			{
				Id = x.Id,
				StaffCode = x.StaffCode,
				FullName = x.FullName,
				JobPositionId = x.JobPositionId,
				OrganizationId = x.OrganizationId,
				JobPositionName = x.JobPositionName,
				Avatar = x.Avatar,
				DiDong = x.DiDong,
				EmailCongTy = x.EmailCongTy,
				JobTitleId = x.JobTitleId,
				OrganizationName = x.OrganizationName,

			});

			r = r.OrderBy(x => x.StaffCode);

			return new QueryResult<EmployeeSuggestionView>(r, option);
		}

		public List<EmployeeBaseView> EmployeeBaseList(SearchEmployeeModel model)
		{

			if (_dataMethod == 1)
				return _coreService.EmployeeBaseList(model);



			CheckDbConnect();

			IQueryable<LocalEmployeeBaseView> q = Context.LocalEmployeeBaseViews;

			if (model.Ids != null)
			{
				q = q.Where(x => model.Ids.Contains(x.Id));
			}

			if (model.Id.HasValue)
			{
				q = q.Where(x => x.Id == model.Id.Value);
			}

			var result = q.Select(x => new EmployeeBaseView
			{
				Id = x.Id,
				StaffCode = x.StaffCode,
				FullName = x.FullName,
				Avatar = x.Avatar,
				EmailCongTy = x.EmailCongTy,
				JobPositionId = x.JobPositionId,
				OrganizationId = x.OrganizationId,
				JobPositionName = x.JobPositionName,
				JobTitleId = x.JobTitleId,
				JobTitleName = x.JobTitleName,
				OrganizationName = x.OrganizationName
			}).OrderBy(x => x.StaffCode).ToList();

			return result;

		}

		public QueryResult<LocalEmployeeViewModel> LocalEmployeeMany(SearchEmployeeModel model, OptionResult option)
		{
			CheckDbConnect();

			IQueryable<LocalEmployeeView> q = Context.LocalEmployeeViews.Where(x => x.Status >= 0);

			if (model.Locked.HasValue)
			{
				q = q.Where(x => x.Locked == model.Locked.Value);
			}
			if (!model.HasAdmin)
			{
				q = q.Where(x => !x.IsAdmin);
			}
			if (model.OrganizationId.HasValue)
			{
				q = q.Where(x => x.OrganizationId == model.OrganizationId.Value);
			}

			if (model.JobPositionId.HasValue)
			{
				q = q.Where(x => x.JobPositionId == model.JobPositionId.Value);
			}

			if (model.Keyword.HasValue())
			{
				var k = model.Keyword.ToKeyword();
				q = q.Where(x => x.Keyword.Contains(k));
			}

			q = q.Where(x => !x.IsAdmin);

			var r = q.Select(x => new LocalEmployeeViewModel
			{
				Id = x.Id,
				Avatar = x.Avatar,
				CreatedDate = x.CreatedDate,
				UpdatedDate = x.UpdatedDate,
				StaffCode = x.StaffCode,
				FullName = x.FullName,
				JobPositionId = x.JobPositionId,
				OrganizationId = x.OrganizationId,
				LoginName = x.LoginName,
				EmailCongTy = x.EmailCongTy,
				Locked = x.Locked,
				DiDong = x.DiDong,
				OrganizationName = x.OrganizationName,
				JobPositionName = x.JobPositionName,
				Status = x.Status,
				IsAdmin = x.IsAdmin,

			});
			r = r.OrderBy(x => x.StaffCode);

			var result = new QueryResult<LocalEmployeeViewModel>(r, option);

			if (result.Many.Any())
			{
				var empIds = result.Many.Select(x => x.CreatedBy).ToList();
				empIds.AddRange(result.Many.Where(x => x.UpdatedBy.HasValue).Select(x => x.UpdatedBy.Value).ToList());

				empIds = empIds.Distinct().ToList();

				var emps = EmployeeBaseList(new SearchEmployeeModel
				{
					Ids = empIds
				});

				foreach (var item in result.Many)
				{
					item.ObjCreatedBy = emps.FirstOrDefault(x => x.Id == item.CreatedBy);
					item.ObjUpdatedBy = emps.FirstOrDefault(x => x.Id == item.UpdatedBy);
				}
			}
			return result;
		}


	}
}