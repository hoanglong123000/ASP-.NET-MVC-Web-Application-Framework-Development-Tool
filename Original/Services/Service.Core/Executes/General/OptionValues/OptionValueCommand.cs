using Service.Education.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using Service.Utility.Components;
using Service.Utility.Variables; 
using DBServer.Entities;
using Service.Education.Executes.General.OptionValues;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public OptionValue CreateOptionValue(OptionValueEditModel model)
        {
            CheckDbConnect();
            var d = new OptionValue
            {
                Id = 0,
                CreatedBy = model.CreatedBy,
                CreatedDate = DateTime.Now,
                Name = model.Name,
                Keyword = model.Name.ToKeyword(),
                Type = model.Type,
                Note = model.Note,
                UpdatedBy = model.UpdatedBy,
                MoRong1 = model.MoRong1,
                MoRong2 = model.MoRong2,
                MoRong3 = model.MoRong3,
                MoRong4 = model.MoRong4,
                MoRong5 = model.MoRong5,
                AllowChange = false,
                Code = model.Code,
                UpdatedDate = DateTime.Now
            };

            d.Status = model.Active ? 1 : 0;

            if (d.Id == 0)
            {
                Context.OptionValues.Add(d);
            }
            Context.SaveChanges();

            //LogCreate("tạo mới giá trị tùy chọn", "OptionValue", d.Id.ToString());

            Caching.Delete("OptionValue", "general");
            return d;
        }
        public OptionValue EditOptionValue(OptionValueEditModel model)
        {
            CheckDbConnect();
            var d = Context.OptionValues.FirstOrDefault(x => x.Id == model.Id);
            if (d == null)
                return null;

            var notes = new List<string>()
            {
                //ChangeCompare("tên", d.Name, model.Name),
                //ChangeCompare("loại", d.Type, model.Type),
                //ChangeCompare("ghi chú", d.Note, model.Note),
            };
            d.Name = model.Name;
            d.Code = model.Code;
            d.Keyword = (model.Code + " " + model.Name).ToKeyword();
            d.Type = model.Type;
            d.Note = model.Note;
            d.UpdatedBy = model.UpdatedBy;
            d.AllowChange = false;
            d.UpdatedDate = DateTime.Now;
            d.MoRong1 = model.MoRong1;
            d.MoRong2 = model.MoRong2;
            d.MoRong3 = model.MoRong3;
            d.MoRong4 = model.MoRong4;
            d.MoRong5 = model.MoRong5;

            d.Status = model.Active ? 1 : 0;

            if (d.Id == 0)
            {
                Context.OptionValues.Add(d);
            }
            Context.SaveChanges();

           // LogEdit("sửa giá trị tùy chọn", "OptionValue", d.Id.ToString(), notes);

            Caching.Delete("OptionValue", "general");
            return d;
        }
        public OptionValue EditAttrOptionValue(int id, string attr, string value)
        {
            CheckDbConnect();
            var o = Context.OptionValues.FirstOrDefault(x => x.Id == id);
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
            //LogDelete("xóa giá trị tùy chọn", "OptionValue", idStr);
        }
    }
}