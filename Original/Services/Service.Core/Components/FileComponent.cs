using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using HtmlAgilityPack;
using Service.Utility.Variables;

namespace Service.Core.Components
{
    public class FileAttach
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
    }
    public static class FileComponent
    {
        // localhost

        // server 
        //public string _defaultMedia = @"E:/websites/Spress/media/";

       

        public static Image GetImageFromUrl(string url)
        {
            WebResponse result = null;
            Image rImage = null;
            try
            {
                WebRequest request = WebRequest.Create(url);
                result = request.GetResponse();
                Stream stream = result.GetResponseStream();
                BinaryReader br = new BinaryReader(stream);
                byte[] rBytes = br.ReadBytes(1000000);
                br.Close();
                result.Close();
                MemoryStream imageStream = new MemoryStream(rBytes, 0, rBytes.Length);
                imageStream.Write(rBytes, 0, rBytes.Length);
                rImage = Image.FromStream(imageStream, true);
                imageStream.Close();
            }
            catch (Exception)
            {
                //MessageBox.Show(c.Message);
            }
            finally
            {
                if (result != null) result.Close();
            }
            return rImage;

        }

        public static string DateFolder(string path, DateTime? date)
        {

            var now = date ?? DateTime.Now;
            if (!path.StartsWith("/"))
            {
                path = "/" + path;
            }
            if (path.EndsWith("/"))
            {
                path = path.Substring(0, path.Length - 1);
            }
            path += "/" + now.Year;
            var fp = GetFullPath(path);

            if (!Directory.Exists(fp))
            {
                Directory.CreateDirectory(fp);
            }
            path += "/" + now.Month;
            fp = GetFullPath(path);
            if (!Directory.Exists(fp))
            {
                Directory.CreateDirectory(fp);
            }
            path += "/" + now.Day;
            fp = GetFullPath(path);
            if (!Directory.Exists(fp))
            {
                Directory.CreateDirectory(fp);
            }
            return path;
        }

        public static string GuidFolder(string path, string guid)
        {
            var g = guid;
            if (!path.StartsWith("/"))
            {
                path = "/" + path;
            }
            if (path.EndsWith("/"))
            {
                path = path.Substring(0, path.Length - 1);
            }
            path += "/" + g[0];
            var fp = GetFullPath(path);
            if (!Directory.Exists(fp))
            {
                Directory.CreateDirectory(fp);
            }
            path += "/" + g[1];
            fp = GetFullPath(path);
            if (!Directory.Exists(fp))
            {
                Directory.CreateDirectory(fp);
            }
            path += "/" + g[2];
            fp = GetFullPath(path);
            if (!Directory.Exists(fp))
            {
                Directory.CreateDirectory(fp);
            }
            path += "/" + g.Substring(0, 8);
            fp = GetFullPath(path);
            if (!Directory.Exists(fp))
            {
                Directory.CreateDirectory(fp);
            }
            return path;
        }

        public static string IdFolder(string path, int id)
        {
            if (!path.StartsWith("/"))
            {
                path = "/" + path;
            }
            if (!path.EndsWith("/"))
            {
                path += "/";
            }
            var fp = "";
            if (id > 100)
            {
                var idstr = id + "";
                var i = 1;
                while (i < idstr.Length - 1)
                {
                    path += idstr.Substring(0, i) + "/";
                    fp = GetFullPath(path);
                    if (!Directory.Exists(fp))
                    {
                        Directory.CreateDirectory(fp);
                    }
                    i++;
                }
            }

            path += id + "/";
            fp = GetFullPath(path);
            if (!Directory.Exists(fp))
            {
                Directory.CreateDirectory(fp);
            }
            return path;
        }

        public static string GetFullPath(string path)
        {
            if (!string.IsNullOrEmpty(path))
            {
                if (path.IndexOf('/') < 0) return path;
                if (path[0] == '/')
                {
                    path = path.Substring(1);
                }

                var media = path.Substring(0, path.IndexOf('/'));

                if (media == "media")
                {
                    return ConstantVariables.DefaultMedia + path.Substring(media.Length + 1); ;
                }
                var root = "";
                foreach (var m in ConstantVariables.MediaConfigs)
                {
                    if (m.name == media)
                    {
                        root = m.path;
                        break;
                    }
                }
                return root + path.Substring(media.Length + 1);
            }
            return null;
        }

        public static MediaItem GetCurrentMedia()
        {
            return ConstantVariables.MediaConfigs.FirstOrDefault(x => !x.isFull);
        }

        public static List<MediaItem> GetFileAndFolders(string path, string type)
        {
            var result = new List<MediaItem>();
            path = path + "/folder_info.txt";
            var fp = GetFullPath(path);
            if (File.Exists(fp))
            {
                var lines = File.ReadAllLines(fp);
                foreach (var l in lines)
                {
                    var line = l;
                    if (!string.IsNullOrEmpty(line))
                    {
                        line = line.Replace("\n", string.Empty).Replace("\r", string.Empty).ToString();
                        var arr = line.Split(';');
                        if (arr.Length > 2)
                        {
                            if (string.IsNullOrEmpty(type) || type == arr[1])
                            {
                                if (arr[1] == "folder")
                                {
                                    result.Add(new MediaItem
                                    {
                                        name = arr[0],
                                        type = "folder",
                                        path = arr[2],
                                        share_status = arr[3]
                                    });
                                }
                                else
                                {
                                    result.Add(new MediaItem
                                    {
                                        name = arr[0],
                                        type = "file",
                                        path = arr[2],
                                        size = arr[3],
                                        dimensions = arr.Length == 5 ? arr[4] : ""
                                    });
                                }
                            }
                        }
                    }
                }
                return result;
            }
            File.Create(fp).Dispose();
            return result;
        }

        public static Image Resize(Image img, int srcX, int srcY, int srcWidth, int srcHeight, int dstWidth, int dstHeight)
        {
            var bmp = new Bitmap(dstWidth, dstHeight);
            using (var graphics = Graphics.FromImage(bmp))
            {
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
                using (var wrapMode = new ImageAttributes())
                {
                    wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                    var destRect = new Rectangle(0, 0, dstWidth, dstHeight);
                    graphics.DrawImage(img, destRect, srcX, srcY, srcWidth, srcHeight, GraphicsUnit.Pixel, wrapMode);
                }
            }
            return bmp;
        }

        public static void ResizeCropExcess(Image img, int dstWidth, int dstHeight, string outPath)
        {
            var ext = Path.GetExtension(outPath).ToLower();
            double srcRatio = img.Width / (double)img.Height;
            double dstRatio = dstWidth / (double)dstHeight;
            int srcX, srcY, cropWidth, cropHeight;

            if (srcRatio < dstRatio) // trim top and bottom
            {
                cropHeight = dstHeight * img.Width / dstWidth;
                srcY = (img.Height - cropHeight) / 2;
                cropWidth = img.Width;
                srcX = 0;
            }
            else // trim left and right
            {
                cropWidth = dstWidth * img.Height / dstHeight;
                srcX = (img.Width - cropWidth) / 2;
                cropHeight = img.Height;
                srcY = 0;
            }

            using (var result = new Bitmap(dstWidth, dstHeight))
            {
                using (var graphics = Graphics.FromImage(result))
                {
                    graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    graphics.CompositingMode = CompositingMode.SourceCopy;
                    graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    using (var wrapMode = new ImageAttributes())
                    {
                        wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                        var destRect = new Rectangle(0, 0, dstWidth, dstHeight);
                        graphics.DrawImage(img, destRect, srcX, srcY, cropWidth, cropHeight, GraphicsUnit.Pixel, wrapMode);
                    }
                }
                var encoderParams = new EncoderParameters(1);
                long quality = 100;
                EncoderParameter qualityParam = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, quality);
                encoderParams.Param[0] = qualityParam;
                switch (ext)
                {
                    case ".jpg":
                    case ".jpeg":
                        {
                            var codec = ImageCodecInfo
                                .GetImageEncoders().FirstOrDefault(i => i.MimeType.Equals("image/jpeg"));
                            result.Save(outPath, codec, encoderParams);
                        }
                        break;
                    case ".png":
                        {
                            var codec = ImageCodecInfo
                                .GetImageEncoders().FirstOrDefault(i => i.MimeType.Equals("image/png"));
                            result.Save(outPath, codec, encoderParams);
                        }
                        break;
                    case ".gif":
                        {
                            var codec = ImageCodecInfo
                                .GetImageEncoders().FirstOrDefault(i => i.MimeType.Equals("image/gif"));
                            result.Save(outPath, codec, encoderParams);
                        }
                        break;
                }
            }
        }

        public static void ResizeZoomExcess(Image img, int maxWidth, int maxHeight, string outPath)
        {
            var ext = Path.GetExtension(outPath).ToLower();
            var ratioX = (double)maxWidth / img.Width;
            var ratioY = (double)maxHeight / img.Height;
            var ratio = Math.Min(ratioX, ratioY);

            var newWidth = (int)(img.Width * ratio);
            var newHeight = (int)(img.Height * ratio);


            using (Bitmap result = new Bitmap(newWidth, newHeight))
            {
                // get the graphics and draw the passed image to the result bitmap
                using (Graphics grphs = Graphics.FromImage(result))
                {
                    grphs.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
                    grphs.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                    grphs.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                    grphs.DrawImage(img, 0, 0, result.Width, result.Height);
                }

                var encoderParams = new EncoderParameters(1);
                long quality = 100;
                EncoderParameter qualityParam = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, quality);
                encoderParams.Param[0] = qualityParam;
                switch (ext)
                {
                    case ".jpg":
                    case ".jpeg":
                        {
                            var codec = ImageCodecInfo
                                .GetImageEncoders().FirstOrDefault(i => i.MimeType.Equals("image/jpeg"));
                            result.Save(outPath, codec, encoderParams);
                        }
                        break;
                    case ".png":
                        {
                            var codec = ImageCodecInfo
                                .GetImageEncoders().FirstOrDefault(i => i.MimeType.Equals("image/png"));
                            result.Save(outPath, codec, encoderParams);
                        }
                        break;
                    case ".gif":
                        {
                            var codec = ImageCodecInfo
                                .GetImageEncoders().FirstOrDefault(i => i.MimeType.Equals("image/gif"));
                            result.Save(outPath, codec, encoderParams);
                        }
                        break;
                }
            }

        }

        public static Image Zoom(Image img, double ratio)
        {
            var w = img.Width * ratio;
            var h = img.Height * ratio;
            return Resize(img, 0, 0, img.Width, img.Height, (int)w, (int)h);
        }

        public static void DeleteFile(string path, bool inLibrary)
        {
            var fp = GetFullPath(path);
            if (File.Exists(fp))
            {
                File.Delete(fp);

                // delete thumbs
                Directory.Delete(fp + ".thumb", true);

                if (inLibrary)
                {
                    // update folder info
                    var folder = Path.GetDirectoryName(fp);
                    var info = "";
                    var lines = File.ReadAllLines(folder + "/folder_info.txt");
                    foreach (var line in lines)
                    {
                        if (!string.IsNullOrEmpty(line))
                        {
                            var arr = line.Replace("\r", string.Empty).Replace("\n", string.Empty).Split(';');
                            if (arr.Length > 2)
                            {
                                if (arr[1] != "file" || arr[2] != path)
                                {
                                    info += line + Environment.NewLine;
                                }
                            }
                            else
                            {
                                info += line + Environment.NewLine;
                            }
                        }
                        else
                        {
                            info += line + Environment.NewLine;
                        }
                    }
                    File.WriteAllText(folder + "/folder_info.txt", info, Encoding.UTF8);
                }
            }
        }

        public static bool IsValidImage(Stream imageStream)
        {
            if (imageStream.Length > 0)
            {
                Image.FromStream(imageStream).Dispose();
                imageStream.Close();
                return true;
            }

            imageStream.Close();
            return false;
        }

        public static void ResizeBySizeConfig(string path, string resizeType, string[] sizes)
        {
            var ext = Path.GetExtension(path).ToLower();
            var fp = GetFullPath(path);
            if (!string.IsNullOrEmpty(fp))
            {
                try
                {
                    if (File.Exists(fp))
                    {
                        var img = Image.FromFile(fp.ToLower());

                        fp += ".thumb";
                        if (!Directory.Exists(fp))
                        {
                            Directory.CreateDirectory(fp);
                        }
                        foreach (var s in sizes)
                        {
                            var arr = s.Split('x');
                            var tb = fp + "/" + s + ext;



                            if (resizeType == "zoom")
                            {
                                ResizeZoomExcess(img, Int32.Parse(arr[0]), Int32.Parse(arr[1]), tb);
                            }
                            else
                            {
                                ResizeCropExcess(img, Int32.Parse(arr[0]), Int32.Parse(arr[1]), tb);
                            }
                        }
                        img.Dispose();
                    }

                }
                catch (OutOfMemoryException)
                {
                    return;
                }
            }
        }

        public static ErrorCode DeleteFolder(string path)
        {
            var fp = GetFullPath(path);
            if (Directory.Exists(fp))
            {
                // delete folder
                Directory.Delete(fp, true);

                // update folder info
                var folder = Path.GetDirectoryName(fp);
                var infos = File.ReadAllLines(folder + "/folder_info.txt", Encoding.UTF8);
                var data = "";
                foreach (var line in infos)
                {
                    if (!string.IsNullOrEmpty(line))
                    {
                        var arr = line.Replace("\r", string.Empty).Replace("\n", string.Empty).Split(';');
                        if (arr.Length > 2)
                        {
                            if (arr[1] != "folder" || arr[2] != path)
                            {
                                data += line + Environment.NewLine;
                            }
                        }
                        else
                        {
                            data += line + Environment.NewLine;
                        }
                    }
                    else
                    {
                        data += line + Environment.NewLine;
                    }
                }
                File.WriteAllText(folder + "/folder_info.txt", data, Encoding.UTF8);
                return ErrorCode.None;
            }
            return ErrorCode.ObjectIsNotFound;
        }

        public static string SaveDetailImages(string d, string code)
        {
            var beforeD = d;

            var doc = new HtmlDocument();
            doc.LoadHtml(d);

            var imgDoms = doc.DocumentNode.SelectNodes("//img");
            if (imgDoms != null)
            {
                foreach (var imgDom in imgDoms)
                {
                    var src = imgDom.GetAttributeValue("src", "");
                    if (src != null)
                    {
                        var path = DateFolder("/media/upload", null) + "/" + code + "-" +
                                   DateTime.Now.ToString("yyyyMMddHHmmss");

                        if (src.Contains("data:image"))
                        {
                            var ext = src.Substring(11, src.IndexOf(";", StringComparison.CurrentCulture));
                            var imgData = src.Substring(src.IndexOf("base64,", StringComparison.CurrentCulture) + 7);
                            byte[] bytes = Convert.FromBase64String(imgData);
                            switch (ext)
                            {
                                case ".jpg":
                                case ".jpeg":
                                    {
                                        path += ".jpg";
                                    }
                                    break;
                                case ".png":
                                    {
                                        path += ".png";
                                    }
                                    break;
                                case ".gif":
                                    {
                                        path += ".gif";
                                    }
                                    break;
                                default:
                                    {
                                        path += ".jpg";
                                    }
                                    break;
                            }
                            var fp = GetFullPath(path);

                            using (MemoryStream ms = new MemoryStream(bytes))
                            {
                                using (var img = Image.FromStream(ms))
                                {
                                    img.Save(fp);
                                }
                            }
                            beforeD = beforeD.Replace("src=\"" + src, "src=\"" +  path);
                        }

                        if (src.Contains("http"))
                        {
                            var ext = Path.GetExtension(src);
                            if (ext.Contains("?"))
                            {
                                ext = ext.Substring(0, ext.IndexOf("?", StringComparison.CurrentCulture));
                            }
                            switch (ext)
                            {
                                case ".jpg":
                                case ".jpeg":
                                    {
                                        path += ".jpg";
                                    }
                                    break;
                                case ".png":
                                    {
                                        path += ".png";
                                    }
                                    break;
                                case ".gif":
                                    {
                                        path += ".gif";
                                    }
                                    break;
                                default:
                                    {
                                        path += ".jpg";
                                    }
                                    break;
                            }
                            SaveImageFromUrl(src, path, false, true);
                            beforeD = beforeD.Replace("src=\"" + src, "src=\"" + path);
                        }
                    }
                }
            }
            return beforeD;
        }

        public static string SaveImageFromUrl(string imgUrl, string path, bool async, bool optimizeSize)
        {
            var fp = GetFullPath(path);
            try
            {
                Console.WriteLine("save img " + imgUrl);

                using (WebClient client = new WebClient())
                {
                    if (async)
                    {
                        client.DownloadFileAsync(new Uri(imgUrl), fp);
                    }
                    else
                    {
                        byte[] data = client.DownloadData(new Uri(imgUrl));
                        if (data.Length > 0)
                        {
                            using (var ms = new MemoryStream(data))
                            {
                                var image = Image.FromStream(ms);
                                ResizeZoomExcess(image, 1024, 1024, fp);
                                return path;
                            }
                        }
                    }
                }
                //
                return path;
            }
#pragma warning disable CS0168 // The variable 'e' is declared but never used
            catch (Exception e)
#pragma warning restore CS0168 // The variable 'e' is declared but never used
            {
                return "";
            }
        }

        public static bool IsValidImage(string path)
        {
            string[] validExtensions = { ".jpg", ".bmp", ".gif", ".png", ".jpeg" };
            var ext = Path.GetExtension(path);
            return validExtensions.Contains(ext);
        }

        public static FileAttach SaveImageFromPostFileBase(HttpPostedFileBase file, string oldImg = "")
        {
            var result = new FileAttach()
            {
                Name = file.FileName,
                Id = StringComponent.Guid(10)
            };
            var ext = Path.GetExtension(file.FileName);
            var path = "/media/upload/";
            var name = StringComponent.Guid(6);
            path = DateFolder(path, null) + "/" + name + ext;
            var fp = "";
            if (!string.IsNullOrEmpty(oldImg))
            {
                fp = GetFullPath(oldImg);
                if (File.Exists(fp))
                {
                    File.Delete(fp);
                }
            }
            fp = GetFullPath(path);
            if (File.Exists(fp))
            {
                File.Delete(fp);
            }
            file.SaveAs(fp);
            result.Path = path;
            return result;
        }
    }
}