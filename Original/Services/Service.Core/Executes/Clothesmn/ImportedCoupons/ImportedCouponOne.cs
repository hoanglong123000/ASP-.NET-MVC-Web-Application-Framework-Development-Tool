using System;
using System.Collections.Generic;
using System.Linq; 
using Service.Utility.Variables;
using Service.Education.Executes.Clothesmn.ImportedCoupons;
using Service.Education.Executes.Clothesmn.Providers;


namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public ImportedCouponViewModel ImportedCouponOne(int id)
        {
            CheckDbConnect();
            var item = Context.Database.SqlQuery<ImportedCouponViewModel>("SELECT TOP 1 * from ImportedCoupons as C WHERE Id = " + id).FirstOrDefault();
            if(item != null)
            {
                var ids = new List<Guid>();
                ids.Add(item.UpdatedBy);
                ids.Add(item.CreatedBy);
                 
                ids = ids.Distinct().ToList();

                var providerids = new List<int>();
                var emps = _shareService.EmployeeBaseList(new Core.Executes.Employees.Employees.SearchEmployeeModel
                {
                    Ids = ids
                });
                item.ObjUpdatedBy = emps.FirstOrDefault(x => x.Id == item.UpdatedBy);
                item.ObjCreatedBy = emps.FirstOrDefault(x => x.Id == item.CreatedBy);

                var providers = ProvidersList(new SearchProvidersModel
                {
                    Ids = providerids
                });
                item.ObjProviderId = providers.FirstOrDefault(x => x.Id == item.ProviderId);    
            }
            return item;
        }
    }
}