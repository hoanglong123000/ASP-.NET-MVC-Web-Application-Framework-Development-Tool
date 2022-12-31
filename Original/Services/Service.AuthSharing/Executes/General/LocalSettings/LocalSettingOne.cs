using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DBContext.AuthSharing.Entities;


namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public LocalSetting LocalSettingOne(string tab, string section)
        {
            CheckDbConnect();
            var s = Context.LocalSettings.FirstOrDefault(x => x.Tab == tab && x.Section == section);
            return s;
        }
        
    }
}
