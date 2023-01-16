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
            var item = Context.Database.SqlQuery<ImportedCouponViewModel>("SELECT TOP 1 * from ImportedCoupons as I WHERE Id = " + id).FirstOrDefault();
            if(item != null)
            {
                var ids = new List<Guid>();
                ids.Add(item.UpdatedBy);
                ids.Add(item.CreatedBy);
                 
                ids = ids.Distinct().ToList();
                var providernameid = new List<int>();
                providernameid.Add(item.ProviderId);

                providernameid.Distinct().ToList();

                var emps = _shareService.EmployeeBaseList(new Core.Executes.Employees.Employees.SearchEmployeeModel
                {
                    Ids = ids
                });
                var providername = ProviderNameList(new SearchProviderModel
                {
                    Ids = providernameid
                });

                item.ObjUpdatedBy = emps.FirstOrDefault(x => x.Id == item.UpdatedBy);
                item.ObjCreatedBy = emps.FirstOrDefault(x => x.Id == item.CreatedBy);
                item.ObjProviderId = providername.FirstOrDefault(x => x.Id == item.ProviderId);
                 
            }
            return item;
        }

        // LINQ   to map into ImportedCoupon table in SQL Server.
        private List<BaseItem> ProviderNameList(SearchProviderModel searchProviderModel)
        {
            CheckDbConnect();
            var list = Context.Providers.Select(x => new BaseItem { Id = x.Id, Name = x.Name }).ToList();
            foreach (var item in list)
            {
                var a = item.Name;
            }
            return list;
        }
    }
}