using System.Collections.Generic;
using Service.Utility.Variables;
using System.Linq;
using DBContext.Core.Entities;
using Service.Core.Executes.General.Address;
using DBContext.AuthSharing.Entities;
using Service.Utility.Components;

namespace Service.AuthSharing.Executes.Base
{
	public partial class AuthSharingService
	{
		#region Nation

		public QueryResult<LocalNation> NationMany(SearchNationModel model, OptionResult option)
		{
			CheckDbConnect();
			IQueryable<LocalNation> query = Context.LocalNations;

			if (!string.IsNullOrEmpty(model.Keyword))
			{
				query = query.Where(x => x.Keyword.Contains(model.Keyword.ToLower()));
			}

			query = query.OrderBy(x => x.Priority);
			return new QueryResult<LocalNation>(query, option);
		}

		public List<BaseItem> NationBaseList()
		{
			if (_dataMethod == 1)

				return _coreService.NationBaseList();

			var arr = new List<string> { "nationbaselist" };

			var name = string.Join("_", arr);
			var dataStr = Caching.Load(name, "general");
			if (!string.IsNullOrEmpty(dataStr))
			{
				return Serializer.Deserialize<List<BaseItem>>(dataStr);
			}

			CheckDbConnect();
			var data = Context.LocalNations.OrderBy(x => x.Priority).Select(x => new BaseItem()
			{
				Id = x.Id,
				Name = x.Name,
				Code = x.MaThue + ""
			}).ToList();

			Caching.Save(name, "general", Serializer.Serialize(data));
			return data;
		}

		#endregion

		#region Country

		public QueryResult<LocalCountry> CountryMany(SearchCountryModel model, OptionResult option)
		{
			CheckDbConnect();
			IQueryable<LocalCountry> query = Context.LocalCountries;
			if (model.Nation.HasValue)
			{
				query = query.Where(x => x.Nation == model.Nation.Value);
			}

			if (!string.IsNullOrEmpty(model.Keyword))
			{
				query = query.Where(x => x.Keyword.Contains(model.Keyword.ToLower()));
			}

			query = query.OrderByDescending(x => x.Priority);
			return new QueryResult<LocalCountry>(query, option);
		}

		public List<BaseItem> CountryBaseList(int nationId)
		{

			if (_dataMethod == 1)
				return _coreService.CountryBaseList(nationId);


			var arr = new List<string> { "countriesbaselist_" + nationId };

			var name = string.Join("_", arr);
			var dataStr = Caching.Load(name, "general");
			if (!string.IsNullOrEmpty(dataStr))
			{
				return Serializer.Deserialize<List<BaseItem>>(dataStr);
			}

			CheckDbConnect();
			var data = Context.LocalCountries.Where(x => x.Nation == nationId).Select(x => new BaseItem()
			{
				Id = x.Id,
				Name = x.Name,
				Code = x.MaThue + ""
			}).ToList();

			Caching.Save(name, "general", Serializer.Serialize(data));
			return data;
		}

		public List<BaseItem> CountriesAllBaseList()
		{

			if (_dataMethod == 1)
				return _coreService.CountriesAllBaseList();


			var arr = new List<string> { "countriesallbaselist" };

			var name = string.Join("_", arr);
			var dataStr = Caching.Load(name, "general");
			if (!string.IsNullOrEmpty(dataStr))
			{
				return Serializer.Deserialize<List<BaseItem>>(dataStr);
			}

			CheckDbConnect();
			var data = Context.LocalCountries.Select(x => new BaseItem()
			{
				Id = x.Id,
				Name = x.Name,
				Code = x.MaThue + ""
			}).ToList();

			Caching.Save(name, "general", Serializer.Serialize(data));
			return data;
		}
		#endregion

		#region district

