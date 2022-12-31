using System.Collections.Generic;
using System.Linq;
using DBContext.AuthSharing.Entities;
using DBContext.Core.Entities;
using Service.Core.Executes.General.Address;
using Service.Utility.Variables;

namespace Service.AuthSharing.Executes.Base
{
	public partial class AuthSharingService
	{
        public LocalNation NationOne(int id)
        {
            CheckDbConnect();
            return Context.LocalNations.FirstOrDefault(x => x.Id == id);
        }

        public LocalCountry CountryOne(int? id, int? districtId)
        {
            CheckDbConnect();
            if (id.HasValue)
            {
                return Context.LocalCountries.FirstOrDefault(x => x.Id == id.Value);
            }
            if (districtId.HasValue)
            {
                var d = Context.LocalDistricts.FirstOrDefault(x => x.Id == districtId.Value);
                if (d != null)
                {
                    return Context.LocalCountries.FirstOrDefault(x => x.Id == d.CountryId);
                }
            }
            return null;
        }

        public string GetCountryNameById(int? id)
        {
            CheckDbConnect();
            var countries = CountryMany(new SearchCountryModel() { Cache = true, Nation = 80 }, new OptionResult() { Unlimited = true }).Many;
            if (id.HasValue)
            {
                var c = countries.FirstOrDefault(x => x.Id == id.Value);
                if (c != null)
                    return c.Name;
            }
            return "";
        }

        public LocalDistrict DistrictOne(int id)
        {
            CheckDbConnect();
            return Context.LocalDistricts.FirstOrDefault(x => x.Id == id);
        }
        public string GetDistrictNameById(int? id, int? countryId)
        {
            CheckDbConnect();
            var ds = DistrictMany(new SearchDistrictModel()
            {
                Cache = true,
                CountryId = countryId
            }, new OptionResult() { Unlimited = true }).Many;
            if (id.HasValue)
            {
                var c = ds.FirstOrDefault(x => x.Id == id.Value);
                if (c != null)
                    return c.Name;
            }
            return "";
        }
        public LocalWard WardOne(int id)
        {
            CheckDbConnect();
            return Context.LocalWards.FirstOrDefault(x => x.Id == id);
        }


        public string GetAddress(int? country, int? district, int? ward, string street)
        {
            CheckDbConnect();
            var address = new List<string>();

            if (!string.IsNullOrEmpty(street))
            {
                address.Add(street);
            }

            if (district.HasValue)
            {
                var wards = WardBaseList(district.Value);

                var w = wards.FirstOrDefault(x => x.Id == ward);
                if (w != null)
                {
                    address.Add(w.Name);
                }
            }

            if (country.HasValue)
            {
                var districts = DistrictBaseList(country.Value);
                var d = districts.FirstOrDefault(x => x.Id == district);
                if (d != null)
                {
                    address.Add(d.Name);
                }
            }

            var countries = CountryBaseList(80);

            var c = countries.FirstOrDefault(x => x.Id == country);
            if (c != null)
            {
                address.Add(c.Name);
            }

            return string.Join(", ", address);
        }

    }
}