

$(document).ready(function () {
    switch (tab) {
        case 'ThongTinCaNhan':
            {
                initEmployeeForm1(id);
            }
            break;
        case 'QuanHeGiaDinh':
            {
                initEmployeeForm2(id); // thong tin gia dinh
            }
            break;
        case 'ThongTinDaoTao':
            {
                initEmployeeForm3(id); // thong tin dao tao
            }
            break;
        case 'KinhNghiemLamViec':
            {

                initEmployeeForm4(id); // qua trinh cong tac truoc khi vao ricons
            }
            break;
        case 'QuaTrinhCongTac':
            {
                initEmployeeForm5(id); // qua trinh cong tac tai ricons 
            }
            break;
        case 'QuaTrinhNangBac':
            {
                initEmployeeForm6(id);// qua trinh nang bac
            }
            break;
        case 'TinhTrangVanBang':
            {
                initEmployeeForm7(id);// qua trinh nang bac
            }
            break;
        case 'LichSuDiemGoc':
            {
                initEmployeeForm8(id);// lịch sử thay đổi điểm gốc
            }
            break;
    }
    
   
    
    
    
});

document.addEventListener('DOMContentLoaded', function () {


    //// Resize sidebar on scroll
    //// ------------------------------

    //// Resize detached sidebar vertically when bottom reached
    //function resizeDetached() {
    //    $(window).on('load scroll', function () {
    //        if ($(window).scrollTop() > $(document).height() - $(window).height() - 40) {
    //            $('.sidebar-detached').addClass('fixed-sidebar-space');
    //        }
    //        else {
    //            $('.sidebar-detached').removeClass('fixed-sidebar-space');
    //        }
    //    });
    //}


    //// Affix detached sidebar
    //// ------------------------------

    //// Init nicescroll when sidebar affixed
    //$('.sidebar-detached').on('affix.bs.affix', function () {
    //    resizeDetached();
    //});

    //// Attach BS affix component to the sidebar
    //$('.sidebar-detached').affix({
    //    offset: {
    //        top: $('.sidebar-detached').offset().top - 20 // top offset - computed line height
    //    }
    //});


    // Remove affix and scrollbar on mobile
    //$(window).on('resize', function () {
    //    setTimeout(function () {
    //        if ($(window).width() <= 768) {

    //            // Remove affix on mobile
    //            $(window).off('.affix')
    //            $('.sidebar-detached').removeData('affix').removeClass('affix affix-top affix-bottom');
    //        }
    //    }, 100);
    //}).resize();

});