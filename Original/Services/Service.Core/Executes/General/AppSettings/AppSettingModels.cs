using System.Web;
using System.Web.Mvc;
using DBServer.Entities;


namespace Service.Education.Executes.General.AppSettings
{
    public class AppSettingEditModel : AppSetting
    {
        public HttpPostedFileBase LogoWapPostFileBase { get; set; }
        public HttpPostedFileBase LogoWebPostFileBase { get; set; }
        public HttpPostedFileBase LoginBgPostFileBase { get; set; }


        [AllowHtml]
        public string ValueHtml { get; set; }
    }
}
