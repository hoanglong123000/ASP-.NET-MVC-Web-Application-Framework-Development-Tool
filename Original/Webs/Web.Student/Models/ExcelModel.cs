using NPOI.SS.UserModel;

namespace Web.Student.Models
{
    public class ExcelStyleModel
    {
        public ICellStyle MainTitle { get; set; }
        public ICellStyle CenterNormal { get; set; }
        public ICellStyle LeftNormal { get; set; }
        public ICellStyle LeftNormalWrap { get; set; }
        public ICellStyle RightNormal { get; set; }
        public ICellStyle PriceNormal { get; set; }
        public ICellStyle PriceHighlight { get; set; }

        public ICellStyle CenterBold { get; set; }
        public ICellStyle LeftBold { get; set; }
        public ICellStyle CenterGroup { get; set; }
        public ICellStyle LeftGroup { get; set; }
        public ICellStyle RightGroup { get; set; }
        public ICellStyle PriceGroup { get; set; }

        public ICellStyle CenterTotal { get; set; }
        public ICellStyle LeftTotal { get; set; }
        public ICellStyle PriceTotal { get; set; }
        public ICellStyle Header { get; set; }
    }
}