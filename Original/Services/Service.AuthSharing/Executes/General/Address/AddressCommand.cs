using System;
using System.Collections.Generic;
using System.Linq;
using DBContext.AuthSharing.Entities;
using DBContext.Core.Entities;
using Service.Core.Components;
using Service.Utility.Components;

namespace Service.AuthSharing.Executes.Base
{
	public partial class AuthSharingService
	{ 
        #region LocalNations
        public LocalNation LocalNationCommand(LocalNation model)
        {
            CheckDbConnect();
            var c = Context.LocalNations.FirstOrDefault(x => x.Id == model.Id) ?? new LocalNation
            {
                Id = 0
            };
            c.Name = model.Name;
            c.Type = model.Type;
            c.Keyword = model.Name.ToKeyword();
            c.MaThue = model.MaThue;
            if (c.Id == 0)
            {
                Context.LocalNations.Add(c);
                Context.SaveChanges();
                LogCreate("tạo mới danh mục quốc gia", "LocalNation", c.Id.ToString());
            }
            else
            {
                Context.SaveChanges();
                LogEdit("Cập nhật danh mục quốc gia", "LocalNation", c.Id.ToString());
            }

            Caching.Delete("Nation", "general");
            return c;
        }

        public void ChangeLocalNationPriority(int id, int priority)
        {
            CheckDbConnect();
            var c = Context.LocalNations.FirstOrDefault(x => x.Id == id);
            if (c != null)
            {
                c.Priority = priority;
                Context.SaveChanges();
                LogEdit("thay đổi thứ tự sắp xếp danh mục quốc gia", "LocalNation", c.Id.ToString());
                Caching.Delete("LocalNation", "general");
            }
        }

        public bool DeleteLocalNationByIds(List<int> ids)
        {
            CheckDbConnect();
            var idStr = string.Join(",", ids);
            Context.Database.ExecuteSqlCommand(
				"update LocalNations set Status = -1 where Id in (" + idStr + ")");

            LogDelete("xóa danh mục quốc gia", "LocalNation", idStr);

            Caching.Delete("Nation", "general");
            return true;
        }
        #endregion

        #region LocalCountry

        public LocalCountry CreateLocalCountry(LocalCountry model)
        {
            CheckDbConnect();
            var c = new LocalCountry
            {
                Id = 0,
                Name = model.Name,
                Keyword = model.Name.ToKeyword(),
                Lat = model.Lat,
                Lng = model.Lng
            };

            c.MaThue = model.MaThue;
            c.Nation = model.Nation;
            if (c.Id == 0)
            {
                Context.LocalCountries.Add(c);
            }
            Context.SaveChanges();

            LogCreate("tạo mới danh mục tỉnh/thành", "LocalCountry", c.Id.ToString());

            Caching.Delete("Country", "general");
            return c;
        }
        public LocalCountry EditLocalCountry(LocalCountry model)
        {
            CheckDbConnect();
            var c = Context.LocalCountries.FirstOrDefault(x => x.Id == model.Id);
            if (c == null)
                return null;

            var notes = new List<string>()
            {
                ChangeCompare("tên tỉnh/thành", c.Name, model.Name)
            };
            c.MaThue = model.MaThue;
            c.Nation = model.Nation;
            c.Name = model.Name;
            c.Keyword = model.Name.ToKeyword();
            //c.Code = "/" + model.Name.ToCode();
            c.Lat = model.Lat;
            c.Lng = model.Lng;

            Context.SaveChanges();

            LogEdit("sửa danh mục tỉnh/thành", "LocalCountry", c.Id.ToString(), notes);

            Caching.Delete("Country", "general");
            return c;
        }
        public void ChangeLocalCountryPriority(int id)
        {
            CheckDbConnect();
            var c = Context.LocalCountries.FirstOrDefault(x => x.Id == id);
            if (c != null)
            {
                c.Priority = DateTime.Now;
                Context.SaveChanges();
                LogEdit("thay đổi thứ tự sắp xếp danh mục tỉnh/thành", "LocalCountry", c.Id.ToString());
                Caching.Delete("Country", "general");
            }
        }

        public bool DeleteLocalCountryByIds(List<int> ids)
        {
            CheckDbConnect();
            var idStr = string.Join(",", ids);
            Context.Database.ExecuteSqlCommand(
                "update LocalCountries set Status = -1 where Id in (" + idStr + ")");

            LogDelete("xóa danh mục tỉnh/thành", "LocalCountry", idStr);

            Caching.Delete("Country", "general");
            return true;

        }

        #endregion

        #region LocalDistrict

        public LocalDistrict CreateLocalDistrict(LocalDistrict model)
        {
            CheckDbConnect();
            var d = new LocalDistrict
            {
                Id = 0,
                CountryId = model.CountryId,
                Code = model.Name.ToCode(),
                Name = model.Name
            };
            d.Keyword = model.Name.ToKeyword();
            d.MaThue = model.MaThue;
            if (d.Id == 0)
            {
                Context.LocalDistricts.Add(d);
            }
            Context.SaveChanges();
            Caching.Delete("District", "general");
            return d;
        }
        public LocalDistrict EditLocalDistrict(LocalDistrict model)
        {
            CheckDbConnect();
            var d = Context.LocalDistricts.FirstOrDefault(x => x.Id == model.Id);
            if (d == null)
                return null;

            var notes = new List<string>()
            {
            };
            d.MaThue = model.MaThue;
            d.CountryId = model.CountryId;

            d.Code = model.Name.ToCode();
            d.Name = model.Name;
            d.Keyword = model.Name.ToKeyword();
            Context.SaveChanges();
            LogEdit("sửa danh mục quận/huyện", "LocalDistrict", d.Id.ToString(), notes);
            Caching.Delete("District", "general");
            return d;
        }
        public void ChangeLocalDistrictPriority(int id)
        {
            CheckDbConnect();
            var c = Context.LocalDistricts.FirstOrDefault(x => x.Id == id);
            if (c != null)
            {
                c.Priority = DateTime.Now;
                Context.SaveChanges();

                Caching.Delete("District", "general");
                LogEdit("thay đổi thứ tự sắp xếp danh mục quận/huyện", "LocalDistrict", c.Id.ToString());
            }
        }

        public bool DeleteLocalDistrictByIds(List<int> ids)
        {
            CheckDbConnect();
            var idStr = string.Join(",", ids);
            Context.Database.ExecuteSqlCommand(
                "update LocalDistricts set Status = -1 where Id in (" + idStr + ")");
            Caching.Delete("District", "general");
            LogDelete("xóa danh mục quận/huyện", "LocalDistrict", idStr);
            return true;
        }

        #endregion
         
        #region LocalWard

        public LocalWard LocalWardCommand(LocalWard model)
        {
            CheckDbConnect();
            var d = Context.LocalWards.FirstOrDefault(x => x.Id == model.Id) ?? new LocalWard()
            {
                Id = 0
            };
            d.MaThue = model.MaThue;
            d.Name = model.Name;
            d.DistrictId = model.DistrictId;
            d.Code = model.Name.ToCode();
            d.Keyword = model.Name.ToKeyword();

            if (d.Id == 0)
            {
                Context.LocalWards.Add(d);
            }
            Context.SaveChanges();
            Caching.Delete("Ward", "general");
            return d;
        }

        public void DeleteLocalWard(int id)
        {
            CheckDbConnect();
            var w = Context.LocalWards.FirstOrDefault(x => x.Id == id);
            if (w != null)
            {
                Context.LocalWards.Remove(w);
                Context.SaveChanges();
            }
        }

        #endregion
    }
}