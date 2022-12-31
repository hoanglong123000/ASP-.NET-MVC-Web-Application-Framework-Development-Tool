using System;

using Service.BCT.Executes.Category.JobPositions;
using Service.BCT.Executes.Employees.EmployeeOrganizations;
using Service.BCT.Executes.General.Organizations; 
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Text; 
using Service.BCT.Executes.Employees.Employees;
using Service.Utility.Variables;

namespace Service.BCT.Executes.Base
{
    public partial class BCTService
    {
        //public QueryResult<EmployeeOrganizationViewModel> EmployeeOrganizationMany(SearchEmployeeOrganizationModel model, OptionResult option)
        //{
        //    if (model.Cache)
        //    {
        //        var name = "EmployeeOrganizations";
        //        if (model.EmployeeId.HasValue)
        //        {
        //            name += "_e_" + model.EmployeeId.Value;
        //        } 
        //        if (model.OrganizationId.HasValue)
        //        {
        //            name += "_o_" + model.OrganizationId.Value;
        //        }
        //        var dataStr = Caching.Load(name, "users");
        //        if (!string.IsNullOrEmpty(dataStr))
        //        {
        //            return Serializer.Deserialize<QueryResult<EmployeeOrganizationViewModel>>(dataStr);
        //        }

        //        var data = EmployeeOrganizationData(model, option);
        //        Caching.Save(name, "users", Serializer.Serialize(data));
        //        return data;
        //    }
        //    return EmployeeOrganizationData(model, option);
        //}

        //private QueryResult<EmployeeOrganizationViewModel> EmployeeOrganizationData(SearchEmployeeOrganizationModel model, OptionResult option)
        //{
        //    CheckDbConnect();

        //    var sql = "select distinct eo.*, op.IsOwner , jt.Priority " +
        //              "from EmployeeOrganizations eo " +
        //              "join OrganizationPositions op on op.OrganizationId = eo.OrganizationId " +
        //              "join Employees e on eo.EmployeeId = e.Id " +
        //              "left join JobPositions jp on jp.Id = eo.JobPositionId " +
        //              "left join JobTitles jt on jt.Id = jp.JobTitleId " +
        //              "where op.JobPositionId = eo.JobPositionId and e.TrangThaiCongViec = 1 ";
             
        //    if (model.EmployeeIds != null && model.EmployeeIds.Any())
        //    {
        //        var str = string.Join(",", model.EmployeeIds.Select(x => "'" + x + "'").ToList());
        //        sql += " and eo.EmployeeId in (" + str + ") ";
        //    }

        //    if (model.EmployeeId.HasValue)
        //    {
        //        sql += " and eo.EmployeeId = '" + model.EmployeeId.Value + "' ";
        //    }

        //    if (model.Concurrently.HasValue)
        //    {
        //        sql += " and eo.Concurrently = " + (model.Concurrently.Value ? "1" : "0") + " "; 
        //    }
        //    if (model.OrganizationId.HasValue)
        //    {
        //        if (model.IsCurrentOrg)
        //        {
        //            sql += " and eo.OrganizationId = " + model.OrganizationId.Value + " " ;
        //        }
        //        else
        //        {
        //            sql += " and eo.Organizations like '%;" + model.OrganizationId.Value + ";%' ";
        //        }
        //    }

        //    if (model.JobPositionId.HasValue)
        //    {
        //        sql += " and eo.JobPositionId = " + model.JobPositionId.Value + " ";
        //    }

        //    if (model.OrgLevelId.HasValue)
        //    {
        //        sql += " and OrgLevel = " + model.OrgLevelId.Value + " ";

        //    }

        //    sql += "order by jt.Priority ";

        //    var result = new QueryResult<EmployeeOrganizationViewModel>();

        //    try
        //    {
        //       result.Many = Context.Database.SqlQuery<EmployeeOrganizationViewModel>(sql).ToList(); 
        //    }
        //    catch (DbEntityValidationException e)
        //    {
        //        var message = "";
        //        foreach (var eve in e.EntityValidationErrors)
        //        {
        //            Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
        //                eve.Entry.Entity.GetType().Name, eve.Entry.State);
        //            foreach (var ve in eve.ValidationErrors)
        //            {
        //                message += new StringBuilder().AppendFormat("- Property: \"{0}\", Error: \"{1}\"",
        //                    ve.PropertyName, ve.ErrorMessage).ToString();
        //            }
        //        }

        //        LogError(message, "EmailTask");

        //        return null;
        //    }


        //    result.Count = 0;

        //    if (result.Many.Any())
        //    {
        //        var orgs = model.HasOrg ? OrganizationViewMany(new SearchOrganizationModel()
        //        {
        //            Cache = true
        //        }, new OptionResult() { Unlimited = true }).Many : new List<OrganizationViewModel>();

        //        var emps = model.HasEmployee
        //            ? EmployeeSuggestionMany(new SearchEmployeeModel()
        //            {
        //                HasOrg = false,
        //                Ids = result.Many.Select(x => x.EmployeeId).ToList()
        //            }, new OptionResult() {Unlimited = true}).Many : new List<EmployeeSuggestion>();

        //        var jobPositions = JobPositionViewMany(new SearchJobPositionModel()
        //        {
        //            Cache = true
        //        }, new OptionResult() { Unlimited = true }).Many;

        //        foreach (var item in result.Many)
        //        {
        //            if (model.HasEmployee)
        //            {
        //                item.Employee = emps.FirstOrDefault(x => x.Id == item.EmployeeId);
        //            }

        //            if (model.HasOrg)
        //            {
        //                item.ObjOrganization = orgs.FirstOrDefault(x => x.Id == item.OrganizationId);
        //            }

        //            item.ObjJobPosition = jobPositions.FirstOrDefault(x => x.Id == item.JobPositionId);
        //        }
        //    }
        //    return result;
        //}
    }
}
