// == top 용 스크립트 시작 ==

var gnbAction = (function() {
  var gnbMenu, myTimer, btnSearch, btnImg, searchBar, src, searchContent, indexNavMobile, _url, myPageButton,
      searchButton;

  function init() {
    gnbMenu = $('.gnb_menu');
    btnSearch = $('.header_button__search');
    btnImg = $('.ui_btn_image');
    searchBar = $('.header_search');
    searchContent = searchBar.find('input');
    src = btnImg.attr('src');
    indexNavMobile = $('.mov_nav_wrap');
    myPageButton = $('.header_button__mypage');
    searchButton = $('.search_activate');
    _url = location.href;
    eventBind(src);
  }

  function eventBind(src) {
    btnSearch.on({
      'click': function() {
        setTimeout(function() {
          // searchBar.find('input.gnb_search').focus();
          searchButton = $('.search_activate');
        }, 100);

        // todo as-is 삭제예정
        /*btnImg.attr('src', src);
        searchBar.stop().fadeToggle();
        searchBar.find('.gnb_search').focus();

        if (src.indexOf('ic_search') > 0) {
          src = cdnServicePath + 'assets/images/zipdoc_v35/common/btn_close.png';
          return;
        }

        src = cdnServicePath + 'assets/images/zipdoc_v35/common/ic_search@2x.png';*/
      }
    });

    searchButton.on({
      'click': function() {
        aceCounterEvent('pc_gnb_search_click', {isRenewalMain: window.location.pathname === '/index-b' || window.location.pathname === '/'}, (window.location.origin.slice(-1) !== '/' ? window.location.origin + '/' : window.location.origin) + 'pcGnbSearchClick');
      }
    });

    gnbMenu.find('li').each(function() {
      $(this).on('mouseenter focusin', function() {
        $(this).addClass('open').siblings().removeClass('open');
        clearTimeout(myTimer);
      });

      $(this).on('mouseleave focusout', function() {
        var self = $(this);
        myTimer = setTimeout(function() {
          self.removeClass('open');
        }, 300);

      });
    });

    // mypage 버튼 (pc)
    myPageButton.on('mouseenter focusin', function() {
      $(this).closest('li').addClass('open');
    });
    myPageButton.closest('li').on('mouseleave focusout', function() {
      $(this).removeClass('open');
    });

  }

  function searchBarOpen() {
    if (searchContent.val() !== '') {
      src = 'assets/images/zipdoc_v35/common/ic_search.png';
      searchBar.stop().show();
      btnImg.attr('src', src);
    }
  }

  return {
    init: init,
    searchBarOpen: searchBarOpen
  };
})();

// == top 용 스크립트 끝 ==

// == side_navi 용 스크립트 시작
var sideNavControl = (function() {
  var btn, sidePanel, closeBtn, dimm, gnbHeader;

  function init() {
    btn = $('.ui_mov_side_btn');
    gnbHeader = document.querySelector('.gnb_area');
    closeBtn = $('#sidepanel_close');
    sidePanel = $('#sidepanel');
    dimm = $('._dimm');
    eventBind();
  }

  function eventBind() {
    btn.on({
      click: function() {
        // 사이드 메뉴 펼쳐짐에 따라 앱에서 채널톡 hide 처리
        if (ZWS_APP_USER.isAppUser()) {
          webViewBridgeMixin.methods.callChannelTalk(ZWS_APP_USER.deviceInfo(), 'hide')
        }
        call_dimm.init();
        sideNavAnimateOpen();
        btn.attr('aria-current', true); // mobile footer navigation
        if (gnbHeader) {
          gnbHeader.style.zIndex = 500;
        }
      }
    });

    closeBtn.on({
      click: function() {
        hide_dimm.init();
        // gnbArea.btn.removeAttr('aria-current');
      }
    });
  }

  function sideNavAnimateClose() {
    if (sidePanel) {
      if (sidePanel.css('display') !== 'none') {
        sidePanel.stop().animate({left: '-280px'}, 300, function() {
          sidePanel.hide();
        });
      }
    }
  }

  function sideNavAnimateOpen() {
    if (sidePanel) {
      sidePanel.stop().show().animate({left: 0}, 300);
    } else {
      zlog.log("sidePanel not found");
    }
  }

  return {
    init: init,
    sideNavAnimateClose: sideNavAnimateClose,
  };
})();

