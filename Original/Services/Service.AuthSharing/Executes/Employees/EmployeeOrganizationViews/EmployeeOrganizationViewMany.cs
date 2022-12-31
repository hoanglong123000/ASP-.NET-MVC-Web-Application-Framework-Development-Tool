using Service.BCT.Executes.Employees.Employees;
using Service.BCT.Executes.General.Districts;
using Service.BCT.Executes.General.OptionValues;
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.Linq;
using DBContext.BCT.Entities;
using Service.BCT.Executes.Category.JobPositions;
using Service.BCT.Executes.Employees.EmployeeOrganizations;
using Service.BCT.Executes.Employees.EmployeeOrganizationViews;
using Service.BCT.Executes.General.JobTitles; 

namespace Service.BCT.Executes.Base
{
    public partial class BCTService
    {
        public List<EmployeeOrganizationViewViewModel> EmployeeOrganizationViewMany(SearchEmployeeOrganizationModel model)
        {
            CheckDbConnect();
            IQueryable<EmployeeOrganizationView> query = Context.EmployeeOrganizationViews;

            if (model.JobPositionId.HasValue)
            {
                query = query.Where(x => x.JobPositionId == model.JobPositionId.Value);
            }

            if (model.OrganizationId.HasValue)
            {
                query = query.Where(x => x.OrganizationId == model.OrganizationId.Value);
            }

            if (model.Concurrently.HasValue)
            {
                query = query.Where(x => x.Concurrently == model.Concurrently.Value);
            }

            if (model.EmployeeId.HasValue)
            {
                query = query.Where(x => x.Id == model.EmployeeId.Value);
            }

            if (model.EmployeeIds != null)
            {
                query = query.Where(x => model.EmployeeIds.Contains(x.Id));
            }

            if (model.OrgLevelId.HasValue)
            {
                query = query.Where(x => x.OrgLevel == model.OrgLevelId.Value);
            }

            var r = query.Select(x => new EmployeeOrganizationViewViewModel()
            {
                Id = x.Id,
                OrganizationId = x.OrganizationId,
                JobPositionId = x.JobPositionId,
                GroupTitle = x.GroupTitle,
                JobTitleId = x.JobTitleId,
                Priority = x.Priority,
                Organizations = x.Organizations,
                OrgLevel = x.OrgLevel,
                Concurrently = x.Concurrently,
                MEP = x.MEP,
                OrgType = x.OrgType
            });

            r = r.OrderByDescending(x => x.Priority);

            var result = r.ToList();

            if (result.Any())
            {
                var pos = JobPositionMany(new SearchJobPositionModel()
                {
                    Cache = true
                }, new OptionResult() {Unlimited = true}).Many;

                var titles = JobTitleMany(new SearchJobTitleModel()
                {
                    Cache = true
                }, new OptionResult() {Unlimited = true}).Many;

                var orgs = OrganizationMany().Many;


                foreach (var item in result)
                {
                    item.ObjJobPosition = pos.FirstOrDefault(x => x.Id == item.JobPositionId);
                    item.ObjOrganization = orgs.FirstOrDefault(x => x.Id == item.OrganizationId);
                    item.ObjJobTitle = titles.FirstOrDefault(x => x.Id == item.JobTitleId);
                }
            }

            return result;
        }
    }
}