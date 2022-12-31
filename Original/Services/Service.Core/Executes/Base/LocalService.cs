using System;
using System.Data.Entity.Validation;
using System.Text;
using System.Web; 
using Service.Core.Components; 

namespace Service.Core.Executes.Base
{
    public partial class LocalService : BaseService
    {
        public int Loop { get; set; } 
        public HttpContextBase HttpContext { get; set; }
         
        public LocalService(HttpContextBase httpContext)
        {
            HttpContext = httpContext;
            Caching = new CachingComponent();
        }

        public LocalService()
        {
            Caching = new CachingComponent();
        } 

        public void CheckDbConnect()
        {
            if (Context == null)
            {
                Loop = 1;
                Context = new LocalDBContext();
            }
            else
            {
                Loop++;
                if (Loop == 100)
                {
                    Dispose();
                    Context = new LocalDBContext();
                }
            }
        }

        public void Dispose()
        {
            if (Context != null)
            {
                Context.Dispose();
                Context = null;
            } 
        }

        public void SaveContext<T>(T obj)
        {
            try
            {
                Context.SaveChanges();
            }
            catch (DbEntityValidationException e)
            {
                StringBuilder sb = new StringBuilder();
                foreach (var eve in e.EntityValidationErrors)
                {
                    sb.AppendLine(string.Format("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name,
                        eve.Entry.State));
                    foreach (var ve in eve.ValidationErrors)
                    {
                        sb.AppendLine(string.Format("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName,
                            ve.ErrorMessage));
                    }
                }
                throw new DbEntityValidationException(sb.ToString(), e);
            }
        }
    }
}