/** sidemenu btn control
 *************************** **/
var _sng_menu_open_chk = false;
$('.sng_title > a').on('click', function(e) {
  e.preventDefault();
  // d: path("M9 14h10M14 9v10");
  // d: path("M9 14h10");
  var titleSvg = $(this).find('.side-sub-path');
  $('.side-sub-path').attr('d', 'M9 14h10M14 9v10');
  if (_sng_menu_open_chk == false) {
    $('.sng_title > a').removeClass('on');
    $(this).parents('.sng_title').next('.sng_menu').slideDown('fast');
    _sng_menu_open_chk = true;
    $(this).addClass('on');
    titleSvg.attr('d', 'M9 14h10');
  } else {
    if ($(this).parents('.sng_title').next('.sng_menu').css('display') !== 'none') {
      $('.sng_menu').slideUp('fast');
      _sng_menu_open_chk = false;
      $(this).removeClass('on');
      titleSvg.attr('d', 'M9 14h10M14 9v10');
    } else {
      $('.sng_title > a').removeClass('on');
      $('.sng_menu').slideUp('fast');
      $(this).parents('.sng_title').next('.sng_menu').slideDown('fast');
      _sng_menu_open_chk = true;
      $(this).addClass('on');
      titleSvg.attr('d', 'M9 14h10');
    }
  }

});

var commonDimm = (function() {
  var dimm, activeOnClickEvent;

  function init(callbackOption) {
    activeOnClickEvent = false;
    dimm = $('._dimm');
    events(callbackOption);

    return this;
  }

  function show(callback) {
    dimm.show();
    dimm.animate({'opacity': '0.8'}, 300);

    if (callback && callback instanceof Function) {
      callback();
    }
  }

  function hide(callback) {
    dimm.stop().animate({'opacity': 0}, 300, function() {
      dimm.hide();
    });

    sideNavControl.sideNavAnimateClose();

    if (callback && callback instanceof Function) {
      callback();
    }
  }

  function events(callbackOption) {
    if (!activeOnClickEvent) {
      dimm.on({
        click: function() {
          if (callbackOption && callbackOption.hide) {
            hide(callbackOption.hide);
            return;
          }

          hide();
        }
      });

      activeOnClickEvent = true;
    }

    if (callbackOption && callbackOption.show) {
      show(callbackOption.show);
      return;
    }

    show();
  }

  return {
    init: init,
    show: show,
    hide: hide
  };
}());

function checkWindowLocationPathName() {
  var pathName = window.location.pathname;
  return pathName === '/estimate'   // 견적 계산기
      || pathName === '/est-e/simple' // 견적 신청 e타입
      || pathName === '/product/detail/index/page' // 시공 사례 상세
      || pathName === '/product/resident/items' // 공간 아이디어
      || pathName === '/partner/detail/index/page' // 시공 전문가 상세
      || pathName.includes('/postscript/')  // 고객 후기 상세
      || pathName === '/myInterior/updateMyInfo'  // 마이페이지 정보수정
      || pathName === '/story/detail'  // 인테리어 팁 상세
      || pathName === '/benefit/eventDetail'  // 이벤트 상세
}

var call_dimm = (function() {
  var dimm;

  function init() {
    // 탑 헤더 메뉴 펼쳐짐에 따라 앱에서 채널톡 hide 처리
    if (ZWS_APP_USER.isAppUser()) {
      webViewBridgeMixin.methods.callChannelTalk(ZWS_APP_USER.deviceInfo(), 'hide')
    } else {
      window.ChannelIO('hideChannelButton');
    }
    dimm = $('._dimm');
    events();
  }

  function events() {
    modalopen();
    dimm.show();
    dimm.animate({'opacity': '0.8'}, 300);
    dimm.on({
      click: function() {
        hide_dimm.init();
      }
    });
  }

  return {
    init: init
  };
})();

