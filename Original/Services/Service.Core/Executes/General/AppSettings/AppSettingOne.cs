using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DBServer.Entities;


namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public AppSetting AppSettingOne(string tab, string section)
        {
            CheckDbConnect();
            var s = Context.AppSettings.FirstOrDefault(x => x.Tab == tab && x.Section == section);
            return s;
        }
        
    }
}
