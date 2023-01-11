using System;
using System.Collections.Generic; 
using System.Threading.Tasks;
using System.Web.Mvc;
using DBContext.Core.Entities;
using DBServer.Entities; 
using Service.Utility.Variables;

namespace Service.Education.Executes.Clothesmn.Customers
{
    public class SearchCustomerModel
    {
        public string Name { get; set; }
        public string Keyword { get; set; }
        
        
    }

    public class CustomerViewModel : Customer
    {
        
        public EmployeeBaseView ObjUpdatedBy { get; set; }
        public EmployeeBaseView ObjCreatedBy { get; set; }
        
        
    }

    public class CustomerEditModel : Customer
    {
        
    }
}