var hide_dimm = (function() {
  var dimm, layer, gnbHeader, btn;

  function init() {
    dimm = $('._dimm');
    gnbHeader = document.querySelector('.gnb_area');
    layer = $('._layer');
    btn = $('.ui_mov_side_btn');
    events();
  }

  function events() {
    // 헤더 메뉴 닫기 처리
    if ($(".m_header_button__title").attr("aria-expanded") === 'true') {
      $(".m_header_button__title").attr("aria-expanded", false);
      $("#mDepthMenu").slideUp(300)
    }

    var homeModalStatus = getSessionStorage('homeModal');

    // 사이드 메뉴 닫침에 따라 채널톡 show/hide 처리
    if ( ZWS_APP_USER.isAppUser() && !checkWindowLocationPathName()) {
      // 메인 홈 화면 바텀 시트 상태값에 따라 채널톡 show/hide 처리
      if (homeModalStatus && homeModalStatus.showNavbar && homeModalStatus.isOpen) {
        webViewBridgeMixin.methods.callChannelTalk(ZWS_APP_USER.deviceInfo(), 'hide');
      } else {
        webViewBridgeMixin.methods.callChannelTalk(ZWS_APP_USER.deviceInfo(), 'show');
      }
    } else if( !ZWS_APP_USER.isAppUser() && !checkWindowLocationPathName()){
      // 메인 홈 화면 바텀 시트 상태값에 따라 채널톡 show/hide 처리
      if (homeModalStatus && homeModalStatus.showNavbar && homeModalStatus.isOpen) {
        window.ChannelIO('hideChannelButton');
      } else {
        window.ChannelIO('showChannelButton');
      }
    }

    dimm.stop().animate({'opacity': 0}, 300, function() {
      btn.attr('aria-current', false);

      if (gnbHeader) {
        gnbHeader.style.removeProperty('z-index');
      }

      dimm.hide();
      dimm.css('opacity', '');
    });
    sideNavControl.sideNavAnimateClose();
    layer.hide();
    modalclose();
  }

  return {
    init: init
  };
})();

// == mobile search 용 스크립트 시작
var mSearchControl = (function() {
  var btn, searchEl, closeBtn, dimm, input, delBtn;

  function init() {
    btn = $('.ui_mov_search_btn');
    closeBtn = $('.btn_search_close');
    searchEl = $('#mobile_favorite_keyword');
    dimm = $('._dimm');
    input = $('#mobileSearchValue');
    delBtn = $('#mobileSearchValDelBtn');
    eventBind();
  }

  function eventBind() {
    btn.on({
      click: function() {
        call_search_dimm.init();
        mSearchAnimateOpen();
        aceCounterEvent('mobile_gnb_search_click', {isRenewalMain: window.location.pathname === '/index-b' || window.location.pathname === '/'}, (window.location.origin.slice(-1) !== '/' ? window.location.origin + '/' : window.location.origin) + 'mobileGnbSearchClick');
      }
    });

    closeBtn.on({
      click: function() {
        hide_search_dimm.init();
      }
    });
  }

  function mSearchAnimateClose() {
    if (searchEl) {
      if (searchEl.css('display') !== 'none') {
        searchEl.slideUp('fast');
        input.val('');
        delBtn.hide();
      }
    }
  }

  function mSearchAnimateOpen() {
    if (searchEl) {
      searchEl.slideDown('fast');
      input.focus();
    } else {
      zlog.log("searchEl not found");
    }
  }

  return {
    init: init,
    mSearchAnimateClose: mSearchAnimateClose
  };
})();
var call_search_dimm = (function() {
  var dimm;

  function init() {
    // 탑 헤더 메뉴 펼쳐짐에 따라 앱에서 채널톡 hide 처리
    if (ZWS_APP_USER.isAppUser()) {
      webViewBridgeMixin.methods.callChannelTalk(ZWS_APP_USER.deviceInfo(), 'hide')
    }
    dimm = $('._dimm');
    events();
  }

  function events() {
    modalopen();
    dimm.show();
    dimm.animate({'opacity': '0.8'}, 300);
    dimm.on({
      click: function() {
        hide_search_dimm.init();
      }
    });
  }

  return {
    init: init
  };
})();

