using System;
using System.Collections.Generic;
   
using Service.Utility.Variables;
using System.Linq;
using Service.Utility.Components;
using Service.Core.Executes.General.Organizations;
using Service.AuthSharing.Executes.General.LocalOrganizations;

namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public OrganizationViewModel OrganizationOne(int id)
        {
            CheckDbConnect();

            return _coreService.OrganizationOne(id); 
        }

        public int OrganizationCount()
        {
            CheckDbConnect();
            var result = Context.Database.SqlQuery<int>("select count(*) from Organizations where Status >= 0").FirstOrDefault();
            return result;
        }

        public OrganizationViewModel OrganizationViewOne(int id)
        {
            CheckDbConnect();

            return _coreService.OrganizationViewOne(id);
        }

        public LocalOrganizationViewModel LocalOrganizationOne(int id)
        {
            CheckDbConnect();
             
            var result = Context.Database.SqlQuery<LocalOrganizationViewModel>
                ("select top 1 * from LocalOrganizations where Id = " + id).FirstOrDefault();
            return result;
        }
    }
}
