/**
 *  =================================================================================
 *  @description
 *  code in this file handle animations on side panel —— $('#mySidenav') element and its
 *  trigger —— $('#toggle-side-panel') element
 *  =================================================================================
 */

 /**
  *  @description
  *  once $('#toggle-side-panel') element has been clicked
  *  Set the width of the side panel to 25% of the whole page
  */
$('#toggle-side-panel').click(function(e) {
  if (e.target != $('#myPopup')[0]) {
    if ($('#mySidenav').hasClass('open')) {
      $('.open-panel-icon').css('visibility', 'visible');
      $('.close-panel-icon').css('visibility', 'hidden');
      $('#mySidenav').toggleClass('open');
      $('#toggle-side-panel').css('left', '0');
      $('#myPopup').toggleClass('panel-open');
    } else {
      $('.open-panel-icon').css('visibility', 'hidden');
      $('.close-panel-icon').css('visibility', 'visible');
      $('#mySidenav').toggleClass('open');
      $('#toggle-side-panel').css('left', '25%');
      $('#myPopup').toggleClass('panel-open');
    }
  }
});

/**
 *  @description
 *  once side panel has been opend and the cursor is over $('#toggle-side-panel') element
 *  it shows 'collapse search panel' prompt .
 *  if side panel is closed and the cursor is over $('#toggle-side-panel') element
 *  it shows 'Expand search panel' prompt .
 *  Prompt will disappears when cursor leave
 */
$('#toggle-side-panel').hover(
  function() {
    if ($('#myPopup').hasClass('panel-open')) {
      $('#myPopup').toggleClass('show').text('collapse search panel');
    } else {
      $('#myPopup').toggleClass('show').text('Expand search panel');
    }
  },
  function() {
    $('#myPopup').toggleClass('show');
  }
);
