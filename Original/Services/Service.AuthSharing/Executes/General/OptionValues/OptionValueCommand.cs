
using Service.Utility.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using DBContext.AuthSharing.Entities;
using Service.AuthSharing.Executes.General.OptionValues;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public LocalOptionValue LocalOptionValueCommand(LocalOptionValueEditModel model)
        {
            CheckDbConnect();
            var d = Context.LocalOptionValues.FirstOrDefault(x => x.Id == model.Id ) ??  new LocalOptionValue
            {
                Id = 0,
                CreatedBy = model.CreatedBy,
                CreatedDate = DateTime.Now
            };

            d.Code = model.Code;
            d.Name = model.Name;
            d.MoRong1 = model.MoRong1;
            d.Status = model.Active ? 1 : 0;
            d.Type = model.Type; 
            d.UpdatedBy = model.UpdatedBy;
            d.UpdatedDate = DateTime.Now;
            d.Priority = model.Priority;
            d.Keyword = model.Name.ToKeyword();

            if (d.Id == 0)
            {
                Context.LocalOptionValues.Add(d);
            }
            Context.SaveChanges();

            LogCreate("tạo mới giá trị tùy chọn", "OptionValue", d.Id.ToString());

            Caching.Delete("OptionValue", "general");
            return d;
        }
         
        public LocalOptionValue EditAttrOptionValue(int id, string attr, string value)
        {
            CheckDbConnect();
            var o = Context.LocalOptionValues.FirstOrDefault(x => x.Id == id);
            if (o != null)
            {
                switch (attr)
                {
                    case "Code":
                        {
                            o.Code = value;
                            o.Keyword = (o.Code + " " + o.Name).ToKeyword();
                        }
                        break;
                    case "Name":
                        {
                            o.Name = value;
                            o.Keyword = (o.Code + " " + o.Name).ToKeyword();
                        }
                        break;
                    case "Type":
                        {
                            o.Type = value;
                        }
                        break;
                    case "Note":
                        {
                            o.Note = value;
                        }
                        break;
                    case "AllowChange":
                        {
                            o.AllowChange = value == "true";
                        }
                        break;
                    case "MoRong1":
                        {
                            o.MoRong1 = value;
                        }
                        break;
                    case "MoRong2":
                        {
                            o.MoRong2 = value;
                        }
                        break;
                    case "MoRong3":
                        {
                            o.MoRong3 = value;
                        }
                        break;
                    case "MoRong4":
                        {
                            o.MoRong4 = value;
                        }
                        break;
                    case "MoRong5":
                        {
                            o.MoRong5 = value;
                        }
                        break;
                    case "Status":
                        {
                            o.Status = value == "true" ? 1 : 0;
                        }
                        break;
                    case "Priority":
                        {
                            int i;
                            if (Int32.TryParse(value, out i))
                            {
                                o.Priority = i;
                            }
                        }
                        break;
                }
                o.UpdatedDate = DateTime.Now;
                Context.SaveChanges();
            }
            Caching.Delete("OptionValue", "general");
            return o;
        }
        public void DeleteOptionValueByIds(List<int> ids)
        {
            CheckDbConnect();
            var idStr = string.Join(", ", ids);
            Context.Database.ExecuteSqlCommand("update OptionValues set Status = -1 " +
                                               "where Id in (" + idStr + ")");
            LogDelete("xóa giá trị tùy chọn", "OptionValue", idStr);
        }
    }
}