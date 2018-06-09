var socket = io.connect();
var input = $('#form-control');
var content = $('#chat_area');
socket.nickname = $('#user_email').val();

socket.on('text_message', text_message);
socket.on('image_message', image_message);

function text_message(author, msg) {
  input.removeAttr('disabled');
  content.prepend('<li class="left clearfix"><div class="chat-body1 clearfix"> <p>' + xssFilters.inHTMLData(author) + ': ' + xssFilters.inHTMLData(msg) + '</p></div> </li>');

}

function image_message(author, base64Image) {
  input.removeAttr('disabled');
  content.prepend('<li class="left clearfix"><div class="chat-body1 clearfix"> <p>' + xssFilters.inHTMLData(author) + ': <img src="' + xssFilters.inHTMLData(base64Image) + '"/></p></div> </li>');
}

$(function () {
  $('#imagefile')
    .on('change', function (e) {
      var file = e.originalEvent.target.files[0],
        reader = new FileReader();
      reader.onload = function (evt) {
        image_message(socket.nickname, evt.target.result);
        socket.emit('image_message', evt.target.result);
      };
      reader.readAsDataURL(file);
    });

  input.keydown(function (e) {
    if (e.keyCode === 13) {
      var msg = $(this).val();
      if (!msg) {
        return;
      }
      text_message(socket.nickname, msg);
      socket.emit('text_message', msg);

      $(this).val('');
    }
  });
  socket.emit('nickname', socket.nickname);
  socket.emit('send_history');
});
