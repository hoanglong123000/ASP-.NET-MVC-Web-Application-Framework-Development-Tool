using System.Collections.Generic;
using System.Linq;
using DBServer.Entities;
using Service.Utility.Variables;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public List<AppSetting> AppSettingMany(bool cache)
        {
            CheckDbConnect();
            if (cache)
            {
                var cachename = new List<string> { "settings" };
                var name = string.Join("_", cachename);
                var dataStr = Caching.Load(name, "general");
                if (!string.IsNullOrEmpty(dataStr))
                {
                    return Serializer.Deserialize<List<AppSetting>>(dataStr);
                }

                var data = Context.AppSettings.ToList();
                Caching.Save(name, "general", Serializer.Serialize(data));
                return data;
            }
            return Context.AppSettings.ToList();
        }

        public List<BaseItem> SettingBaseList()
        {
            CheckDbConnect();

            var a = Context.AppSettings.Select(x => new BaseItem
            {
                Id = x.Id,
                Name = x.Note
            }).ToList();

            return a;
        }
    }
}