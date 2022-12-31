using System;

using System.Linq;
using DBContext.BCT.Entities;
using Service.BCT.Executes.Employees.Employees;

namespace Service.BCT.Executes.Base
{
    public partial class BCTService
    {
        public EmployeeDetail EmployeeDetailCommand(EmployeeEditModel model)
        {
            CheckDbConnect();
            var de = Context.EmployeeDetails.FirstOrDefault(x => x.EmployeeId == model.Id);
            if (de == null)
            {
                de = new EmployeeDetail()
                {
                    Id = 0,
                    EmployeeId = model.Id
                };
            }
            if (de.Id == 0)
            {
                Context.EmployeeDetails.Add(de);
            }
            Context.SaveChanges();
            return de;
        }
    }
}