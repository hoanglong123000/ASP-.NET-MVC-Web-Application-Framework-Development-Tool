using System.Collections.Generic;
using DBServer.Entities; 

namespace Service.Education.Executes.Employees.EmployeeAuths
{
    public class EmployeeAuthViewModel  : EmployeeAuth
    {
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Color { get; set; }
        public string StaffCode { get; set; }
        public string Avatar { get; set; }  
        public int? GioiTinh { get; set; } 
        public string DiDong { get; set; }    
        public bool Developer { get; set; }
        public int AllowData { get; set; }
        public bool AllowHrm { get; set; }
        public bool AllowPortal { get; set; }
        public bool IsCustomer { get; set; }
    }
}
