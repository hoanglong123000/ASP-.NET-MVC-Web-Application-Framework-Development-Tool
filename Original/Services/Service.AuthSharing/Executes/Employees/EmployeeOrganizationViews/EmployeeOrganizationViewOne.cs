
using Service.Utility.Components;
using Service.BCT.Executes.Category.JobPositions; 
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.Linq;
using Service.BCT.Executes.Employees.EmployeeOrganizationViews;
using Service.BCT.Executes.General.JobTitles;

namespace Service.BCT.Executes.Base
{
    public partial class BCTService
    {
        public EmployeeOrganizationViewViewModel EmployeeOrganizationViewOne(SearchEmployeeOrganizationModel model)
        {
            CheckDbConnect();

            var sql = "select * from EmployeeOrganizationViews where Id = '" + model.EmployeeId + "' ";
            if (model.Concurrently.HasValue)
            {
                sql += " and Concurrently = " + (model.Concurrently.Value ? "1" : "0") + " ";
            }

            var result = Context.Database
                .SqlQuery<EmployeeOrganizationViewViewModel>(sql).FirstOrDefault();
             

            if (result != null)
            {
                var pos = JobPositionMany(new SearchJobPositionModel()
                {
                    Cache = true
                }, new OptionResult() { Unlimited = true }).Many;

                var titles = JobTitleMany(new SearchJobTitleModel()
                {
                    Cache = true
                }, new OptionResult() { Unlimited = true }).Many;

                var orgs = OrganizationMany().Many;

                result.ObjJobPosition = pos.FirstOrDefault(x => x.Id == result.JobPositionId);
                result.ObjOrganization = orgs.FirstOrDefault(x => x.Id == result.OrganizationId);
                result.ObjJobTitle = titles.FirstOrDefault(x => x.Id == result.JobTitleId);

                if (model.HasEmployee)
                {
                }
            }

            return result;

        }
    }
}