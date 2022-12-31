using System;
using System.Collections.Generic;
using System.Linq;
using Service.AuthSharing.Executes.General.LocalEmailTemplates; 
using Service.Utility.Components;

namespace Service.AuthSharing.Executes.Base
{
	public partial class AuthSharingService
	{
        public LocalEmailTemplateViewModel LocalEmailTemplateOne(int id)
        {
            CheckDbConnect();
            var sql = "select top 1 l.* " +
                      "from LocalEmailTemplates l " +
                      "where l.Id = " + id;

            CheckDbConnect();
            var result = Context.Database.SqlQuery<LocalEmailTemplateViewModel>(sql).FirstOrDefault();
             
            var opt = OptionValueBaseList("LocalEmailTemplateCode");

            if (result != null)
            {
                if (result.Attributes.HasValue())
                {
                    var ids = result.Attributes.Split(',').Select(Int32.Parse).ToList();

                    result.AttributeList = opt.Where(x => ids.Contains(x.Id)).ToList();
                }
            }


            return result;
        }

        public LocalEmailTemplateViewModel LocalEmailTemplateOneByCode(string code)
        {
            CheckDbConnect();
            var sql = "select top 1 l.* " +
                      "from LocalEmailTemplates l " +
                      "where l.Code = '"+ code +"' and l.Status >= 0" ;

            CheckDbConnect();
            var result = Context.Database.SqlQuery<LocalEmailTemplateViewModel>(sql).FirstOrDefault();

            var opt = OptionValueBaseList("LocalEmailTemplateCode");

            if (result != null)
            {
                if (result.Attributes.HasValue())
                {
                    var ids = result.Attributes.Split(',').Select(Int32.Parse).ToList();

                    result.AttributeList = opt.Where(x => ids.Contains(x.Id)).ToList();
                }
            }
           

            return result;
        }

        public LocalEmailTemplateCodeViewModel LocalEmailTemplateCodeOne(int id)
        {
            CheckDbConnect();
            var item = Context.Database.SqlQuery<LocalEmailTemplateCodeViewModel>("select top 1 * from LocalEmailTemplateCodes where Id = " + id).FirstOrDefault();
            if (item != null)
            {
                 

            }
            return item;
        }

    }
}