var hide_search_dimm = (function() {
  var dimm, layer;

  function init() {
    dimm = $('._dimm');
    layer = $('._layer');
    events();
  }

  function events() {
    // 헤더 메뉴 닫기 처리
    if($(".m_header_button__title").attr("aria-expanded") === 'true'){
      $(".m_header_button__title").attr("aria-expanded", false);
      $("#mDepthMenu").slideUp(300)
    }

    // 사이드 메뉴 닫침에 따라 앱에서 채널톡 show 처리
    if (ZWS_APP_USER.isAppUser() && !checkWindowLocationPathName()) {
      var homeModalStatus = getSessionStorage('homeModal');
      if (homeModalStatus && homeModalStatus.showNavbar && homeModalStatus.isOpen) {
        webViewBridgeMixin.methods.callChannelTalk(ZWS_APP_USER.deviceInfo(), 'hide');
      } else {
        webViewBridgeMixin.methods.callChannelTalk(ZWS_APP_USER.deviceInfo(), 'show');
      }
    }

    dimm.stop().animate({'opacity': 0}, 300, function() {
      dimm.hide();
      dimm.css('opacity', '');
    });
    mSearchControl.mSearchAnimateClose();
    layer.hide();
    modalclose();
  }

  return {
    init: init
  };
})();

var mobileFakeSelect = (function() {
  var _btn, _selectBox, _target, _selectedOption, _selectedOptionValue;

  function init() {
    _btn = $('._sub_navigator_btn');
    _selectBox = $('._sub_navigator');
    _target = _btn.find('span');
    _selectedOption = _selectBox.find('option');
    _selectedOptionValue = $(_selectBox.find('option:selected')).text();
    eventBind();
  }

  function eventBind() {
    _target.text(_selectedOptionValue);
  }

  return {
    init: init
  };
})();

