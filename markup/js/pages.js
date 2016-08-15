$(document).ready(function () {
//    function correctHeightProfilePage() {
//        var cont = $('.profile .main-content');
//        cont.css('height', 'auto');
//        cont.height(cont.height() - 87);
//    };
//    $(window).resize(correctHeightProfilePage);
//    correctHeightProfilePage();
//
    $('.hideDropdown').click(function (e) {
        $('.profile-dropdown').slideUp(function(){
            $('.profile-buttons').show();
            
        });


        e.preventDefault();
    });
    
    
    
    
    
    
    ///// While HOVER on battle Item Avatar
    
    $('.battle-photo').hover(function(){
        $(this).toggleClass('active');
    });

    
    $('body').on('mouseenter', '.profile-avatar', function(){
      var width = $(window).width();
      if(width > 989)
        $('.profile-avatar__add-new').fadeIn(100);
    })
    $('body').on('mouseleave', '.profile-avatar', function(){
      var width = $(window).width();
      if(width > 989)
        $('.profile-avatar__add-new').fadeOut(70);
    });


});


/*$(document).ready(function(){
  window.scrollHeight = 0;
  var heightDifference;
  var navMenu = $('.footer');
  var old = 0;
  heightMenu = navMenu.height();
  $(window).scroll(function(e) {
    var offsetTop = $(this).scrollTop();

    heightDifference = offsetTop - old;
    if(old){
      if(heightDifference > 0){
        var menuOffset = parseInt(navMenu.css('bottom').replace('px', ''));
        var hideMenuFor = menuOffset - heightDifference;
        console.log(heightDifference);
        navMenu.css('bottom', hideMenuFor);
      }
      else {
        navMenu.fadeIn();
      }
    }
    // navMenu.css('bottom', -offsetTop);

    old = offsetTop;
  })
})
*/