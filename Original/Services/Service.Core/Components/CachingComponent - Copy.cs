using System;
using System.IO;
using System.Threading;
using System.Xml.Serialization;
using Service.Variables;

namespace Service.Components
{
    [XmlRoot(ElementName = "root")]
    public class CachingDataModel
    {
        [XmlElement(ElementName = "data")]
        public string Data { get; set; }
        [XmlElement(ElementName = "createdDate")]
        public string CreatedDate { get; set; }
    }
    public class CachingComponent
    {
        public string Load(string fileName, string folder, int? minute = 60)
        {
            var dir = ConstantVariables.DefaultMedia + "global_caching";
            if (!string.IsNullOrEmpty(folder))
            {
                dir += "/" + folder;
            }
            fileName = fileName.RemoveSpecialChars();
            var files = Directory.GetFiles(dir, fileName + "_20*");
            foreach (var f in files)
            {
                var file = Path.GetFileName(f);
                var name = file.Substring(0, file.Length - 4);
                var arr = name.Split('_');
                var d = arr[arr.Length - 1];

                var h = d.Length > 10 ? d.Substring(10, 2) : "00";

                d = d.Substring(0, 4) + '-' + d.Substring(4, 2) + '-' + d.Substring(6, 2) + ' ' + d.Substring(8, 2) + ":" + h + ":00";
                var date = DateTime.ParseExact(d, "yyyy-MM-dd HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
                var duration = minute ?? 60;
                if (date.AddMinutes(duration) >= DateTime.Now)
                {
                    string txt = null;
                    var wait = true;
                    while (wait)
                    {
                        try
                        {
                            using (var logFileStream = new FileStream(f, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                            {
                                using (var logFileReader = new StreamReader(logFileStream))
                                {
                                    txt = logFileReader.ReadToEnd();
                                }
                            }

                            wait = false;
                        }
                        catch (IOException)
                        {
                            Thread.Sleep(500);
                            wait = true;
                        }
                    }

                    return txt;
                }
                File.Delete(f);
            }
            return null;
        }

        public bool Save(string fileName, string folder, string data)
        {
            var dir = ConstantVariables.DefaultMedia + "global_caching";
            if (!string.IsNullOrEmpty(folder))
            {
                dir += "/" + folder;
            }
            fileName = fileName.RemoveSpecialChars();
            var f = dir + "/" + fileName + '_' + DateTime.Now.ToString("yyyyMMddHHmm") + ".txt";
            if (!File.Exists(f))
            {
                File.WriteAllText(f, data);
            }
            return true;
        }

        public void Delete(string fileName, string folder)
        {
            var dir = ConstantVariables.DefaultMedia + "global_caching";
            if (!string.IsNullOrEmpty(folder))
            {
                dir += "/" + folder;
            }
            fileName = fileName.RemoveSpecialChars();
            var files = Directory.GetFiles(dir, fileName + "*");
            foreach (var file in files)
            {
                File.Delete(file);
            }
        }
    }
}