var gnbSticky = (function() {
  var _target, _subTarget, _toHide, _appBannerToggle, _appBannerToggleBtn, _progress, _product_wrap;
  var lastScrollTop = 0;
  var delta = 5;

  function init() {
    _target = $('.gnb_area');
    _subTarget = $('#app');
    _product_wrap = $('.product_list_wrap');

    if (checkMobile($(window).width())) {
      _toHide = $('.app_banner');
      _appBannerToggle = getCookie("notThisWeek") !== "Y";

      _appBannerToggleBtn = $('.app_banner_close');
      if ($('body').hasClass('_estimate_page')) {
        _progress = $('._progress_bar');
        _progress.show();
      } else {
        $('._progress_bar').hide();
      }
      if (_target.height() > 90) {
        _subTarget.css({
          'padding-top': _target.innerHeight() + 'px'
        });
      }
    }

    if (checkMobile()) {
      _appBannerToggleBtn.on({
        click: function() {
          closePopupNotThisWeek();
          _toHide.hide();
          _appBannerToggle = false;
          _target.removeAttr('style');
          _product_wrap.removeAttr('style');
        }
      });
    }
  }

  $(document.body).on('touchmove', scrollEvent); // for mobile
  $(window).on('scroll', scrollEvent);

  function scrollEvent() {
    var currentPathName = document.location.pathname;

    var st = $(window).scrollTop(); //scroll
    var htmlH = $(document).height();
    var htmlW = $(document).width();
    var innerH = $(window).innerHeight();
    var windowW = $(window).width();

    var floatBanner = $('.floating-banner'); // banner
    var foot = $('#footer'); // foot

    var gnb = $('.gnb_area'); // gnb
    var mobileTitleGnb = $('._m_detail_gnb'); // sub Gnb
    var shopSubGnb = $('.myzipdoc_menu.store_main'); // shop Gnb

    var isExistFloatingBanner = function() {
      return floatBanner.length > 0 && (floatBanner.css('display') === 'block' && !floatBanner.hasClass('out'));
    };

    var getFloatingBannerHeight = function() {
      return isExistFloatingBanner() ? floatBanner.innerHeight() : 0;
    };

    var isExistMobileTitleGnb = function() {
      return mobileTitleGnb.length > 0;
    };

    // HAEDER + BANNER = TOTAL HEIGHT
    var headerH = function() {
      var floatingBannerHeight = getFloatingBannerHeight();

      // MOBILE GNB
      if (checkMobile()) {
        // detailGnb
        if (isExistMobileTitleGnb()) {
          return floatingBannerHeight + mobileTitleGnb.innerHeight();
        }

        // gnb
        if (gnb.length > 0) {
          return floatingBannerHeight + gnb.innerHeight();
        }
      }

      // PC GNB
      if (gnb.length > 0) {
        return floatingBannerHeight + $('.small_gnb_wrap').innerHeight();
      }

      return 0;
    };

    var spaceFilter = document.querySelector('.m_space_filter_summary');

    // MOBILE & PC SCROLL
    if (checkMobile()) {
      // ------ 공통 -------//
      if (st <= headerH()) {
        // shop gnb
        shopSubGnb.addClass('top');
        shopSubGnb.removeAttr('style');

        if (_progress) {
          _progress.css({
            'position': 'absolute',
            'top': 'auto',
            'z-index': 500
          });
        }

      }

      // mobile gnb 동적 노출/미노출 처리
      if (st <= getFloatingBannerHeight()) {
        if (isExistMobileTitleGnb()) {
          mobileTitleGnb.css({
            top: 0
          });
        }

        gnb.addClass('top');
        gnb.removeClass('show');

        // 필터 있는 경우
        if (spaceFilter) {
          spaceFilter.classList.remove('fixed_up');
        }
      } else if (Math.abs(lastScrollTop - st) <= delta) {
        // 민감도 조정
        return;
      } else if (st > lastScrollTop) {
        // scrollDown
        if (st >= headerH()) {
          // DETAIL PAGE
          if (isExistMobileTitleGnb()) {
            mobileTitleGnb.css({
              top: -headerH()
            });
          }

          // content down
          gnb.css({
            'position': 'fixed',
            top: -gnb.height()
          });
          gnb.removeClass('top');
          gnb.removeClass('show');

          // 필터 있는 경우
          if (spaceFilter) {
            spaceFilter.classList.remove('fixed_up');
            spaceFilter.classList.add('fixed_down');
          }

        } else {

          gnb.removeClass('top');
          if (st + $(window).height() < htmlH) {
            // header down
            gnb.addClass('top');
          }
        }
      } else if (st < lastScrollTop) {
        // DETAIL PAGE
        if (isExistMobileTitleGnb()) {
          mobileTitleGnb.css({
            top: 0
          });
        }

        // scrollUp
        if (st >= headerH()) {
          // content up
          gnb.css({
            'position': 'fixed',
            top: 0
          });

          // 필터 있는 경우
          if (spaceFilter) {
            spaceFilter.classList.remove('fixed_down');
            spaceFilter.classList.add('fixed_up');
          }

        } else {
          // header up
        }
      }

      lastScrollTop = st;

    } else { // pc

      // -------- definition -------//
      var sideFilter = $('.side_filter_group');
      var contentFilter = $('.space_content_container');

      var _detail_view_receipt = $('.layout_sub_aside');
      var receiptInner = $('.layout_sub_aside .inner');
      var partnerInfo = $('.partner_intro_cont');

      // -------- scroll move -------//

      // -------- scroll top -------//
      if (st <= headerH()) {
        $('.small_gnb_wrap.pc_top').removeClass('noshow');

        // remove scroll
        $('#app').removeAttr('style');

        gnb.addClass('gnb_top');
        gnb.removeAttr('style');
      } else {
        // top gnb - 로그인, 회원가입, 고객센터...
        $('.small_gnb_wrap.pc_top').addClass('noshow');

        // gnb
        gnb.removeClass('gnb_top');
        gnb.css({
          top: '0'
        });
      }
    }
  }

  return {
    init: init,
    scrollEvent: scrollEvent
  };
})();
var didScroll;
var floatingShowHide = (function() {
  var _scroll, el2, el3, el4, el5, el6, lastScrollTop, delta, bottombarHeight, _st;

  function init() {
    el2 = $('#estimateBtn');
    el3 = $('#detailEstimateBtn');
    el4 = $('#toastProductDetailMessage');
    el5 = $('#withdraw-toast');
    el6 = $('.partner_fixed_estimate');
    lastScrollTop = 0;
    delta = 5;
    bottombarHeight = el2.outerHeight();
    eventBind();
  }

  function eventBind() {
    $(window).on({
      scroll: function() {
        _scroll = $(window).scrollTop();
        didScroll = true;
      }
    });
    setInterval(function() {
      if (didScroll) {
        _hasScrolled();
        didScroll = false;
      }
    }, 100);

    function _hasScrolled() {
      var currentPathName = document.location.pathname;

      _st = $(this).scrollTop();
      if (Math.abs(lastScrollTop - _st) <= delta)
        return;
      if (!currentPathName.includes('/est/gate') && !currentPathName.includes('/est/simple')) {
        if (_st > lastScrollTop && _st > bottombarHeight) {
          //scrollDown
          el6.removeClass('nav_down').addClass('nav_up');
          el5.removeClass('nav_down').addClass('nav_up');
          el4.removeClass('nav_down').addClass('nav_up');
          el3.removeClass('nav_down').addClass('nav_up');
          el2.removeClass('nav_down').addClass('nav_up');
        } else {
          //scrollUp
          if (_st + $(window).height() < $(document).height()) {
            el6.removeClass('nav_up').addClass('nav_down');
            el5.removeClass('nav_up').addClass('nav_down');
            el4.removeClass('nav_up').addClass('nav_down');
            el3.removeClass('nav_up').addClass('nav_down');
            el2.removeClass('nav_up').addClass('nav_down');
          }
        }
      }

      lastScrollTop = _st;
    }
  }

  return {
    init: init
  };
})();

