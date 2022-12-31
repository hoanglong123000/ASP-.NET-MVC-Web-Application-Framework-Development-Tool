using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using DBServer.Entities;
using Service.Core.Executes.Base;
using Service.Utility.Variables;

namespace Service.Core.Components
{
    public class IdImgModel
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public int Media { get; set; }
        public string Name { get; set; }
        public string ThumbSize { get; set; }
        public int? ShopId { get; set; }
    }
    public static class StringComponent
    {
        private static readonly string[] _allowedChars = { "0123456789", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz" };
        private static readonly Random Ran = new Random();

        public static string ToAid(this int id, string code, int il = 7)
        {
            var z = il - (id + "").Length;
            for (var i = 0; i < z; i++)
            {
                code += '0';
            }
            return code + id;
        }
        public static string FormatPrice(this decimal? value, string unit = " VNĐ")
        {
            if (value.HasValue && value.Value > 0)
                return value.Value.ToString("#,###", CultureInfo.GetCultureInfo("vi-VN").NumberFormat) +  unit;
            return "0" + unit;
        }
        public static string FormatPrice(this decimal value, string unit = " VNĐ")
        {
            return value.ToString("#,###", CultureInfo.GetCultureInfo("vi-VN").NumberFormat) + unit;
        }
        public static string FormatDate(this DateTime? date, string format = "dd/MM/yyyy")
        {
            if (date.HasValue)
            {
                return date.Value.ToString(format);
            }
            return "";
        }
        public static string FormatTime(this TimeSpan? time, string format = @"hh\:mm")
        {
            if (time.HasValue)
            {
                return time.Value.ToString(format);
            }
            return "";
        }
        public static string FormatTime(this TimeSpan time, string format = @"hh\:mm")
        {
            return time.ToString(format);
        }
        public static string FormatDate(this DateTime date, string format = "dd/MM/yyyy")
        {
            return date.ToString(format);
        }
        public static string IdImage(IdImgModel model)
        {
            var p = "/media" + (model.Media > 0 ? model.Media + "" : "") + "/";

            p += model.Type + "/";
            var fname = model.Name.Contains(".jpg") ? model.Name : model.Name + ".jpg";
            if (model.Id >= 100)
            {
                var idname = model.Id + "";
                var i = 1;
                while (i < idname.Length - 1)
                {
                    p += idname.Substring(0, i) + "/";
                    i++;
                }
            }
            p += model.Id + "/" + fname;

            if (!string.IsNullOrEmpty(model.ThumbSize))
            {
                p += ".thumb/" + model.ThumbSize + ".jpg";
            }

            return p;
        }

        public static bool HasValue(this string str)
        {
            return !string.IsNullOrEmpty(str);
        }
        //Random
        public static string Guid(int? length, string cindexs = null)
        {
            var l = length ?? 10;
            var str = "";
            if (string.IsNullOrEmpty(cindexs))
            {
                cindexs = "0;1;2";
            }
            var arr = cindexs.Split(';').Select(Int32.Parse).ToList();
            foreach (int t in arr)
            {
                str += _allowedChars[t];
            }
            char[] chars = new char[l];
            int setLength = str.Length;

            for (int i = 0; i < l; ++i)
            {
                chars[i] = str[Ran.Next(setLength)];
            }

            return new string(chars, 0, l);
        }
        public static string NewLineToBr(this string str)
        {
            if (str.HasValue())
            {
                Regex regex = new Regex(@"(\r\n|\r|\n)+");
                return regex.Replace(str, "<br />");
            }

            return "";
        }
        public static string BrToNewLine(this string str)
        {
            if (str.HasValue())
            {
                return str.Replace("<br />", Environment.NewLine);
            }
            return "";
        }
        public static string GetQueryString(this object obj)
        {
            var properties = from p in obj.GetType().GetProperties()
                             where p.GetValue(obj, null) != null
                             select p.Name + "=" + HttpUtility.UrlEncode(p.GetValue(obj, null).ToString());

            return String.Join("&", properties.ToArray());
        }
        public static List<BaseJsonModel> ToBaseJsons(this string str)
        {
            if (str.Contains(';'))
            {
                var arr = str.Split('|');

                return (from obj in arr
                        where !String.IsNullOrEmpty(obj)
                        select obj.Split(';')
                    into t
                        select new BaseJsonModel
                        {
                            id = Int32.Parse(t[0]),
                            text = t[1]
                        }).ToList();
            }
            return new List<BaseJsonModel>();
        }

        public static string ToCode(this string str)
        {
            return str.Replace(".", "").NormalizeFileName();
        }
        public static string ToKeyword(this string str)
        {
            if (String.IsNullOrEmpty(str)) return String.Empty;
            var normalizeString = str.Normalize(NormalizationForm.FormD);
            return Regex.Replace(normalizeString, @"\p{Mn}", String.Empty).Replace("đ", "d").Replace("Đ", "D").ToLower().Replace(",", String.Empty).Replace("  ", " ");
        }
        public static String RemoveVnChars(this String value)
        {
            if (String.IsNullOrEmpty(value)) return String.Empty;
            var normalizeString = value.Normalize(NormalizationForm.FormD);
            return Regex.Replace(normalizeString, @"\p{Mn}", String.Empty).Replace("đ", "d").Replace("Đ", "D");
        }
        public static String NormalizeFileName(this String value)
        {
            return Regex.Replace(Regex.Replace(value.RemoveVnChars(), @"[^\w\.-]", "-"), @"-+", "-").ToLower();
        }
        public static string RemoveNewLine(this string str)
        {
            return str.Replace("\r", "").Replace("\n", "");
        }

        public static string RemoveSpecialChars(this string str)
        {
            return Regex.Replace(str, "[^a-zA-Z0-9_. ,]+", "", RegexOptions.Compiled);
        }

        public static string RemoveHeadExceptionChars(this string str)
        {
            while (str.Length > 0 && (str[0] == ' '
                                      || str[0] == '-'
                                      || str[0] == '–'
                                      || str[0] == '\n'
                                      || str[0] == '\t'))
            {
                str = str.Substring(1);
            }
            return str;
        }
        public static string RemoveTailExceptionChars(this string str)
        {
            while (str.Length > 0 && (str[str.Length - 1] == ' '
                                      || str[str.Length - 1] == '-'
                                      || str[str.Length - 1] == '–'
                                      || str[str.Length - 1] == '\t'
                                      || str[str.Length - 1] == '\n'))
            {
                str = str.Substring(0, str.Length - 1);
            }
            return str;
        }
        public static string Optimize(this string str)
        {
            if (str.Contains("&"))
            {
                str = HttpUtility.HtmlDecode(str);
                str = str.Replace(" ", "");
            }
            str = str.Replace("\t", " ").Replace("  ", " ");
            str = str.RemoveHeadExceptionChars();
            str = str.RemoveTailExceptionChars();
            return str;
        }
        public static string OptimizeKeyword(this string str)
        { 
            str = str.Replace("\t", " ").Replace("  ", " ");
            str = str.RemoveHeadExceptionChars();
            str = str.RemoveTailExceptionChars();
            if (str.Contains("'"))
            {
                str = str.Replace("'", "''");
            }
            return str;
        }
        public static String OnlyChars(this String value)
        {
            return Regex.Replace(value, "[^a-zA-Z]+", "", RegexOptions.Compiled);
        }
        public static string Thumb(string path, string type, string size)
        {
            string fp;
            if (string.IsNullOrEmpty(path))
            {
                if (size != null)
                {
                    fp = "/media/default/" + type + "/" + size + ".jpg";
                }
                else
                {
                    fp = "/media/default/" + type + "/xs.jpg";
                }
            }
            else
            {
                if (size != null)
                {
                    if (path.IndexOf(".", StringComparison.Ordinal) > 0)
                    {
                        var extension = path.Substring(path.IndexOf(".", StringComparison.Ordinal));
                        fp = path + ".thumb/" + size + extension;
                    }
                    else
                    {
                        fp = path;
                    }
                }
                else
                {
                    fp = path;
                }
            }
            return fp;
        }
        public static bool IsValidEmail(this string email)
        {
            const string emailRegex = @"^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$";
            var re = new Regex(emailRegex);
            return re.IsMatch(email);
        }
        public static string Sub(this string str, int length)
        {
            if (str == null)
            {
                str = "";
            }
            if (str.Length > length)
            {
                return str.Substring(0, length - 3) + "...";
            }
            return str;
        }
        public static string LoremIpsum(int minWordPerSentences, int maxWordPerSentences, int minSentences, int maxSentences, int numLines)
        {
            var words = new[] { "lorem", "ipsum", "dolor", "sit", "amet", "consectetuer", "adipiscing", "elit", "sed", "diam", "nonummy", "nibh", "euismod", "tincidunt", "ut", "laoreet", "dolore", "magna", "aliquam", "erat" };

            int numSentences = Ran.Next(maxSentences - minSentences)
                + minSentences;
            int numWords = Ran.Next(maxWordPerSentences - minWordPerSentences) + minWordPerSentences;

            var sb = new StringBuilder();
            for (int p = 0; p < numLines; p++)
            {
                for (int s = 0; s < numSentences; s++)
                {
                    for (int w = 0; w < numWords; w++)
                    {
                        if (w > 0) { sb.Append(" "); }
                        string word = words[Ran.Next(words.Length)];
                        if (w == 0) { word = word.Substring(0, 1).Trim().ToUpper() + word.Substring(1); }
                        sb.Append(word);
                    }
                    if (maxSentences > 1)
                    {
                        sb.Append(". ");
                    }
                }
                if (p < numLines - 1) sb.AppendLine();
            }
            return sb.ToString();
        }
        public static string D100Decrypt(this string str)
        {
            byte[] asciiBytes = Encoding.ASCII.GetBytes(str);
            var bstr = asciiBytes.Aggregate("", (current, c) => current + (c <= 90 ? '1' : '0'));
            int numOfBytes = bstr.Length / 8;
            var pass = "";
            for (int i = 0; i < numOfBytes; ++i)
            {
                pass += Convert.ToChar(Convert.ToByte(bstr.Substring(8 * i, 8), 2));
            }
            return pass.Substring(0, pass.Length / 2);
        }

        public static string OptimizeUri(this string str)
        {
            var br = new[] { "http://", "https://" };
            if (!br.Any(x => str.Contains(x)))
            {
                str = "http://" + str;
            }
            if (str[str.Length - 1] == '/')
            {
                str = str.Substring(0, str.Length - 1);
            }
            return str;
        }

        public static string GetValue(this List<AppSetting> list, string tab, string section)
        {
            var s = list.FirstOrDefault(x => x.Tab == tab && x.Section == section);
            if (s != null)
                return s.Value;
            return "";
        }

        public static TResult IfNotNull<TSource, TResult>(this TSource source, Expression<Func<TSource, TResult>> expression, TResult defaultValue)
        {
            var safeExp = Expression.Lambda<Func<TSource, TResult>>(
                NullSafeEvalWrapper(expression.Body, Expression.Constant(defaultValue)),
                expression.Parameters[0]);

            var safeDelegate = safeExp.Compile();
            return safeDelegate(source);
        }

        private static Expression NullSafeEvalWrapper(Expression expr, Expression defaultValue)
        {
            Expression obj;
            Expression safe = expr;

            while (!IsNullSafe(expr, out obj))
            {
                var isNull = Expression.Equal(obj, Expression.Constant(null));

                safe =
                    Expression.Condition
                    (
                        isNull,
                        defaultValue,
                        safe
                    );

                expr = obj;
            }
            return safe;
        }

        private static bool IsNullSafe(Expression expr, out Expression nullableObject)
        {
            nullableObject = null;

            if (expr is MemberExpression || expr is MethodCallExpression)
            {
                Expression obj;
                MemberExpression memberExpr = expr as MemberExpression;
                MethodCallExpression callExpr = expr as MethodCallExpression;

                if (memberExpr != null)
                {
                    // Static fields don't require an instance
                    FieldInfo field = memberExpr.Member as FieldInfo;
                    if (field != null && field.IsStatic)
                        return true;

                    // Static properties don't require an instance
                    PropertyInfo property = memberExpr.Member as PropertyInfo;
                    if (property != null)
                    {
                        MethodInfo getter = property.GetGetMethod();
                        if (getter != null && getter.IsStatic)
                            return true;
                    }
                    obj = memberExpr.Expression;
                }
                else
                {
                    // Static methods don't require an instance
                    if (callExpr.Method.IsStatic)
                        return true;

                    obj = callExpr.Object;
                }

                // Value types can't be null
                if (obj.Type.IsValueType)
                    return true;

                // Instance member access or instance method call is not safe
                nullableObject = obj;
                return false;
            }
            return true;
        }

        public static IEnumerable<DateTime> GetDateRange(DateTime startDate, DateTime endDate)
        {
            if (endDate < startDate)
                throw new ArgumentException("endDate must be greater than or equal to startDate");

            while (startDate <= endDate)
            {
                yield return startDate;
                startDate = startDate.AddDays(1);
            }
        }

        public static string Seniority(this DateTime startDate, string format)
        { 
            DateTime end = DateTime.Now;
            var diffMonths = (end.Month + end.Year * 12) - (startDate.Month + startDate.Year * 12);
            if (format == "y")
            {
                return ((float)Math.Round((double)diffMonths / 12, 1)) + "";
            }
            return diffMonths.ToString();
        }
        public static string Seniority(this DateTime? startDate, string format)
        {
            if (startDate.HasValue)
            {
                DateTime end = DateTime.Now;
                var diffMonths = (end.Month + end.Year * 12) - (startDate.Value.Month + startDate.Value.Year * 12);

                if (format == "y")
                {
                    return ((float)Math.Round((double)diffMonths / 12, 1)) + "";
                }

                return diffMonths.ToString();
            }

            return "";
        }

        public static string DefaultMedia(string root)
        {
            var a = Directory.GetParent(root) + "\\media\\";
            a = a.Replace("\\", "/");
            return a;
        }

        public static bool IsDateTime(this string txtDate)
        {
            DateTime tempDate;
            return DateTime.TryParse(txtDate, out tempDate);
        }

        public static IEnumerable<DateTime> DateRange(DateTime fromDate, DateTime toDate)
        {
            return Enumerable.Range(0, toDate.Subtract(fromDate).Days + 1)
                .Select(d => fromDate.AddDays(d));
        }

    }
}