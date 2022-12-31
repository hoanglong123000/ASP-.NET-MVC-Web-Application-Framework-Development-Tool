using System.Linq;
using DBServer.Entities;


namespace Service.Education.Executes.Base
{
    public partial class EducationService
    {
        public Feature FeatureOne(int? id)
        {
            CheckDbConnect();
            IQueryable<Feature> query = Context.Features;
            if (id.HasValue)
            {
                return query.FirstOrDefault(x => x.Id == id.Value);
            }
            return null;
        }
    }
}