/* search scrap hover */
var scrapHoverEffect = (function() {
  var _btn, _src, _target;

  function init() {
    _btn = $('._btn_scrap_poz').children('a');
    _target = _btn.find('img');
    _src = _target.attr('src');
    eventBind();
  }

  function eventBind() {
    _btn.on({
      mouseover: function() {
        _src = cdnServicePath + 'assets/images/zipdoc_v35/common/btn_space_scrab_on@2x.png';
        _target.attr('src', _src);
      },
      mouseleave: function() {
        if (_btn.hasClass('on')) {
          return;
        }

        _src = cdnServicePath + 'assets/images/zipdoc_v35/common/btn_space_scrab@2x.png';
        _target.attr('src', _src);
      }
    });
  }

  return {
    init: init
  };
})();

/* detail scrap hover */
var detailScrapHoverEffect = (function() {
  function init() {
    $.each($('.ui_event_hover'), function(key, value) {
      var imgEl = $(this);
      imgEl.on({
        mouseover: function() {
          imgEl.attr('src', cdnServicePath + 'assets/images/zipdoc_v35/common/btn_scrab_on_2x.png');
        },
        mouseleave: function() {
          if (imgEl.hasClass('on')) {
            return;
          }

          imgEl.attr('src', cdnServicePath + 'assets/images/zipdoc_v35/common/btn_scrab@2x.png');
        }
      });
    });
    $.each($('.ui_event_hover_sub'), function() {
      var imgEl = $(this);
      imgEl.on({
        mouseover: function() {
          imgEl.attr('src', cdnServicePath + 'assets/images/zipdoc_v35/common/btn_scrab_sub_on@2x.png');
        },
        mouseleave: function() {
          if (imgEl.hasClass('on')) {
            return;
          }

          imgEl.attr('src', cdnServicePath + 'assets/images/zipdoc_v35/common/btn_scrab_sub@2x.png');
        }
      });
    });
  }

  return {
    init: init
  };
})();

/* detail share hover */
var detailShareHoverEffect = (function() {
  var _btn, _src, _target;

  function init() {
    _btn = $('.ui_event_hover_share');
    _target = _btn;
    _src = _target.attr('src');
    eventBind();
  }

  function eventBind() {
    _btn.on({
      mouseover: function() {
        _src = cdnServicePath + 'assets/images/zipdoc_v35/common/btn_share_on@2x.png';
        _target.attr('src', _src);
      },
      mouseleave: function() {
        _src = cdnServicePath + 'assets/images/zipdoc_v35/common/btn_share@2x.png';
        _target.attr('src', _src);

      }
    });
  }

  return {
    init: init
  };
})();

$(window).on("orientationchange", function() {
  if (window.orientation === 0) { // Portrait
    $('#_cover').removeClass('show');
    enable_scroll.init();
  } else { // Landscape
    $('#_cover').addClass('show');
    disable_scroll.init();
  }
});
// == side_navi 용 스크립트 끝

// == bottom 용 스크립트 시작
function onopen(param) {
  var url = "http://www.ftc.go.kr/info/bizinfo/communicationViewPopup.jsp?wrkr_no=" + param;
  window.open(url, "communicationViewPopup", "width=750, height=700;");
}

