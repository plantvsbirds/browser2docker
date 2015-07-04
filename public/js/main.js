document.onkeypress = function(evt) {
  evt = evt || window.event;
  var charCode = evt.which || evt.keyCode;
  var charStr = String.fromCharCode(charCode);
  //alert(charStr.charCodeAt(0));
  
};

function goToPageTerm(){
  $('#page-term').slideDown();
  $('#page-start').slideUp();
}
function goToPageStart(){
  $('#page-term').slideDown();
  $('#page-start').slideUp();
}
function startLoading(){
  $('#page-term p#loading-text').show();
    window.loadingInterval = setInterval(function (){
      var len = $('#page-term p#loading-text').text().length - 7;
      var loadingString = 'C';
      while (len > 0) {
        loadingString += 'o';
        len --;
      }
      loadingString += 'nnecting';
      $('#page-term p#loading-text').text(loadingString);
    },1000);
}
function removeLoading(){
  $('#page-term p#loading-text').hide();
  clearInterval(loadingInterval);
}


$(function (){
  $('#connect-btn').click(function (){
    goToPageTerm();
    startLoading();
  })
})