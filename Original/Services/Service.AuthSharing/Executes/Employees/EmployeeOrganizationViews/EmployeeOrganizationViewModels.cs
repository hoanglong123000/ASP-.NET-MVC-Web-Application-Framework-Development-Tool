

using DBContext.BCT.Entities;

namespace Service.BCT.Executes.Employees.EmployeeOrganizationViews
{
    public class EmployeeOrganizationViewViewModel : EmployeeOrganizationView
    {
        public JobTitle ObjJobTitle { get; set; }
        public Organization ObjOrganization { get; set; }
        public JobPosition ObjJobPosition { get; set; }
    }
}