// <!-- KB에스크로 이체 인증마크 적용 시작 -->
function onPopKBAuthMark() {
  window.open('', 'KB_AUTHMARK', 'height=604, width=648, status=yes, toolbar=no, menubar=no,location=no');
  document.KB_AUTHMARK_FORM.action = 'http://escrow1.kbstar.com/quics';
  document.KB_AUTHMARK_FORM.target = 'KB_AUTHMARK';
  document.KB_AUTHMARK_FORM.submit();
}

var initMobileControlStatus = {
  isInitMobile: false,
  setInitMobile: function(status) {
    this.isInitMobile = status;
  }
};

function checkInitMobileControl(_w) {
  if (checkMobile(_w)) {
    if (initMobileControlStatus.isInitMobile) {
      return;
    }
    initMobileControlStatus.setInitMobile(true);
    sideNavControl.init();
    mSearchControl.init();
    mobileFakeSelect.init();
    floatingShowHide.init();
    if (getCookie('notThisWeek') === 'Y') {
      $('.app_banner').hide();
    } else {
      $('.app_banner').show();
    }
  } else {
    $('.app_banner').hide();
  }
}

$(document).ready(function() {
  gnbAction.init();
  gnbSticky.init();
  scrapHoverEffect.init();
  detailScrapHoverEffect.init();
  detailShareHoverEffect.init();
  checkInitMobileControl($(window).width());
  //selectOption.init();
  $(window).on('resize', function(event) {
    checkInitMobileControl(event.currentTarget.innerWidth);
  });
  $('html,body').on({
    scroll: function() {
      var screenHeight = $(window).innerHeight();
      $('#sidepanel').css('height', screenHeight + 'px');
    }
  });
});

function closePopupNotThisWeek() {
  setCookie2('notThisWeek', 'Y', 1);
}

//쿠키 설정
function setCookie2(name, value, expiredays) {

  var today = new Date();

  today.setDate(today.getDate() + expiredays);

  document.cookie = name + '=' + escape(value) + '; path=/; expires=' + today.toGMTString() + ';';

}

//쿠키가져오기
function getCookie(name) {
  var cName = name + "=";
  var x = 0;
  while (i <= document.cookie.length) {
    var y = (x + cName.length);
    if (document.cookie.substring(x, y) === cName) {

      if ((endOfCookie = document.cookie.indexOf(";", y)) < 0)
        endOfCookie = document.cookie.length;
      return unescape(document.cookie.substring(y, endOfCookie));
    }

    x = document.cookie.indexOf(" ", x) + 1;
    if (x === 0) {
      break;
    }
  }
  return "";
}

function modalopen() {
  if (document.documentElement.scrollHeight > document.documentElement.clientHeight) {
    // var tempobj = {'overflow': 'hidden', 'background-color' : '#f1f1f1'};
    var tempobj = {'overflow': 'hidden'};
    var body = $('body');
    var scrollDiv = document.createElement('div');

    scrollDiv.className = 'modal-scrollbar-measure';
    body.append(scrollDiv);

    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

    if (scrollbarWidth > 0) {
      var _currentW = body.width();
      tempobj['padding-right'] = scrollbarWidth;
      var agent = navigator.userAgent.toLowerCase();

      if ((navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) {
      } else {
        $('.gnb_area').css({'width': _currentW});
      }

      $('#quickMenu').css({'margin-right': scrollbarWidth});
    }
    $('#app').css({'position': 'static'});
    body.css(tempobj);
  }
}

function modalclose() {
  if ($('body').find('._dimm_new')) {
    if (!$('._dimm_new').is(":visible")) {
      modalcloseStyle();
    } else {
      return false;
    }
  } else {
    modalcloseStyle();
  }
}

function modalcloseStyle() {
  var currentPathName = document.location.pathname;

  $('.modal-scrollbar-measure').remove();
  var tempobj = {'overflow': 'auto', 'padding-right': 0};
  $('body').removeAttr('style');
  if (currentPathName === '/' || currentPathName === '/index.do') {
    $('#app').css({'position': 'static'});
  }
  if (checkMobile()) {
    // $('#app').css('position', 'relative')
  }
  $('.gnb_area').css({'width': '100%'});
  $('#quickMenu').removeAttr('style');
}