		public QueryResult<LocalDistrict> DistrictMany(SearchDistrictModel model, OptionResult optionResult)
		{
			CheckDbConnect();
			IQueryable<LocalDistrict> query = Context.LocalDistricts;
			if (model.CountryId.HasValue)
			{
				query = query.Where(x => x.CountryId == model.CountryId.Value);
			}
			if (model.Ids != null && model.Ids.Any())
			{
				query = query.Where(x => model.Ids.Contains(x.Id));
			}
			if (!string.IsNullOrEmpty(model.Keyword))
			{
				query = query.Where(x => x.Keyword.Contains(model.Keyword.ToLower()));
			}

			if (model.CountryIds != null)
			{
				query = query.Where(x => model.CountryIds.Contains(x.CountryId));
			}
			query = query.OrderByDescending(x => x.Priority);
			return new QueryResult<LocalDistrict>(query, optionResult);
		}
		public List<BaseItem> DistrictBaseList(int countryId)
		{
			if (_dataMethod == 1)

				return _coreService.DistrictBaseList(countryId);


			var arr = new List<string> { "districtbaselist" };
			arr.Add("c" + countryId);

			var name = string.Join("_", arr);
			var dataStr = Caching.Load(name, "general");
			if (!string.IsNullOrEmpty(dataStr))
			{
				return Serializer.Deserialize<List<BaseItem>>(dataStr);
			}
			CheckDbConnect();
			IQueryable<LocalDistrict> q = Context.LocalDistricts;
			if (countryId > 0)
			{
				q = q.Where(x => x.CountryId == countryId);
			}

			var data = q.Select(x => new BaseItem()
			{
				Id = x.Id,
				Name = x.Name,
				Code = x.MaThue + ""
			}).ToList();
			Caching.Save(name, "general", Serializer.Serialize(data));
			return data;
		}

		public List<BaseItem> DistricsByCountries(List<int> ids)
		{

			if (_dataMethod != 1)

				return _coreService.DistricsByCountries(ids);

			CheckDbConnect();

			return Context.LocalDistricts.Where(x => ids.Contains(x.CountryId)).Select(x => new BaseItem()
			{
				Id = x.Id,
				Code = x.Code,
				Name = x.Name
			}).ToList();
		}

		#endregion

		#region ward

		public List<LocalWard> WardMany(SearchWardModel model, OptionResult option)
		{  
			CheckDbConnect();
			IQueryable<LocalWard> q = Context.LocalWards;

			if (model.DistrictId.HasValue)
			{
				q = q.Where(x => x.DistrictId == model.DistrictId.Value);
			}

			if (model.Keyword.HasValue())
			{
				var k = model.Keyword.ToKeyword();
				q = q.Where(x => x.Keyword.Contains(k));
			}

			return  q.OrderBy(x => x.Id).ToList();
		}

		public List<BaseItem> WardBaseList(int districtId)
		{
			if (_dataMethod == 1)
				return _coreService.WardBaseList(districtId);

			CheckDbConnect();
			var name = "wardbaselist_" + districtId;
			var dataStr = Caching.Load(name, "general");
			if (!string.IsNullOrEmpty(dataStr))
			{
				return Serializer.Deserialize<List<BaseItem>>(dataStr);
			}
			CheckDbConnect();
			IQueryable<LocalWard> q = Context.LocalWards;
			if (districtId > 0)
			{
				q = q.Where(x => x.DistrictId == districtId);
			}
			var data = q.Select(x => new BaseItem
			{
				Id = x.Id,
				Name = x.Name,
				Code = x.MaThue + ""
			}).OrderBy(x => x.Id).ToList();
			Caching.Save(name, "general", Serializer.Serialize(data));
			return data;
		}
		public List<BaseItem> WardsByDistricts(List<int> ids)
		{

			if (_dataMethod == 1)
				return _coreService.WardsByDistricts(ids);

			CheckDbConnect();
			return Context.LocalWards.Where(x => ids.Contains(x.DistrictId)).Select(x => new BaseItem
			{
				Id = x.Id,
				Code = x.Code,
				Name = x.Name
			}).ToList();
		}
		#endregion
	}
}