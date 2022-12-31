using Rotativa; 
using System.IO;
using System.Web.Mvc; 
using Service.Core.Components;
using Service.Utility.Components;
namespace Web.Student.Controllers.Export
{
    public partial class ExportController
    {
        public ActionResult ExportPdf()
        {
            var path = "";
            var fp = FileComponent.GetFullPath(path);
            var actionResult = new ActionAsPdf("ExportContent", new { })
            {
                FileName = ""
            };
            var byteArray = actionResult.BuildPdf(ControllerContext);
            var fileStream = new FileStream(fp, FileMode.Create, FileAccess.Write);
            fileStream.Write(byteArray, 0, byteArray.Length);
            fileStream.Close();
            ViewData["Path"] = path;
            return View();
        }
    }
}