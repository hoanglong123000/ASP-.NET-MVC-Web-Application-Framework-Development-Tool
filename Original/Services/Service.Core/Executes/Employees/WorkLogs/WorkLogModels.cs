using System;
using System.Collections.Generic;
using DBServer.Entities;
using Service.Core.Executes.Employees.Employees; 

namespace Service.Core.Executes.Employees.WorkLogs
{
    public class EmployeeWorkLogViewModel : EmployeeWorkLog
    {
        public EmpBaseItem Perform { get; set; }
    }
    public class SearchEmployeeWorkLogModel
    {
        public List<string> Types { get; set; }
        public Guid? PerformBy { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string Type { get; set; }
        public string ObjectId { get; set; }
        public string ObjectType { get; set; }
    }
}
