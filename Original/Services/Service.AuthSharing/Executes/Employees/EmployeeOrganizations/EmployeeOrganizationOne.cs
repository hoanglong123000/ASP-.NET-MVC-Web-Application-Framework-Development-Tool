using System.Linq;

using Service.BCT.Executes.Employees.EmployeeOrganizations;
using Service.BCT.Executes.Employees.Employees;

namespace Service.BCT.Executes.Base
{
    public partial class BCTService
    {
        public EmployeeOrganizationViewModel EmployeeOrganizationOne(int id)
        {
            CheckDbConnect();
            var sql = "select top 1 l.* " +
                      "from EmployeeOrganizations l " +
                      "where l.Id = " + id;
             
            var result = Context.Database.SqlQuery<EmployeeOrganizationViewModel>(sql).FirstOrDefault();

            if (result != null)
            {

            }

            return result;
        }
    }
}
