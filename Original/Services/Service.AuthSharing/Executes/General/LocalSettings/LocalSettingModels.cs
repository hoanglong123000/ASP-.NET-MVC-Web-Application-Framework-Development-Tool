using System.Web;
using System.Web.Mvc;
using DBContext.AuthSharing.Entities; 


namespace Service.AuthSharing.Executes.General.LocalSettings
{
    public class LocalSettingEditModel : LocalSetting
    {
        public HttpPostedFileBase LogoWapPostFileBase { get; set; }
        public HttpPostedFileBase LogoWebPostFileBase { get; set; }
        public HttpPostedFileBase LoginBgPostFileBase { get; set; }


        [AllowHtml]
        public string ValueHtml { get; set; }
    }
}
