using System.Text;
using System.Web;

namespace Service.Core.Components
{
    public class PdfComponent
    {
        public HttpServerUtilityBase Server { get; set; }

        public PdfComponent()
        {

        }

        public PdfComponent(HttpServerUtilityBase server)
        {
            Server = server;
        }

        public bool Export(string url, string dest)
        {
            var controller = Server.MapPath(@"\Rotativa\wkhtmltopdf.exe ");
            var fp = FileComponent.GetFullPath(dest);
            var arg = new StringBuilder().AppendFormat("/K {0} {1} {2} & exit",
                controller,
                url,
                fp).ToString();

            System.Diagnostics.Process process = new System.Diagnostics.Process();
            process.StartInfo = new System.Diagnostics.ProcessStartInfo()
            {
                UseShellExecute = false,
                CreateNoWindow = true,
                WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden,
                FileName = "cmd.exe",
                Arguments = arg,
                RedirectStandardError = true,
                RedirectStandardOutput = true
            };
            process.Start();
            // Now read the value, parse to int and add 1 (from the original script)
            process.WaitForExit();
            return true;

        }
    }
}