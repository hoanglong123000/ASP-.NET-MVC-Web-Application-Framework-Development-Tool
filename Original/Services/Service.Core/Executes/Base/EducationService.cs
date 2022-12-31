using System;
using System.Data.Entity.Validation;
using System.Net.Http;
using System.Text;
using System.Web;
using DBServer.Entities;
using Service.AuthSharing.Executes.Base;
using Service.Core.Executes.Employees.EmployeeAuths;
using Service.Utility.Components;

namespace Service.Education.Executes.Base
{
    public partial class EducationService : BaseService
    {
        public int Loop { get; set; }
        public ServerDBContext Context { get; set; }
        public EmployeeAuthViewModel Auth { get; set; }
        public HttpContextBase HttpContext { get; set; }
		public AuthSharingService _shareService { get; set; }
		public int _dataMethod { get; set; }

		public EducationService(EmployeeAuthViewModel auth, HttpContextBase httpContext, int dataMethod)
        {
            Auth = auth;
            HttpContext = httpContext;
            Caching = new CachingComponent();
			_shareService = new AuthSharingService(auth, httpContext, dataMethod);
			_dataMethod = dataMethod;
		}

        public EducationService(HttpContextBase httpContext, int dataMethod)
        {
            HttpContext = httpContext;
            Caching = new CachingComponent();
			_shareService = new AuthSharingService(httpContext, dataMethod);
			_dataMethod = dataMethod;
		}

        public EducationService()
        {
			_shareService = new AuthSharingService();
			Caching = new CachingComponent();
        } 

        public void CheckDbConnect()
        {
            if (Context == null)
            {
                Loop = 1;
                Context = new ServerDBContext();
            }
            else
            {
                Loop++;
                if (Loop == 100)
                {
                    Dispose();
                    Context = new ServerDBContext();
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