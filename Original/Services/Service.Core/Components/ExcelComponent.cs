using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.SS.Util;
using NPOI.XSSF.UserModel;
using Service.Utility.Variables;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;

namespace Service.Core.Components
{
    public class ExcelBackgroundOption
    {
        public short Index { get; set; }
        public int Red { get; set; }
        public int Green { get; set; }
        public int Blue { get; set; }
    }
    public class ExcelStyleOption
    {
        public HorizontalAlignment? Halign { get; set; }
        public VerticalAlignment? Valign { get; set; }
        public BorderStyle? Border { get; set; }
        public string Font { get; set; }
        public short? FontColor { get; set; }
        public short? FontSize { get; set; }
        public bool IsBold { get; set; }
        public ExcelBackgroundOption Background { get; set; }
        public bool WrapText { get; set; }
    }
    public static class ExcelStaticComponent
    {
        public static void SetBorder(this ICellStyle style, BorderStyle b)
        {
            style.BorderTop = b;
            style.BorderBottom = b;
            style.BorderLeft = b;
            style.BorderRight = b;
        }

        public static void AddCell(this IRow row, int col, string value, ICellStyle style = null)
        {
            var c = row.CreateCell(col);

            if (style != null)
            {
                c.CellStyle = (HSSFCellStyle)style;
            }
            c.SetCellValue(value);
        }

        public static void EmptyCells(this IRow row, int start, int end, ICellStyle style = null)
        {
            for (int i = start; i <= end; i++)
            {
                var c = row.CreateCell(i);
                if (style != null)
                {
                    c.CellStyle = style;
                }
            }
        }


    }
    public class ExcelComponent
    {
        public HSSFWorkbook Hwb { get; set; }
        public XSSFWorkbook Xwb { get; set; }
        public ISheet Sheet { get; set; }
        public string Ext { get; set; }

        public ExcelComponent()
        {
            Hwb = new HSSFWorkbook();
            Xwb = new XSSFWorkbook();
            Sheet = Hwb.CreateSheet("Sheet1");
        }

        public ExcelComponent(string filePath)
        {
            if (File.Exists(filePath))
            {
                Ext = Path.GetExtension(filePath);
                if (!string.IsNullOrEmpty(Ext))
                {
                    Ext = Ext.ToLower();
                    if (Ext.ToLower() == ".xls")
                    {
                        using (FileStream file = new FileStream(filePath, FileMode.Open, FileAccess.Read))
                        {
                            Hwb = new HSSFWorkbook(file);
                        }

                        if (Hwb.NumberOfSheets > 0)
                        {
                            Sheet = Hwb.GetSheetAt(0);
                        }

                        Xwb = new XSSFWorkbook();
                    }
                    else //.xlsx extension
                    {
                        using (FileStream file = new FileStream(filePath, FileMode.Open, FileAccess.Read))
                        {
                            Xwb = new XSSFWorkbook(file);
                        }
                        if (Xwb.NumberOfSheets > 0)
                        {
                            Sheet = Xwb.GetSheetAt(0);
                        }
                        Hwb = new HSSFWorkbook();
                    }
                }
            }
        }

        public List<SelectValue> GetSheets()
        {
            var sheets = new List<SelectValue>();
            if (Ext == ".xls")
            {
                for (int i = 0; i < Hwb.NumberOfSheets; i++)
                {
                    var s = Hwb.GetSheetAt(i);
                    sheets.Add(new SelectValue()
                    {
                        Id = i,
                        Text = s.SheetName
                    });
                }
            }
            else
            {
                for (int i = 0; i < Xwb.NumberOfSheets; i++)
                {
                    var s = Xwb.GetSheetAt(i);
                    sheets.Add(new SelectValue()
                    {
                        Id = i,
                        Text = s.SheetName
                    });
                }
            }
            return sheets;
        }

        public void SetActiveSheet(int index)
        {
            Sheet = Ext == ".xls" ? Hwb.GetSheetAt(index) : Xwb.GetSheetAt(index);
        }

        public ICellStyle SetFont(ICellStyle style, string fontName, short fontHeightInPoints, bool isBold)
        {
            HSSFFont f = Ext == ".xls" ? (HSSFFont)Hwb.CreateFont() : (HSSFFont)Xwb.CreateFont();
            f.FontHeightInPoints = fontHeightInPoints;
            f.FontName = fontName;
            f.IsBold = isBold;
            style.SetFont(f);
            return style;
        }

        public IRow AddRow(int index)
        {
            var r = Sheet.CreateRow(index);
            return r;
        }

        public ICellStyle SetBackground(ICellStyle style, short index, int red, int green, int blue)
        {
            HSSFPalette p = Hwb.GetCustomPalette();
            p.SetColorAtIndex(index, (byte)red, (byte)green, (byte)blue);
            style.FillForegroundColor = index;
            style.FillPattern = FillPattern.SolidForeground;
            return style;
        }

