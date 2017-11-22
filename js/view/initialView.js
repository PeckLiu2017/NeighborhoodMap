// get placesList container made by html ul element and its items container made by html li element
let placesList = $('#places');
let placesToBeFilter = placesList.find('li');
let placesListHtml = '';
/* Set the width of the side navigation to 25% of the whole page */
$('#toggle-side-panel').click(function (e) {
  if (e.target != $('#myPopup')[0]) {
    if ($('#mySidenav').hasClass('open')) {
      $('.open-panel-icon').css('visibility','visible');
      $('.close-panel-icon').css('visibility','hidden');
      $('#mySidenav').toggleClass('open');
      $('#toggle-side-panel').css('left','0');
      $('#myPopup').toggleClass('panel-open');
    } else {
      $('.open-panel-icon').css('visibility','hidden');
      $('.close-panel-icon').css('visibility','visible');
      $('#mySidenav').toggleClass('open');
      $('#toggle-side-panel').css('left','25%');
      $('#myPopup').toggleClass('panel-open');
    }
  }
});

$('#toggle-side-panel').hover(
  function () {
    if ($('#myPopup').hasClass('panel-open')) {
      $('#myPopup').toggleClass('show').text('collapse search panel');
    } else {
      $('#myPopup').toggleClass('show').text('Expand search panel');
    }
  },
  function () {
      $('#myPopup').toggleClass('show');
  }
);

setTimeout("$('.open-panel-icon').css('borderColor','transparent transparent transparent #555')",1500);

for (var i = 0; i < locations.length; i++) {
  placesListHtml += '<li>' + locations[i].title + '</li>';
}

placesList.html(placesListHtml);
