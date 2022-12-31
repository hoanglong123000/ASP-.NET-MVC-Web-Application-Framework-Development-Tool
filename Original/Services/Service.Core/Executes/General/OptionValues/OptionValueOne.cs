using DBServer.Entities;
using System.Linq; 

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public OptionValue OptionValueOne(int id)
        {
            CheckDbConnect();
            return Context.OptionValues.FirstOrDefault(x => x.Id == id);
        }
    }
}