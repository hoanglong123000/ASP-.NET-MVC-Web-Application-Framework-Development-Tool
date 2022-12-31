using System;
using System.Collections.Generic;
using DBContext.AuthSharing.Entities;
using DBContext.Core.Entities; 

namespace Service.AuthSharing.Executes.Employees.WorkLogs
{
    public class LocalEmpWorkLogViewModel : LocalEmpWorkLog
    {
        public EmployeeBaseView Perform { get; set; }
    } 
}
