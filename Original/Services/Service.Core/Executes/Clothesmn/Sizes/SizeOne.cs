using System;
using System.Collections.Generic;
using System.Linq; 
using Service.Utility.Variables;
using Service.Education.Executes.Clothesmn.SizeTabs;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public SizeTabViewModel SizeOne(int id)
        {
            CheckDbConnect();
            var item = Context.Database.SqlQuery<SizeTabViewModel>("SELECT TOP 1 * from SizeTabs as B WHERE Id = " + id).FirstOrDefault();
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