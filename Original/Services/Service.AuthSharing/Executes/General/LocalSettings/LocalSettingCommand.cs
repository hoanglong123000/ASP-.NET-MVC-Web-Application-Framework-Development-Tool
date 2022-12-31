using System;
using System.Collections.Generic;
using System.Linq; 
using DBContext.AuthSharing.Entities;
using Service.AuthSharing.Executes.General.LocalSettings; 

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public LocalSetting LocalSettingCommand(LocalSetting model)
        {
            CheckDbConnect();
            var s = Context.LocalSettings.FirstOrDefault(x => x.Tab == model.Tab && x.Section == model.Section) ??
                    new LocalSetting()
                    {
                        Id = 0,
                        Tab = model.Tab,
                        Section = model.Section
                    };

            var notes = new List<string> {ChangeCompare(model.Tab + " - " + model.Section, s.Value, model.Value)};

            s.Value = model.Value;
            s.UpdatedBy = model.UpdatedBy;
            s.UpdatedDate = DateTime.Now;
            if (s.Id == 0)
            {
                Context.LocalSettings.Add(s);
            }

            Context.SaveChanges();
             
            LogEdit("cập nhật cài đặt hệ thống", "LocalSetting", s.Id.ToString(), notes);

            Caching.Delete("Setting", "general");

            return s;
        }
        public LocalSetting LocalSettingSysCommand(LocalSettingEditModel model)
        {
            CheckDbConnect();
            var s = Context.LocalSettings.FirstOrDefault(x => x.Tab == model.Tab && x.Section == model.Section) ??
                    new LocalSetting()
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
                Context.LocalSettings.Add(s);
            }

            Context.SaveChanges();
              
            return s;
        }
    }
}
