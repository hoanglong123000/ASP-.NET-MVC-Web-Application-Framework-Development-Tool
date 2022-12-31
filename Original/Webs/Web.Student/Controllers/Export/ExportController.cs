using System.IO;
using System.Web.Mvc;
using  Web.Student.Controllers.Base;
using  Web.Student.Models;
using NPOI.SS.UserModel;
using Service.Utility.Components;

namespace Web.Student.Controllers.Export
{
    public partial class ExportController : BaseController
    {
        public int _colIndex { get; set; }
        public int GetColIndex()
        {
            _colIndex += 1;
            return _colIndex;
        }
        public ExcelStyleModel CreateStyle(ExcelComponent excel, short fs = 12)
        {
            var st = new ExcelStyleModel();
            var ff = "Times New Roman";

            st.MainTitle = st.LeftNormal = excel.CreateStyle(new ExcelStyleOption()
            {
                Font = ff,
                FontSize = 20,
                IsBold = true,
                Valign = VerticalAlignment.Center,
                Halign = HorizontalAlignment.Center,
                Border = BorderStyle.Thin
            });

            st.LeftNormal = excel.CreateStyle(new ExcelStyleOption()
            {
                Font = ff,
                FontSize = fs,
                Valign = VerticalAlignment.Top,
                Border = BorderStyle.Thin
            });

            st.LeftNormalWrap = excel.CreateStyle(new ExcelStyleOption()
            {
                Font = ff,
                FontSize = fs,
                WrapText = true,
                Valign = VerticalAlignment.Top,
                Border = BorderStyle.Thin
            });
            st.CenterNormal = excel.CreateStyle(new ExcelStyleOption()
            {
                Font = ff,
                FontSize = fs,
                Halign = HorizontalAlignment.Center,
                Valign = VerticalAlignment.Top,
                Border = BorderStyle.Thin
            });

            st.RightNormal = excel.CreateStyle(new ExcelStyleOption()
            {
                Font = ff,
                FontSize = fs,
                Halign = HorizontalAlignment.Right,
                Valign = VerticalAlignment.Top,
                Border = BorderStyle.Thin
            });

            st.CenterBold = excel.CreateStyle(new ExcelStyleOption()
            {
                Font = ff,
                FontSize = fs,
                Halign = HorizontalAlignment.Center,
                IsBold = true,
                Valign = VerticalAlignment.Top
            });

            st.LeftBold = excel.CreateStyle(new ExcelStyleOption()
            {
                Font = ff,
                FontSize = fs,
                IsBold = true,
                Valign = VerticalAlignment.Top
            });

            st.PriceNormal = excel.CreateStyle(new ExcelStyleOption()
            {
                Font = ff,
                FontSize = fs,
                IsCurrency = true,
                Valign = VerticalAlignment.Top
            });
            st.PriceHighlight = excel.CreateStyle(new ExcelStyleOption()
            {
                Font = ff,
                FontSize = fs,
                IsCurrency = true,
                Valign = VerticalAlignment.Top,
                Background = new ExcelBackgroundOption()
                {
                    Red = 254,
                    Green = 245,
                    Blue = 0,
                    Index = IndexedColors.Yellow.Index
                }
            });
            st.PriceTotal = excel.CreateStyle(new ExcelStyleOption()
            {
                Font = ff,
                FontSize = fs,
                IsCurrency = true,
                IsBold = true,
                Valign = VerticalAlignment.Top,
                Background = new ExcelBackgroundOption()
                {
                    Red = 251,
                    Green = 233,
                    Blue = 231,
                    Index = IndexedColors.Pink.Index
                }
            });
            st.LeftTotal = excel.CreateStyle(new ExcelStyleOption()
            {
                Font = ff,
                FontSize = fs,
                IsBold = true,
                Valign = VerticalAlignment.Top,
                Background = new ExcelBackgroundOption()
                {
                    Red = 251,
                    Green = 233,
                    Blue = 231,
                    Index = IndexedColors.Pink.Index
                }
            });
            st.CenterTotal = excel.CreateStyle(new ExcelStyleOption()
            {
                Font = ff,
                FontSize = fs,
                IsBold = true,
                Valign = VerticalAlignment.Top,
                Halign = HorizontalAlignment.Center,
                Background = new ExcelBackgroundOption()
                {
                    Red = 251,
                    Green = 233,
                    Blue = 231,
                    Index = IndexedColors.Pink.Index
                }
            });

            st.LeftGroup = excel.CreateStyle(new ExcelStyleOption()
            {
                Font = ff,
                FontSize = fs,
                Valign = VerticalAlignment.Top,
                IsBold = true,
                Background = new ExcelBackgroundOption()
                {
                    Red = 255,
                    Green = 243,
                    Blue = 224,
                    Index = IndexedColors.LightYellow.Index
                }
            });

            st.PriceGroup = excel.CreateStyle(new ExcelStyleOption()
            {
                Font = ff,
                FontSize = fs,
                Valign = VerticalAlignment.Top,
                IsCurrency = true,
                IsBold = true,
                Background = new ExcelBackgroundOption()
                {
                    Red = 255,
                    Green = 243,
                    Blue = 224,
                    Index = IndexedColors.LightYellow.Index
                }
            });
            st.RightGroup = excel.CreateStyle(new ExcelStyleOption()
            {
                Font = ff,
                FontSize = fs,
                Valign = VerticalAlignment.Top,
                Halign = HorizontalAlignment.Right,
                IsBold = true,
                Background = new ExcelBackgroundOption()
                {
                    Red = 255,
                    Green = 243,
                    Blue = 224,
                    Index = IndexedColors.LightYellow.Index
                }
            });
            st.CenterGroup = excel.CreateStyle(new ExcelStyleOption()
            {
                Font = ff,
                FontSize = fs,
                Valign = VerticalAlignment.Top,
                Halign = HorizontalAlignment.Center,
                Background = new ExcelBackgroundOption()
                {
                    Red = 255,
                    Green = 243,
                    Blue = 224,
                    Index = IndexedColors.LightYellow.Index
                }
            });

            st.Header = excel.CreateStyle(new ExcelStyleOption()
            {
                Font = ff,
                FontSize = 11,
                Valign = VerticalAlignment.Center,
                Halign = HorizontalAlignment.Center,
                IsBold = true,
                WrapText = true,
                Border = BorderStyle.Thin
            });

            return st;
        }
        public ActionResult DownloadApp(string type)
        {
            var path = "/content/apps/HRMRicons." + type;
            return File(path, System.Net.Mime.MediaTypeNames.Application.Octet, Path.GetFileName(path));
        }
    }
}