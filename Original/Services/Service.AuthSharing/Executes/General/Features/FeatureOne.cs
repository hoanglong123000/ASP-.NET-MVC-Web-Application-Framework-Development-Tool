using System.Linq;
using DBContext.AuthSharing.Entities;


namespace Service.AuthSharing.Executes.Base
{
    public partial class AuthSharingService
    {
        public LocalFeature FeatureOne(int? id)
        {
            CheckDbConnect();
            IQueryable<LocalFeature> query = Context.LocalFeatures;
            if (id.HasValue)
            {
                return query.FirstOrDefault(x => x.Id == id.Value);
            }
            return null;
        }
    }
}
