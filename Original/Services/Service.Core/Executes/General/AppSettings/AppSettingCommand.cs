using System;
using System.Collections.Generic;
using System.Linq; 
using DBServer.Entities;
using Service.Education.Executes.General.AppSettings;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public AppSetting AppSettingCommand(AppSetting model)
        {
            CheckDbConnect();
            var s = Context.AppSettings.FirstOrDefault(x => x.Tab == model.Tab && x.Section == model.Section) ??
                    new AppSetting()
                    {
                        Id = 0,
                        Tab = model.Tab,
                        Section = model.Section
                    };

            var notes = new List<string> { };

            s.Value = model.Value;
            s.UpdatedBy = model.UpdatedBy;
            s.UpdatedDate = DateTime.Now;
            if (s.Id == 0)
            {
                Context.AppSettings.Add(s);
            }

            Context.SaveChanges();
              
            Caching.Delete("Setting", "general");

            return s;
        }
        public AppSetting AppSettingSysCommand(AppSettingEditModel model)
        {
            CheckDbConnect();
            var s = Context.AppSettings.FirstOrDefault(x => x.Tab == model.Tab && x.Section == model.Section) ??
                    new AppSetting()
                    {
                        Id = 0,
                        Tab = model.Tab,
                        Section = model.Section
                    };
             
            s.Value = model.ValueHtml;
            s.UpdatedBy = model.UpdatedBy;
            s.UpdatedDate = DateTime.Now;
            s.Note = model.Note;
            if (s.Id == 0)
            {
                Context.AppSettings.Add(s);
            }

            Context.SaveChanges();
              
            return s;
        }
    }
}
