using System.Collections.Generic;
using System.Linq;
using DBContext.AuthSharing.Entities;
using DBContext.Core.Entities;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public List<LocalSetting> LocalSettingMany(bool cache)
        {
            CheckDbConnect();
            if (cache)
            {
                var cachename = new List<string> { "localsettings" };
                var name = string.Join("_", cachename); 

                var data = Context.LocalSettings.ToList();
                Caching.Save(name, "general", Serializer.Serialize(data));
                return data;
            }
            return Context.LocalSettings.ToList();
        }
        public List<AppSetting> AppSettingMany(bool cache)
        {
            CheckDbConnect();
            return _coreService.AppSettingMany(true);
        }
    }
}