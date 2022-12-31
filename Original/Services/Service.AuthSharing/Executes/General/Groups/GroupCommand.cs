using System;
using System.Collections.Generic;
using System.Linq;
using DBContext.AuthSharing.Entities;
using Service.Utility.Components;
using Service.AuthSharing.Executes.General.Groups;
using Service.Core.Executes.General.Groups;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public LocalGroup CreateGroup(LocalGroupEditModel model)
        {
            CheckDbConnect();
            var r = new LocalGroup
            {
                Id = 0,
                CreatedBy = model.CreatedBy,
                CreateDate = DateTime.Now,
                Name = model.Name,
                Priority = model.Priority,
                Keyword = model.Name.ToKeyword(),
                Code = model.Code,
                Description = model.Description,
                Status = model.Status,
                AllowData = model.AllowData,
                Allow = model.Allow, 
                UpdatedBy = model.UpdatedBy,
                UpdatedDate = DateTime.Now
            };
            if (r.Id == 0)
            {
                Context.LocalGroups.Add(r);
            }
            Context.SaveChanges();



            if (!string.IsNullOrEmpty(model.FeatureGroupStr))
            {
                var FeatureGroups = Serializer.Deserialize<List<LocalFeatureGroup>>(model.FeatureGroupStr);
                foreach (var item in FeatureGroups)
                {
                    var sr = Context.LocalFeatureGroups.FirstOrDefault(x =>
                                 x.GroupId == r.Id && x.FeatureId == item.FeatureId) ??
                             new LocalFeatureGroup()
                             {
                                 Id = 0,
                                 FeatureId = item.FeatureId,
                                 GroupId = r.Id
                             };
                    sr.AllowUpdate = item.AllowUpdate;
                    sr.AllowCreate = item.AllowCreate;
                    sr.AllowDelete = item.AllowDelete;
                    sr.AllowView = item.AllowView; 
                    if (sr.Id == 0)
                    {
                        Context.LocalFeatureGroups.Add(sr);
                    }

                    Context.SaveChanges();
                }

               
            }

          
            LogCreate("tạo mới nhóm người dùng", "GroupUser", r.Id.ToString());
            Caching.Delete("featuregroup", "general");
            Caching.Delete("group", "general");
            return r;
        }

        public LocalGroup EditGroup(LocalGroupEditModel model)
        {
            CheckDbConnect();
            var r = Context.LocalGroups.FirstOrDefault(x => x.Id == model.Id);
            if (r == null)
                return null;

            var notes = new List<string>()
            {
                ChangeCompare("tên nhóm người dùng", r.Name, model.Name),
                ChangeCompare("mã nhóm người dùng", r.Code, model.Code),
                ChangeCompare("mô tả", r.Description, model.Description)
            };

            r.Name = model.Name;
            r.Code = model.Code;
            r.Keyword = model.Name.ToKeyword();
            r.Description = model.Description;
            r.Allow = model.Allow;
            r.AllowData = model.AllowData; 
            r.Status = model.Status;
            r.Priority = model.Priority;
            r.UpdatedBy = model.UpdatedBy;
            r.UpdatedDate = DateTime.Now;

            Context.SaveChanges();

            if (!string.IsNullOrEmpty(model.FeatureGroupStr))
            {
                var featureGroups = Serializer.Deserialize<List<LocalFeatureGroup>>(model.FeatureGroupStr);
                foreach (var item in featureGroups)
                {
                    var sr = Context.LocalFeatureGroups.FirstOrDefault(x => x.GroupId == r.Id && x.FeatureId == item.FeatureId) ??
                             new LocalFeatureGroup()
                             {
                                 Id = 0,
                                 FeatureId = item.FeatureId,
                                 GroupId = r.Id
                             };

                    notes.Add(ChangeCompare("cho phép xem menu [" + item.FeatureId + "]", sr.AllowView, item.AllowView));
                    notes.Add(ChangeCompare("cho phép sửa menu [" + item.FeatureId + "]", sr.AllowUpdate, item.AllowUpdate));
                    notes.Add(ChangeCompare("cho phép tạo mới menu [" + item.FeatureId + "]", sr.AllowCreate, item.AllowCreate));
                    notes.Add(ChangeCompare("cho phép xóa menu [" + item.FeatureId + "]", sr.AllowDelete, item.AllowDelete)); 

                    sr.AllowUpdate = item.AllowUpdate;
                    sr.AllowCreate = item.AllowCreate;
                    sr.AllowDelete = item.AllowDelete;
                    sr.AllowView = item.AllowView;  
                    if (sr.Id == 0)
                    {
                        Context.LocalFeatureGroups.Add(sr);
                    }

                    Context.SaveChanges();
                    
                }
                Caching.Delete("FeatureGroup", "general");
            }
           
            Caching.Delete("featuregroup", "general");
            Caching.Delete("group", "general");

            return r;
        }

        public void DeleteGroup(int id)
        {
            CheckDbConnect();
            var r = Context.LocalGroups.FirstOrDefault(x => x.Id == id);
            if (r != null)
            {
                r.Status = -1;
                Context.SaveChanges();
            }
        }
    }
}