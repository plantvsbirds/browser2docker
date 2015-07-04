window.socket = io();

socket.on('disconnect', function (){
  $('#page-term').html('<p id="loading-text">Cooonecting</p>');
  startLoading();
})


socket.on('connect', function (){
  startLoading();
  removeLoading();
})

function getKeyFromEvent(evt) {
  evt = evt || window.event;
  return {
    charCode : evt.which || evt.keyCode,
    charStr : String.fromCharCode(evt.which || evt.keyCode)
  }
}
document.onkeydown = function(evt) {
  var charCode = getKeyFromEvent(evt).charCode;
  var charStr = getKeyFromEvent(evt).charStr;
  //alert(charStr);
  if (charCode == 8) {
    evt.preventDefault();
    socket.emit('keyboard-hit', '127');
  }

}

document.onkeypress = function(evt) {
  evt.preventDefault();
  evt.stopPropagation();
  evt = evt || window.event;
  var charCode = getKeyFromEvent(evt).charCode;
  var charStr = getKeyFromEvent(evt).charStr;
  //alert(charStr.charCodeAt(0));
  socket.emit('keyboard-hit', charCode.toString());  
  window.scrollTo(0,document.body.scrollHeight);
  
  return false;
};
function asciiOf(char){
  return char.charCodeAt(0);
}
function parsePastedContent(){
  var pastedText = $('#page-start textarea').val();
  function exceptValue(valueName){
    var startIndex = pastedText.indexOf(valueName);
    startIndex += valueName.length;
    //alert(pastedText[startIndex]);
    var currentIndex = startIndex + 1;
    function cur(){
      return pastedText[currentIndex];
    }
    var resultString = '';
    while (cur() != '\n' && currentIndex <= pastedText.length) {
      resultString += cur();
      currentIndex ++;
    }
    //alert(resultString)
    return resultString;
  }
  var targetDockerConfig = {};
  ['DOCKER_HOST', 'DOCKER_TLS_VERIFY',
   'DOCKER_CERT_PATH'].forEach(function (property){
    targetDockerConfig[property] = exceptValue(property);
  })

  //alert(JSON.stringify(targetDockerConfig));
  
  window.targetDockerConfig = targetDockerConfig;
  return targetDockerConfig;
}
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
  $('#page-term #loading-text').hide();
  clearInterval(loadingInterval);
}

$(function (){
  $('#connect-btn').click(function (){
    goToPageTerm();
    startLoading();
    socket.on('docker-print', function (char) {
      removeLoading();
      var char = char.split('');
      var asciiArray = char.map(function (c){
        return asciiOf(c);
      });
      function asciiInclude(code){
        return asciiArray.indexOf(code) > -1
      }

      asciiArray.forEach(function (code){
        //console.log(code, String.fromCharCode(code));
        var cases = {
          8 : function (){
            $('#page-term span:last-child').remove();
          } ,
          32 : function (){
            $('#page-term').append('<span>&nbsp;</span>');
          } ,
          10 : function (){
            $('#page-term').append('<br>');
          } ,
          13 : function (){
            $('#page-term').append('<br>')
          }
        }
        if (cases[code])
          cases[code]();
        else
          $('#page-term').append('<span>'+String.fromCharCode(code)+'</span>');
        window.scrollTo(0,document.body.scrollHeight);
        //$('#page-term span:last-child').css('width', (1.25 * char.length) + '%');
      })
      
    })
  })
})