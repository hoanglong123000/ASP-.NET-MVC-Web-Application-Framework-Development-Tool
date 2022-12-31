using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Service.Utility.Components;
using Service.Utility.Variables;

namespace Web.Student.Controllers.Api
{
    public class SaveChunkModel
    {
        public int count { get; set; }
        public string path { get; set; }
        public string fileName { get; set; }
        public string fileCode { get; set; }
        public bool isSystem { get; set; }
        public string size { get; set; }
        public string dimensions { get; set; }
        public int? u { get; set; }
    }

    public class SearchMediaModel
    {
        public bool isSystem { get; set; }
        public string type { get; set; }
        public string folderType { get; set; }
        public string path { get; set; }
        public int? u { get; set; }
    }
    public class ApiMediaController : Controller
    {
        public ActionResult MediaList(SearchMediaModel model, OptionResult option)
        {
            QueryResult<MediaItem> result;
            var list = new List<MediaItem>();
            if (model.isSystem)
            {
                if (!string.IsNullOrEmpty(model.path))
                {
                    //kiểm tra /media có private
                    if (model.path.IndexOf("private", StringComparison.CurrentCulture) < 0)
                    {
                        model.path += "/private";
                    }
                    list = FileComponent.GetFileAndFolders(model.path, model.type);
                    result = new QueryResult<MediaItem>(list, option);
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                list = ConstantVariables.MediaConfigs.Select(x => new MediaItem
                {
                    name = x.name,
                    type = "folder",
                    path = "/media" + (x.id > 0 ? x.id + "" : ""),
                    isFull = x.isFull
                }).ToList();
                result = new QueryResult<MediaItem>(list, option);
                return Json(result, JsonRequestBehavior.AllowGet);
            } 
            list = new List<MediaItem>();
            if (string.IsNullOrEmpty(model.path))
            {
                model.path = "/media/drive/";

                list.Add(new MediaItem()
                {
                    path = model.path.Substring(0, model.path.Length - 1),
                    name = "My folder",
                    id = 0,
                    type = "folder"
                });
                return Json(new QueryResult<MediaItem>(list, option), JsonRequestBehavior.AllowGet);
            }

            var t = model.path.Substring(1);
            model.path = t.Substring(t.IndexOf('/') + 1);
            foreach (var media in ConstantVariables.MediaConfigs)
            {
                var fp = FileComponent.GetFullPath('/' + media.name + '/' + model.path);
                if (Directory.Exists(fp))
                {
                    var data = FileComponent.GetFileAndFolders('/' + media.name + '/' + model.path, model.type);
                    if (data != null)
                    {
                        list.AddRange(data);
                    }
                }
            }

            result = new QueryResult<MediaItem>(list, option);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public void OptimizeABC(string path)
        {
            //kiểm tra /media có private
            if (path.IndexOf("private", StringComparison.CurrentCulture) < 0)
            {
                path += "/private";
            }
            var medias = FileComponent.GetFileAndFolders(path, null);

            foreach (var m in medias)
            {
                if (m.type == "file")
                {
                    if (string.IsNullOrEmpty(m.dimensions))
                    {
                        var fp = FileComponent.GetFullPath(m.path);
                        try
                        {
                            using (Image img = Image.FromFile(fp))
                            {
                                m.dimensions = img.Width + " x " + img.Height;
                                var f = Path.GetDirectoryName(fp) + "/folder_info.txt";
                                var infos = System.IO.File.ReadAllLines(f);
                                var data = "";
                                foreach (var line in infos)
                                {
                                    if (!string.IsNullOrEmpty(line))
                                    {
                                        var arr = line.Replace("\r", string.Empty).Replace("\n", string.Empty).Split(';');
                                        if (arr.Length > 2)
                                        {
                                            if (arr[1] == "file" && arr[2] == m.path)
                                            {
                                                data += line + ";" + m.dimensions + Environment.NewLine;
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
                                }
                                System.IO.File.WriteAllText(f, data, Encoding.UTF8);
                                if (img != null)
                                {
                                    img.Dispose();
                                }

                            }
                        }
                        catch (Exception)
                        {
                            throw;
                        }


                    }
                }
                else
                {
                    OptimizeABC(m.path);
                }
            }
        }
        public JsonResult OptimizeMedia()
        {
            OptimizeABC("/media");

            return Json(true, JsonRequestBehavior.AllowGet);
        }
        public ActionResult CreateOrUpdateFolder(MediaItem media, int? u, bool isSystem = false)
        {
            if (isSystem)
            {
                if (media.path.IndexOf("private", StringComparison.CurrentCulture) < 0)
                {
                    media.path += "/private";
                }
            }
            else
            {
                if (u.HasValue)
                {
                    if (string.IsNullOrEmpty(media.path))
                    {
                        var path = FileComponent.IdFolder(
                            "/media/agents",
                            u.Value);
                        media.path = path;
                    }
                }
            }
            var folder = "";
            switch (media.type)
            {
                case "new":
                    {
                        folder = CreateFolder(media.path, media.name);
                    }
                    break;
                case "rename":
                    {
                        folder = RenameFileOrFolder("folder", media.path, media.name);
                    }
                    break;
            }
            return Json(folder, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult PostChunk(string fileCode, string type, int index, HttpPostedFileBase chunk)
        {
            if (fileCode.Contains('"'))
            {
                fileCode = fileCode.Replace("\"", string.Empty);
            }
            var path = Server.MapPath("/Content/temp_upload/" + fileCode + '_' + index + ".chunk");
            using (System.IO.FileStream fs = System.IO.File.Create(path))
            {
                byte[] bytes = new byte[1000000];

                int bytesRead;
                while ((bytesRead = chunk.InputStream.Read(bytes, 0, bytes.Length)) > 0)
                {
                    fs.Write(bytes, 0, bytesRead);
                }
            }
            return Json(fileCode, JsonRequestBehavior.AllowGet);
        }

        public bool IsFullMedia(string path)
        {
            var media = path.Split('/')[1];
            var isFull = false;
            foreach (var m in ConstantVariables.MediaConfigs)
            {
                if (m.name == media)
                {
                    isFull = m.isFull;
                    break;
                }
            }
            if (isFull)
            {
                return true;
            }
            return false;
        }

        public ActionResult SaveChunksForUpload(SaveChunkModel model)
        {
            if (model.fileCode.Contains('"'))
            {
                model.fileCode = model.fileCode.Replace("\"", string.Empty);
            }
            var file = FileComponent.DateFolder("/media/upload", null);
            var ext = Path.GetExtension(model.fileName).ToLower();
            file += "/" + model.fileCode + ext;

            var fp = FileComponent.GetFullPath(file);

            if (!System.IO.File.Exists(fp))
            {
                System.IO.File.Create(fp).Dispose();
            }
            if (model.count > 0)
            {
                for (int i = 0; i < model.count; i++)
                {
                    var chunk = Server.MapPath("~/Content/temp_upload/" + model.fileCode + '_' + i + ".chunk");
                    MergeFiles(fp, chunk);
                }
            }
            return Json(file, JsonRequestBehavior.AllowGet);
        }

        public string RenameFileOrFolder(string type, string path, string name)
        {
            var fp = FileComponent.GetFullPath(path);
            var f = Path.GetDirectoryName(fp) + "/folder_info.txt";
            var infos = System.IO.File.ReadAllLines(f);
            var data = "";
            foreach (var line in infos)
            {
                if (!string.IsNullOrEmpty(line))
                {
                    var arr = line.Replace("\r", string.Empty).Replace("\n", string.Empty).Split(';');
                    if (arr.Length > 2)
                    {
                        if (arr[1] == type && arr[2] == path)
                        {
                            data += name + line.Substring(line.IndexOf(';')) + Environment.NewLine;
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
            }
            System.IO.File.WriteAllText(f, data, Encoding.UTF8);

            // check and rename share folder
            //if (type == "folder")
            //{
            //    fp = GetFullPath("/media/agents/folder_info.txt");
            //    infos = File.ReadAllLines(fp);
            //    data = "";
            //    foreach (var line in infos)
            //    {
            //        if (!string.IsNullOrEmpty(line))
            //        {
            //            var arr = line.Replace("\r", string.Empty).Replace("\n", string.Empty).Split(';');
            //            if (arr.Length > 2)
            //            {
            //                if (arr[1] == type && arr[2] == path)
            //                {
            //                    data += name + line.Substring(line.IndexOf(';')) + Environment.NewLine;
            //                }
            //                else
            //                {
            //                    data += line;
            //                }
            //            }
            //            else
            //            {
            //                data += line;
            //            }
            //        }
            //    }
            //    File.WriteAllText(fp, data, Encoding.UTF8);
            //}
            return path;
        }

        public ActionResult SaveChunksForLibrary(SaveChunkModel model)
        {
            if (model.fileCode.Contains('"'))
            {
                model.fileCode = model.fileCode.Replace("\"", string.Empty);
            }
            if (!model.isSystem)
            {
                if (string.IsNullOrEmpty(model.path))
                {
                    model.path = "/media/drive";
                }
            }
            else
            {
                if (string.IsNullOrEmpty(model.path))
                {
                    model.path = "/media/drive";
                }
            }
            if (model.path.EndsWith("/"))
            {
                model.path = model.path.Substring(0, model.path.Length - 1);
            }
            if (model.path.IndexOf("/media", StringComparison.Ordinal) != 0)
            {
                model.path = "/media" + model.path;
            }

            var folder = model.path;
            //if (model.isSystem)
            //{
            //    if (folder.IndexOf("private", StringComparison.CurrentCulture) < 0)
            //    {
            //        folder += "/private";
            //    }
            //    if (IsFullMedia(folder))
            //    {
            //        return Json(ErrorCode.FolderHasBeenFull, JsonRequestBehavior.AllowGet);
            //    }
            //}
            //else
            //{ 
            //    if (model.u.HasValue)
            //    {
            //        if (string.IsNullOrEmpty(folder))
            //        {
            //            var cm = FileComponent.GetCurrentMedia();
            //            folder = FileComponent.IdFolder("/" + cm.name + "/agents", model.u.Value);
            //            GetStoreFolderById(folder);
            //        }
            //        if (IsFullMedia(folder))
            //        {
            //            var hasMedia = false;
            //            foreach (var m in ConstantVariables.MediaConfigs)
            //            {
            //                if (!m.isFull)
            //                {
            //                    var temp = folder.Substring(1);
            //                    temp = temp.Substring(temp.IndexOf('/') + 1);
            //                    // check and create folders on new media
            //                    var fp = m.path.Substring(0, m.path.Length - 1);
            //                    var tempArr = temp.Split('/');
            //                    foreach (var tr in tempArr)
            //                    {
            //                        fp += '/' + tr;
            //                        if (!Directory.Exists(fp))
            //                        {
            //                            Directory.CreateDirectory(fp);
            //                        }
            //                    }
            //                    folder = '/' + m.name + '/' + temp;
            //                    hasMedia = true;
            //                    break;
            //                }
            //            }
            //            if (!hasMedia)
            //            {
            //                return Json(ErrorCode.FolderHasBeenFull, JsonRequestBehavior.AllowGet);
            //            }
            //        }
            //    }
            //    else
            //    {
            //        return Json(ErrorCode.UnAuthentication, JsonRequestBehavior.AllowGet);
            //    }
            //}
            var ext = Path.GetExtension(model.fileName).ToLower();
            var file = folder + "/" + model.fileCode + ext;

            var outPath = FileComponent.GetFullPath(file);


            if (model.count > 0)
            {
                var rootFile = Server.MapPath("~/Content/temp_upload/" + model.fileCode + Path.GetExtension(outPath));
                for (int i = 0; i < model.count; i++)
                {
                    var chunk = Server.MapPath("~/Content/temp_upload/" + model.fileCode + '_' + i + ".chunk");
                    MergeFiles(rootFile, chunk);
                }


                var image = Image.FromFile(rootFile, true);

                var ratioX = (double)1024 / image.Width;
                var ratioY = (double)1024 / image.Height;
                var ratio = Math.Min(ratioX, ratioY);

                var newWidth = (int)(image.Width * ratio);
                var newHeight = (int)(image.Height * ratio);

                // the resized result bitmap
                using (Bitmap result = new Bitmap(newWidth, newHeight))
                {
                    // get the graphics and draw the passed image to the result bitmap
                    using (Graphics grphs = Graphics.FromImage(result))
                    {
                        grphs.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
                        grphs.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                        grphs.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                        grphs.DrawImage(image, 0, 0, result.Width, result.Height);
                    }

                    long quality = 100;
                    EncoderParameter qualityParam = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, quality);
                    //create a collection of EncoderParameters and set the quality parameter
                    var encoderParams = new EncoderParameters(1);
                    encoderParams.Param[0] = qualityParam;
                    //save the image using the codec and the encoder parameter

                    switch (ext)
                    {
                        case ".jpg":
                        case ".jpeg":
                            {
                                var codec = ImageCodecInfo.GetImageEncoders().FirstOrDefault(i => i.MimeType.Equals("image/jpeg"));
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
                image.Dispose();
            }
            FileComponent.ResizeBySizeConfig(file, "zoom", new[] { "1024x1024" });
            FileComponent.ResizeBySizeConfig(file, "drop", new[] { "512x512", "256x256" });
            AddFolderInfo(folder, new MediaItem
            {
                path = file,
                size = model.size,
                type = "file",
                name = model.fileName,
                dimensions = model.dimensions
            });
            return Json(file, JsonRequestBehavior.AllowGet);
        }

        private static void MergeFiles(string newPath, string chunk)
        {
            FileStream fs1 = null;
            FileStream fs2 = null;
            try
            {
                fs1 = System.IO.File.Open(newPath, FileMode.Append);
                fs2 = System.IO.File.Open(chunk, FileMode.Open);
                byte[] fs2Content = new byte[fs2.Length];
                fs2.Read(fs2Content, 0, (int)fs2.Length);
                fs1.Write(fs2Content, 0, (int)fs2.Length);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message + " : " + ex.StackTrace);
            }
            finally
            {
                fs1.Close();
                fs2.Close();
                System.IO.File.Delete(chunk);
            }
        }


        //Kiem tra trinh duyet Wap, web
        public ActionResult GetMediaManagerModal(bool isMobile = false)
        {
            string browser = isMobile ? "Wap" : "Web";
            ViewData["Browser"] = browser;
            return PartialView("~/Views/Web/Api/MediaManagerModal.cshtml");
        }
        [HttpPost]
        public JsonResult DeleteFiles(string[] paths)
        {
            foreach (var p in paths)
            {
                FileComponent.DeleteFile(p, true);
            }
            return Json(true, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteFolder(string path)
        {
            var temp = path.Substring(1);
            path = temp.Substring(temp.IndexOf('/') + 1);
            foreach (var media in ConstantVariables.MediaConfigs)
            {
                var mn = "media" + (media.id > 0 ? media.id + "" : "");
                FileComponent.DeleteFolder('/' + mn + '/' + path);
            }
            return Json(ErrorCode.None.ToString().ToLower(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult RenameFile(string path, string name)
        {
            RenameFileOrFolder("file", path, name);
            return Json(ErrorCode.None.ToString().ToLower(), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult TempUpload(HttpPostedFileBase file)
        {
            if (file != null)
            {
                var filename = DateTime.Now.ToString("yyyyMMdd") + "_" + StringComponent.Guid(8) + Path.GetExtension(file.FileName);
                var path = "/Content/temp_upload/" + filename;
                file.SaveAs(Server.MapPath(path));
                return Json(path, JsonRequestBehavior.AllowGet);
            }
            return Json("", JsonRequestBehavior.AllowGet);
        }

        public void AddFolderInfo(string folder, MediaItem media)
        {
            var t = "";
            switch (media.type)
            {
                case "folder":
                    {
                        t = media.name + ";folder;" + media.path + ";none" + Environment.NewLine;
                    }
                    break;
                case "file":
                    {
                        t = media.name + ";file;" + media.path + ";" + media.size + ";" + media.dimensions + Environment.NewLine;
                    }
                    break;
            }
            var info = FileComponent.GetFullPath(folder + "/folder_info.txt");
            if (!System.IO.File.Exists(info))
            {
                System.IO.File.Create(info).Dispose();
            }
            t = t + System.IO.File.ReadAllText(info, Encoding.UTF8);
            System.IO.File.WriteAllText(info, t, Encoding.UTF8);

        }

        public string GetStoreFolderById(string path)
        {
            try
            {

                var fp = FileComponent.GetFullPath(path);

                var info = path + "/folder_info.txt";
                if (!System.IO.File.Exists(fp + info))
                {
                    System.IO.File.Create(fp + info).Dispose();
                }
                return path;
            }
            catch
            {
                return null;
            }

        }
        public void CreateDefaultAgent(int media, int id, string name)
        {
            var path = "/media" + (media > 0 ? media + "" : "") + "/agents/";
            path = FileComponent.IdFolder(path, id);
            var fp = FileComponent.GetFullPath(path);
            if (fp != null)
            {
                var src = FileComponent.GetFullPath("/media/default");

                name = name.ToCode().ToLower();

                if (System.IO.File.Exists(src + "/cover/cover.jpg") && !System.IO.File.Exists(fp + "/cover.jpg"))
                {
                    System.IO.File.Copy(src + "/cover/cover.jpg", fp + "/cover.jpg");
                    FileComponent.ResizeBySizeConfig(path + "/cover.jpg", "zoom", new[] { "100x100" });
                }
                if (System.IO.File.Exists(src + "/agents/" + name[0] + ".jpg") && !System.IO.File.Exists(fp + "/avatar.jpg"))
                {
                    System.IO.File.Copy(src + "/agents/" + name[0] + ".jpg", fp + "/avatar.jpg");

                    FileComponent.ResizeBySizeConfig(path + "/avatar.jpg", "zoom", new[] { "100x100" });
                }
            }
        }
        public string CreateFolder(string path, string name)
        {
            if (path.EndsWith("/"))
            {
                path = path.Substring(0, path.Length - 1);
            }
            var newFolder = path + "/" + StringComponent.Guid(6);
            var fp = FileComponent.GetFullPath(newFolder);
            if (!Directory.Exists(fp))
            {
                Directory.CreateDirectory(fp);
            }
            // create folder info file
            System.IO.File.Create(fp + "/folder_info.txt").Dispose();
            AddFolderInfo(path, new MediaItem
            {
                type = "folder",
                name = name,
                path = newFolder
            });
            return newFolder;
        }

        [HttpPost]
        public ActionResult SaveBase64Image(string imgData, string imgType)
        {
            if (string.IsNullOrEmpty(imgData))
                return Json(false, JsonRequestBehavior.AllowGet);

            var path = FileComponent.DateFolder("/media/upload", null) + "/" + StringComponent.Guid(10);
            var ext = imgData.Substring(11, imgData.IndexOf(";", StringComparison.CurrentCulture));
            var data = imgData.Substring(imgData.IndexOf("base64,", StringComparison.CurrentCulture) + 7);
            byte[] bytes = Convert.FromBase64String(data);
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
            var fp = FileComponent.GetFullPath(path);

            using (MemoryStream ms = new MemoryStream(bytes))
            {
                using (var img = Image.FromStream(ms))
                {
                    img.Save(fp);
                }
            }
            return Json(path, JsonRequestBehavior.AllowGet);
        }

    }
}