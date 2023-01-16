using System;
using System.Collections.Generic; 
using System.Threading.Tasks;
using System.Web.Mvc;
using DBContext.Core.Entities;
using DBServer.Entities; 
using Service.Utility.Variables;

namespace Service.Education.Executes.Clothesmn.Providers
{
    public class SearchProviderModel
    {
        public List<int> Ids { get; set; }
        public string Name { get; set; }
        public string Keyword { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Country { get; set; }
    }

    public class ProviderViewModel : Provider
    {
        
        public EmployeeBaseView ObjUpdatedBy { get; set; }
        public EmployeeBaseView ObjCreatedBy { get; set; }
        public BaseItem ObjPhoneNumber { get; set; }
        public BaseItem ObjAddress { get; set; }
        public BaseItem ObjCountry { get; set; }
        public BaseItem ObjName { get; set; }
    }

    public class ProviderEditModel : Provider
    {
        
    }
}
