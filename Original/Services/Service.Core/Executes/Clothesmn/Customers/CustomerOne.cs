using System;
using System.Collections.Generic;
using System.Linq; 
using Service.Utility.Variables;
using Service.Education.Executes.Clothesmn.Customers;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public CustomerViewModel CustomerOne(int id)
        {
            CheckDbConnect();
            var item = Context.Database.SqlQuery<CustomerViewModel>("SELECT TOP 1 * from Customers as C WHERE Id = " + id).FirstOrDefault();
            if(item != null)
            {
                var ids = new List<Guid>();
                ids.Add(item.UpdatedBy);
                ids.Add(item.CreatedBy);
                 
                ids = ids.Distinct().ToList();
                var emps = _shareService.EmployeeBaseList(new Core.Executes.Employees.Employees.SearchEmployeeModel
                {
                    Ids = ids
                });
                item.ObjUpdatedBy = emps.FirstOrDefault(x => x.Id == item.UpdatedBy);
                item.ObjCreatedBy = emps.FirstOrDefault(x => x.Id == item.CreatedBy);
                
            }
            return item;
        }
    }
}