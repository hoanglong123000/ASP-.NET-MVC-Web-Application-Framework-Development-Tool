using Service.Education.Executes.Employees.Employees; 
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
         
        public string GetAddress(int? country, int? district, int? ward, string street)
        {
            CheckDbConnect();
            var address = new List<string>();
 
            return string.Join(", ", address);
        }

        public string GetEmployeeScanSignature(Guid employeeId)
        {
            CheckDbConnect();
            var signature = Context.Database.SqlQuery<string>(
                "select top 1 Signature from Employees where Id = '" +
                employeeId + "'").FirstOrDefault();
            return signature;
        }
    }
}