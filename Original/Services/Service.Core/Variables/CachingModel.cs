using System.Web.Script.Serialization;
using Service.Core.Components;

namespace Service.Core.Variables
{
    public class CachingModel
    {
        public JavaScriptSerializer Serializer => new JavaScriptSerializer(); 
    }
}