        public ICellStyle CreateStyle(ExcelStyleOption option)
        {
            var style = Hwb.CreateCellStyle();
            if (option.Halign.HasValue)
            {
                style.Alignment = option.Halign.Value;
            }

            if (option.Valign.HasValue)
            {
                style.VerticalAlignment = option.Valign.Value;
            }

            if (option.Border.HasValue)
            {
                style.BorderTop = option.Border.Value;
                style.BorderBottom = option.Border.Value;
                style.BorderLeft = option.Border.Value;
                style.BorderRight = option.Border.Value;
            }

            if (option.Background != null)
            {
                HSSFPalette p = Hwb.GetCustomPalette();
                p.SetColorAtIndex(option.Background.Index, (byte)option.Background.Red, (byte)option.Background.Green, (byte)option.Background.Blue);

                style.FillForegroundColor = option.Background.Index;
                style.FillPattern = FillPattern.SolidForeground;
            }

            HSSFFont f = (HSSFFont)Hwb.CreateFont();
            if (!string.IsNullOrEmpty(option.Font))
            {
                f.FontName = option.Font;
            }

            if (option.FontSize.HasValue)
            {
                f.FontHeightInPoints = option.FontSize.Value;
            }

            if (option.FontColor.HasValue)
            {
                f.Color = option.FontColor.Value;
            }
            
            f.IsBold = option.IsBold;
            style.SetFont(f);

            return style;
        }

        public List<string> GetColumns(int index)
        {
            IRow headerRow = Sheet.GetRow(index - 1);
            var lst = new List<string>();
            int colCount = headerRow.LastCellNum;
            for (int c = 0; c < colCount; c++)
            {
                lst.Add(headerRow.GetCell(c).ToString());
            }

            return lst;
        }

        public List<object> GetDataRows(int headIndex, int? cols)
        {
            DataTable dt = new DataTable();
            //IRow headerRow = Sheet.GetRow(0);
            //int colCount = headerRow.LastCellNum;
            int rowCount = Sheet.LastRowNum + 1;

            List<object> lst = new List<object>();

            for (int i = 0; i < rowCount; i++)
            {
                if (i != headIndex - 1)
                {
                    var row = Sheet.GetRow(i);
                    if (row != null)
                    {
                        var obj = new List<string>();
                        // write row value
                        var cc = cols.HasValue ? cols.Value : row.Cells.Count;
                        for (int j = 0; j < cc; j++)
                        {
                            var cell = row.GetCell(j);
                            if (j == 23)
                            {
                                var x = j;
                            }
                            if (cell != null)
                            {

                                switch (cell.CellType)
                                {
                                    case CellType.Numeric:
                                        {
                                            if (DateUtil.IsCellDateFormatted(cell))
                                            {
                                                if (cell.DateCellValue.Year > 1930 && cell.DateCellValue.Year <= 2030)
                                                {
                                                    obj.Add(cell.DateCellValue.ToString());
                                                }
                                                else
                                                {
                                                    obj.Add(cell.NumericCellValue.ToString(CultureInfo.InvariantCulture));
                                                }
                                            }
                                            else
                                            {
                                                obj.Add(cell.NumericCellValue.ToString(CultureInfo.InvariantCulture));
                                            }

                                        }
                                        break;
                                    case CellType.String:
                                        {
                                            obj.Add(cell.StringCellValue);
                                        }
                                        break;
                                    case CellType.Formula:
                                        {
                                            obj.Add(cell.NumericCellValue.ToString(CultureInfo.InvariantCulture));
                                        }
                                        break;
                                    default:
                                        {
                                            obj.Add("NULL");
                                        }
                                        break;
                                }
                            }
                            else
                            {
                                obj.Add("NULL");
                            }
                        }
                        lst.Add(obj);
                    }
                    
                }
            }

            return lst;
        }

        public void CreateDropDownListForExcel(IList<string> dropDownValues, int startRow, int lastRow, int column)
        {
            string dropDownName = Sheet.SheetName + "DropDownValuesForColumn" + column;
            ISheet hiddenSheet = Hwb.CreateSheet(dropDownName);
            for (int i = 0, length = dropDownValues.Count; i < length; i++)
            {
                string name = dropDownValues[i];
                IRow row = hiddenSheet.CreateRow(i);
                ICell cell = row.CreateCell(0);
                cell.SetCellValue(name);
            }
            IName namedCell = Hwb.CreateName();
            namedCell.NameName = dropDownName;
            namedCell.RefersToFormula = (dropDownName + "!$A$1:$A$" + Int16.MaxValue);
            DVConstraint constraint = DVConstraint.CreateFormulaListConstraint(dropDownName);
            CellRangeAddressList addressList = new CellRangeAddressList(startRow, lastRow, column, column);
            HSSFDataValidation validation = new HSSFDataValidation(addressList, constraint);
            int hiddenSheetIndex = Hwb.GetSheetIndex(hiddenSheet);
            Hwb.SetSheetHidden(hiddenSheetIndex, SheetState.Hidden);
            Sheet.AddValidationData(validation);
        }

        public void Dispose()
        {
            Hwb = null;
            Xwb = null;
            Sheet = null;
        }
        //public void Export(string fileName, HttpResponseBase response)
        //{
        //    using (XLWorkbook wb = new XLWorkbook())
        //    {
        //        Workbook.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        //        Workbook.Style.Font.Bold = true;

        //        response.Clear();
        //        response.Buffer = true;
        //        response.Charset = "";
        //        response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        //        response.AddHeader("content-disposition", "attachment;filename="+ fileName + ".xlsx");
        //        using (MemoryStream mm = new MemoryStream())
        //        {
        //            Workbook.SaveAs(mm);
        //            mm.WriteTo(response.OutputStream);
        //            response.Flush();
        //            response.End();
        //        }
        //    }
        //}

        //public void SaveAs(string path)
        //{
        //    Workbook.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        //    Workbook.Style.Font.Bold = true;
        //    Workbook.SaveAs(path);
        //}
    }
}