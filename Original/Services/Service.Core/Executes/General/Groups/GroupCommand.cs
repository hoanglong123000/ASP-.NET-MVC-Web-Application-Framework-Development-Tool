using System;
using System.Collections.Generic;
using System.Linq;
using DBServer.Entities; 
using Service.Education.Executes.General.Groups;
using Service.Utility.Components;

namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public Group CreateGroup(GroupEditModel model)
        {
            CheckDbConnect();
            var r = new Group
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
                AllowHrm = model.AllowHrm,
                AllowPortal = model.AllowPortal,
                UpdatedBy = model.UpdatedBy,
                UpdatedDate = DateTime.Now
            };
            if (r.Id == 0)
            {
                Context.Groups.Add(r);
            }
            Context.SaveChanges();



            if (!string.IsNullOrEmpty(model.FeatureGroupStr))
            {
                var FeatureGroups = Serializer.Deserialize<List<FeatureGroup>>(model.FeatureGroupStr);
                foreach (var item in FeatureGroups)
                {
                    var sr = Context.FeatureGroups.FirstOrDefault(x =>
                                 x.GroupId == r.Id && x.FeatureId == item.FeatureId) ??
                             new FeatureGroup()
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
                        Context.FeatureGroups.Add(sr);
                    }

                    Context.SaveChanges();
                }

               
            }
             
            Caching.Delete("featuregroup", "general");
            Caching.Delete("group", "general");
            return r;
        }

        public Group EditGroup(GroupEditModel model)
        {
            CheckDbConnect();
            var r = Context.Groups.FirstOrDefault(x => x.Id == model.Id);
            if (r == null)
                return null;

            var notes = new List<string>()
            { 
            };

            r.Name = model.Name;
            r.Code = model.Code;
            r.Keyword = model.Name.ToKeyword();
            r.Description = model.Description;
            r.AllowPortal = model.AllowPortal;
            r.AllowData = model.AllowData;
            r.AllowHrm = model.AllowHrm;
            r.Status = model.Status;
            r.Priority = model.Priority;
            r.UpdatedBy = model.UpdatedBy;
            r.UpdatedDate = DateTime.Now;

            Context.SaveChanges();

            if (!string.IsNullOrEmpty(model.FeatureGroupStr))
            {
                var featureGroups = Serializer.Deserialize<List<FeatureGroup>>(model.FeatureGroupStr);
                foreach (var item in featureGroups)
                {
                    var sr = Context.FeatureGroups.FirstOrDefault(x => x.GroupId == r.Id && x.FeatureId == item.FeatureId) ??
                             new FeatureGroup()
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
                        Context.FeatureGroups.Add(sr);
                    }

                    Context.SaveChanges();
                    
                }
                Caching.Delete("FeatureGroup", "general");
            }
            if (model.DashboardReportGroupStr.HasValue())
            { 
            }

            Caching.Delete("featuregroup", "general");
            Caching.Delete("group", "general");

            return r;
        }

        public void DeleteGroup(int id)
        {
            CheckDbConnect();
            var r = Context.Groups.FirstOrDefault(x => x.Id == id);
            if (r != null)
            {
                r.Status = -1;
                Context.SaveChanges();
            }
        }
    }
}