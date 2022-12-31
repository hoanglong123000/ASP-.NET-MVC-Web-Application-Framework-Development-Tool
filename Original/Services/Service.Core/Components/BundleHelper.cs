using Service.Utility.Variables;
using System.Collections.Generic;
using System.Text;
using System.Web.Mvc;

namespace Service.Core.Components
{
    public enum BundleType
    {
        Web,
        Web2,
        Wap,
        Backend2,
        Core,
        MediaManage,
        Tree,
        Summernote,
        SummernoteMedia,
        MediaSelector,
        Tag,
        Tags,
        Amcharts,
        Number,
        TableHierachy,
        DatePicker,
        Validate,
        Signature,
        BootstrapValidate,
        Select2,
        BootstrapSelect,
        FontBloggerSan,
        Lightgallery,
        Comment,
        Slider,
        Stepy,
        Pdf,
        Swiper,
        Countdowntimer,
        StarRating,
        OwlCarousel,
        AnyTime,
        CompoTree,
        JqueryUi,
        Fancytree,
        Cropper,
        Kpi,
        AnimateNumber,
        FontOpenSans
    }
    public static class BundleHelper
    {
        public static MvcHtmlString Generate(List<BundleType> types)
        {
            var str = new StringBuilder();
            foreach (var t in types)
            {
                switch (t)
                {
                    case BundleType.JqueryUi:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                StaticFileVersioned("/jqueryui/jqueryui.js"));
                        }
                        break;
                    case BundleType.Web:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                    StaticFileVersioned("/web/web.js"))
                                .AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                    StaticFileVersioned("/web/web.css"));
                        }
                        break;
                    case BundleType.Web2:
                    {
                        str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                StaticFileVersioned("/web-2.0/web-2.0.js"))
                            .AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                StaticFileVersioned("/web-2.0/web-2.0.css"));
                    }
                        break;
                    case BundleType.FontOpenSans:
                    {
                        str.AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                            StaticFileVersioned("/font-opensans/font-opensans.css"));
                    }
                        break;
                    case BundleType.Wap:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                    StaticFileVersioned("/wap/wap.js"))
                                .AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                    StaticFileVersioned("/wap/wap.css"));
                        }
                        break;
                    case BundleType.Backend2:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                    StaticFileVersioned("/backend2/backend2.js"))
                                .AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                    StaticFileVersioned("/backend2/backend2.css"));
                        }
                        break;
                    case BundleType.Kpi:
                    {
                        str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                StaticFileVersioned("/kpi/kpi.js"))
                            .AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                StaticFileVersioned("/kpi/kpi.css"));
                    }
                        break;
                    case BundleType.Core:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                    StaticFileVersioned("/core/core.js"))
                                .AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                    StaticFileVersioned("/core/core.css"));
                        }
                        break;
                    case BundleType.MediaManage:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                StaticFileVersioned("/media-manage/media-manage.js"))
                                .AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                StaticFileVersioned("/media-manage/media-manage.css"));
                        }
                        break;
                    case BundleType.FontBloggerSan:
                        {
                            str.AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                    StaticFileVersioned("/font-blogger-sans/font-blogger-sans.css"));
                        }
                        break;
                    case BundleType.Tree:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                    StaticFileVersioned("/webaby-tree/webaby-tree.js"))
                                .AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                    StaticFileVersioned("/webaby-tree/webaby-tree.css"));
                        }
                        break;
                    case BundleType.Fancytree:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                StaticFileVersioned("/fancytree/fancytree.js"));
                        }
                        break;
                    case BundleType.Signature:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                StaticFileVersioned("/signature/signature.js"));
                        }
                        break;
                    case BundleType.Amcharts:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                StaticFileVersioned("/amcharts/amcharts.js"));
                        }
                        break;
                    case BundleType.CompoTree:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                StaticFileVersioned("/compo-tree/compo-tree.js"));
                        }
                        break;
                    case BundleType.AnimateNumber:
                    {
                        str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                            StaticFileVersioned("/animate-number/animate-number.js"));
                    }
                        break;
                    case BundleType.DatePicker:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                    StaticFileVersioned("/datetime-picker/datetime-picker.js"))
                                .AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                    StaticFileVersioned("/datetime-picker/datetime-picker.css"));
                        }
                        break;
                    case BundleType.AnyTime:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                    StaticFileVersioned("/anytime/anytime.js"));
                        }
                        break;
                    case BundleType.Number:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                StaticFileVersioned("/number/number.js"));
                        }
                        break;
                    case BundleType.Slider:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                StaticFileVersioned("/slider/slider.js"));
                        }
                        break;
                    case BundleType.Countdowntimer:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                StaticFileVersioned("/countdowntimer/countdowntimer.js"));
                        }
                        break;
                    case BundleType.Cropper:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                StaticFileVersioned("/cropper/cropper.js"));
                        }
                        break;
                    case BundleType.Summernote:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                    StaticFileVersioned("/summernote/summernote.js"))
                                .AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                    StaticFileVersioned("/summernote/summernote.css"));
                        }
                        break;
                    case BundleType.StarRating:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                    StaticFileVersioned("/star-rating/star-rating.js"))
                                .AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                    StaticFileVersioned("/star-rating/star-rating.css"));
                        }
                        break;
                    case BundleType.SummernoteMedia:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                    StaticFileVersioned("/summernote-media/summernote-media.js"))
                                .AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                    StaticFileVersioned("/summernote-media/summernote-media.css"));
                        }
                        break;
                    case BundleType.Tag:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                    StaticFileVersioned("/tag-selecter/tag-selecter.js"))
                                .AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                    StaticFileVersioned("/tag-selecter/tag-selecter.css"));
                        }
                        break;
                    case BundleType.Tags:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                StaticFileVersioned("/tags/tags.js"));
                        }
                        break;
                    case BundleType.TableHierachy:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                    StaticFileVersioned("/table-hierachy/table-hierachy.js"))
                                .AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                    StaticFileVersioned("/table-hierachy/table-hierachy.css"));
                        }
                        break;
                    case BundleType.Validate:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                StaticFileVersioned("/validate/validate.js"));
                        }
                        break;
                    case BundleType.BootstrapValidate:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                StaticFileVersioned("/bootstrapValidator/bootstrapValidator.js"));
                        }
                        break;
                    case BundleType.Select2:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                StaticFileVersioned("/select2/select2.js"))
                                .AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                StaticFileVersioned("/select2/select2.css"));
                        }
                        break;
                    case BundleType.BootstrapSelect:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                StaticFileVersioned("/bootstrapselect/bootstrapselect.js"));
                        }
                        break;
                    case BundleType.Lightgallery:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                StaticFileVersioned("/lightgallery/lightgallery.js"))
                                .AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                StaticFileVersioned("/lightgallery/lightgallery.css"));
                        }
                        break;
                    case BundleType.OwlCarousel:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                    StaticFileVersioned("/owlcarousel/owlcarousel.js"))
                                .AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                    StaticFileVersioned("/owlcarousel/owlcarousel.css"));
                        }
                        break;
                    case BundleType.Comment:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                    StaticFileVersioned("/comment/comment.js"))
                                .AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                    StaticFileVersioned("/comment/comment.css"));
                        }
                        break;
                    case BundleType.Stepy:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                StaticFileVersioned("/stepy/stepy.js"));
                        }
                        break;
                    case BundleType.Pdf:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                    StaticFileVersioned("/pdf/pdf.js"))
                                .AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                    StaticFileVersioned("/pdf/pdf.css"));
                        }
                        break;
                    case BundleType.Swiper:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                    StaticFileVersioned("/swiper/swiper.js"))
                                .AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                    StaticFileVersioned("/swiper/swiper.css"));
                        }
                        break;
                    case BundleType.MediaSelector:
                        {
                            str.AppendFormat("<script src=\"{0}\" type=\"text/javascript\"></script>",
                                    StaticFileVersioned("/media-selector/media-selector.js"))
                                .AppendFormat("<link rel=\"stylesheet\" href=\"{0}\" />",
                                    StaticFileVersioned("/media-selector/media-selector.css"));
                        }
                        break;
                }
            }
            return new MvcHtmlString(str.ToString());
        }

        public static string StaticFileVersioned(string url)
        {
            url = "/assets/release" + url;
            return $"{url}?v={ConstantVariables.BundleVersion}";
        }
    }
}
