
using Service.Utility.Variables;
using DBContext.AuthSharing.Entities;
using Service.Core.Executes.Employees.EmployeeAuths;
using DBContext.Core.Entities;

namespace Service.AuthSharing.Executes.Employees.Employees
{
    public class LocalEmployeeViewModel : LocalEmployeeView
    {
        public int? CountRow { get; set; }
        public EmployeeAuthViewModel EmployeeAuth { get; set; }

        public EmployeeBaseView ObjCreatedBy { get; set; }
        public EmployeeBaseView ObjUpdatedBy { get; set; }
    }

    public class LocalEmployeeEditModel : LocalEmployee
    {

    }

    public class TTCVModel
    {
        public int TrangThai { get; set; }
        public int Total { get; set; }
    }
}