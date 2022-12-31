
using Service.Utility.Components; 
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.Linq;
using DBContext.AuthSharing.Entities;
using Service.Core.Executes.General.FeatureGroups;
using Service.Core.Executes.General.Features;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public List<FeatureGroupViewModel> FeatureGroupMany(SearchFeatureGroupModel model)
        {
            if (model.Cache)
            {
                var cachename = new List<string> { "FeatureGroup" };
                if (model.GroupId.HasValue)
                {
                    cachename.Add("g_" + model.GroupId.Value);
                }

                if (model.FeatureType.HasValue)
                {
                    cachename.Add("t_" + model.FeatureType.Value);
                }
                if (model.FeatureId.HasValue)
                {
                    cachename.Add("s_" + model.FeatureId.Value);
                }

                if (model.Groups.HasValue())
                {
                    cachename.Add("gs_" + model.Groups);
                }
                var name = string.Join("_", cachename);
                var dataStr = Caching.Load(name, "general");
                if (!string.IsNullOrEmpty(dataStr))
                {
                    return Serializer.Deserialize<List<FeatureGroupViewModel>>(dataStr);
                }
                CheckDbConnect();
                var data = FeatureGroupData(model);
                Caching.Save(name, "general", Serializer.Serialize(data));
                return data;
            }
            return FeatureGroupData(model);
        }

        private List<FeatureGroupViewModel> FeatureGroupData(SearchFeatureGroupModel model)
        {
            CheckDbConnect();
            IQueryable<LocalFeatureGroup> query = Context.LocalFeatureGroups;
            if (model.GroupId.HasValue)
            {
                query = query.Where(x => x.GroupId == model.GroupId.Value);
            }

            if (model.FeatureId.HasValue)
            {
                query = query.Where(x => x.FeatureId == model.FeatureId.Value);
            }

            if (model.Groups.HasValue())
            {
                var gs = model.Groups.Split(';').Where(x => x != "").Select(Int32.Parse).ToList();
                query = query.Where(x => gs.Contains(x.GroupId));
            }

            IQueryable<LocalFeature> q2 = Context.LocalFeatures;
            if (model.FeatureType.HasValue)
            {
                q2 = q2.Where(x => x.Type == model.FeatureType.Value);
            }

            return null;

            //var r = (from x in query
            //         join s in q2 on x.FeatureId equals s.Id
            //         join g in Context.LocalGroups on x.GroupId equals g.Id
            //         select new FeatureGroupViewModel()
            //         {
            //             Id = x.Id,
            //             Group = g,
            //             FeatureId = x.FeatureId,
            //             GroupId = x.GroupId,
            //             AllowCreate = x.AllowCreate,
            //             AllowDelete = x.AllowDelete,
            //             AllowView = x.AllowView,
            //             AllowUpdate = x.AllowUpdate,
            //             Feature = s
            //         });
            //r = r.OrderBy(x => x.Feature.Priority);
            //return r.ToList();
        }

        public List<FeatureGroupViewModel> JoinFeatureGroups(List<FeatureGroupViewModel> list)
        {
            var result = list
                .GroupBy(p => p.FeatureId)
                .Select(g => g.First())
                .ToList();

            foreach (var item in result)
            {
                item.AllowCreate = list.Any(x => x.FeatureId == item.FeatureId && x.AllowCreate);
                item.AllowDelete = list.Any(x => x.FeatureId == item.FeatureId && x.AllowDelete);
                item.AllowUpdate = list.Any(x => x.FeatureId == item.FeatureId && x.AllowUpdate);
                item.AllowView = list.Any(x => x.FeatureId == item.FeatureId && x.AllowView);
            }

            return result;
        }

        public List<FeatureGroupViewModel> FeatureGroupAllowAll()
        {
            CheckDbConnect();
            var result = FeatureMany(new SearchFeatureModel()
            {
                Cache = true
            }, new OptionResult() { Unlimited = true }).Many.Select(x => new FeatureGroupViewModel()
            {
                AllowCreate = true,
                AllowDelete = true,
                AllowUpdate = true,
                AllowView = true,
                FeatureId = x.Id,
                Feature = x
            }).ToList();

            return result;
        }
         
    }
}