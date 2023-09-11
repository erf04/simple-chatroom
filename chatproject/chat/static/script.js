
//var sagi = document.querySelector("#chat-log");
//sagi.scrollTop = sagi.scrollHeight;



var message = document.getElementById("chat-message-input");
var emoji = document.getElementsByTagName("p");

function addEmoji(num) {
  message.value += emoji[num].innerHTML;
}

function showEmoji() {
  var emojiList = document.getElementById("emoji-list");
  emojiList.style.display = "block";
}

function hideEmoji() {
  var emojiList = document.getElementById("emoji-list");
  emojiList.style.display = "none";
}
