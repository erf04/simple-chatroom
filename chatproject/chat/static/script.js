// var emoji = document.getElementsByTagName("span");

function addEmoji(num) {
  var message = document.getElementById("chat-message-input");
  var emoji = document.getElementsByTagName("span");
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

// var show = true;
/////////////////////////////////////////////////////
// function create_chat(data) {

//   const id = data["id"];
//   var data_div = document.createElement("div");
//   var message_setting = document.createElement("div");
//   message_setting.classList.add("setting");
//   message_setting.style.backgroundColor = "white";
//   message_setting.style.padding = "5px";
//   message_setting.style.borderRadius = "10px";
//   message_setting.style.boxShadow = "-2px 2px 10px black";
//   message_setting.style.position = "relative";
//   message_setting.style.float = "left";
//   message_setting.style.zIndex = "100";

//   var voice = document.createElement("audio");
//   voice.setAttribute("controls", "");
//   voice.style.display = "none";
//   send.addEventListener("click", initFunction);
//   function initFunction() {
//     send.setAttribute("class", "fa fa-send");
//     async function getUserMedia(constraints) {
//       if (window.navigator.mediaDevices) {
//         return window.navigator.mediaDevices.getUserMedia(constraints);
//       }
//       let legacyApi =
//         navigator.getUserMedia ||
//         navigator.webkitGetUserMedia ||
//         navigator.mozGetUserMedia ||
//         navigator.msGetUserMedia;
//       if (legacyApi) {
//         return new Promise(function (resolve, reject) {
//           legacyApi.bind(window.navigator)(constraints, resolve, reject);
//         });
//       } else {
//         alert("user api not supported");
//       }
//     }

//     let audioChunks = [];
//     let rec;
//     function handlerFunction(stream) {
//       rec = new MediaRecorder(stream);
//       rec.start();
//       rec.ondataavailable = (e) => {
//         audioChunks.push(e.data);
//         if (rec.state == "inactive") {
//           let blob = new Blob(audioChunks, { type: "audio/mp3" });
//           console.log(blob);
//           voice.src = URL.createObjectURL(blob);
//         }
//       };
//   }

//   function startusingBrowserMicrophone(boolean) {
//     getUserMedia({ audio: boolean }).then((stream) => {
//       handlerFunction(stream);
//     });
//   }
//   startusingBrowserMicrophone(true);

//     send.addEventListener("click", () => {
//       rec.stop();
//     });
//   }

//   const del = document.createElement("button");
//   del.addEventListener("click", function() {
//     window.location.pathname = '/chat/del_msg/' + id + '/';
//   });
//   del.classList.add("delete");
//   var delete_icon = document.createElement("i");
//   delete_icon.setAttribute("class", "fa fa-trash");
//   delete_icon.style.marginRight = "8px";
//   del.appendChild(delete_icon);
//   del.innerHTML += "Delete";

//   const reply = document.createElement("button");
//   reply.classList.add("reply");
//   var reply_icon = document.createElement("i");
//   reply_icon.setAttribute("class", "fa fa-reply");
//   reply_icon.style.marginRight = "8px";
//   reply.appendChild(reply_icon);
//   reply.innerHTML += "Reply";

//   const edit = document.createElement("button");
//   edit.classList.add("edit");
//   var edit_icon = document.createElement("i");
//   edit_icon.setAttribute("class", "fa fa-pencil");
//   edit_icon.style.marginRight = "8px";
//   edit.appendChild(edit_icon);
//   edit.innerHTML += "Edit";

//   const speak = document.createElement("button");
//   speak.classList.add('speak');
//   var speak_icon = document.createElement("i");
//   speak_icon.setAttribute("class", "fa fa-volume-up");
//   speak_icon.style.transform = "scaleY(-1)";
//   speak_icon.style.marginRight = "8px";
//   speak.appendChild(speak_icon);
//   speak.innerHTML += "Speak";
//   var speed = 1;
//   speak.addEventListener("click", () => {
//     const text = new SpeechSynthesisUtterance(matn.innerHTML);
//     text.rate = speed;
//     speechSynthesis.speak(text);
//   });

//   const copy = document.createElement("button");
//   copy.classList.add("edit");
//   var copy_icon = document.createElement("i");
//   copy_icon.setAttribute("class", "fa fa-copy");
//   copy_icon.style.marginRight = "8px";
//   copy.appendChild(copy_icon);
//   copy.innerHTML += "Copy Text";
//   copy.addEventListener("click", () => {
//     navigator.clipboard.writeText(matn.innerText);
//     alert("Text Copied!");
//   });

//   reply.style.display = "block";
//   del.style.display = "block";
//   edit.style.display = "block";
//   speak.style.display = "block";
//   copy.style.display = "block";

//   reply.style.border = "none";
//   del.style.border = "none";
//   edit.style.border = "none";
//   speak.style.border = "none";
//   copy.style.border = "none";

//   edit.style.borderRadius = "10px";
//   reply.style.borderRadius = "10px";
//   del.style.borderRadius = "10px";
//   speak.style.borderRadius = "10px";
//   copy.style.borderRadius = "10px";

//   edit.style.backgroundColor = "white";
//   reply.style.backgroundColor = "white";
//   del.style.backgroundColor = "white";
//   speak.style.backgroundColor = "white";
//   copy.style.backgroundColor = "white";

//   edit.style.width = "100%";
//   edit.style.textAlign = "left";
//   reply.style.width = "100%";
//   reply.style.textAlign = "left";
//   del.style.width = "100%";
//   del.style.textAlign = "left";
//   speak.style.width = "100%";
//   speak.style.textAlign = "left";
//   copy.style.width = "100%";
//   copy.style.textAlign = "left";

//   edit.onmouseover = () => {edit.style.backgroundColor = "#c1c1c1"; edit.style.transition = "0.3s"};
//   edit.onmouseleave = () => {edit.style.backgroundColor = "white"; edit.style.transition = "0.3s"};
//   reply.onmouseover = () => {reply.style.backgroundColor = "#c1c1c1"; reply.style.transition = "0.3s"};
//   reply.onmouseleave = () => {reply.style.backgroundColor = "white"; reply.style.transition = "0.3s"};
//   del.onmouseover = () => {del.style.backgroundColor = "#c1c1c1"; del.style.transition = "0.3s"};
//   del.onmouseleave = () => {del.style.backgroundColor = "white"; del.style.transition = "0.3s"};
//   speak.onmouseover = () => {speak.style.backgroundColor = "#c1c1c1"; speak.style.transition = "0.3s"};
//   speak.onmouseleave = () => {speak.style.backgroundColor = "white"; speak.style.transition = "0.3s"};
//   copy.onmouseover = () => {copy.style.backgroundColor = "#c1c1c1"; copy.style.transition = "0.3s"};
//   copy.onmouseleave = () => {copy.style.backgroundColor = "white"; copy.style.transition = "0.3s"};

//   reply.onclick = () => {message_setting.style.display = 'none'; show = true};
//   del.onclick = () => {message_setting.style.display = 'none'; show = true};
//   edit.onclick = () => {message_setting.style.display = 'none'; show = true};
//   speak.onclick = () => {message_setting.style.display = 'none'; show = true};
//   copy.onclick = () => {message_setting.style.display = 'none'; show = true};

//   del.style.marginTop = "4px";
//   edit.style.marginTop = "4px";
//   speak.style.marginTop = "4px";
//   copy.style.marginTop = "4px";

//   message_setting.style.direction = "ltr";
//   message_setting.appendChild(reply);
//   message_setting.appendChild(del);
//   message_setting.appendChild(edit);
//   message_setting.appendChild(speak);
//   message_setting.appendChild(copy);

//   var name = document.createElement("p");
//   name.classList.add("name");
//   var matn = document.createElement("p");
//   matn.classList.add("matn");
//   var date = document.createElement("p");
//   date.classList.add("date");

//   data_div.appendChild(name);
//   data_div.appendChild(voice);
//   data_div.appendChild(matn);
//   data_div.appendChild(date);

//   const author = data["__str__"];
//   name.innerHTML = author;
//   name.style.cursor = "default";
//   name.style.width = "fit-content";
//   matn.style.cursor = "text";
//   matn.style.width = "fit-content";
//   date.style.cursor = "default";

//   var time = "";
//   for (let i = 11;;i++) {
//     if (i === 16) {
//       break;
//     }
//     time += data["timestamp"][i];
//   }

//   name.style.marginBottom = "7px";
//   matn.style.marginBottom = "7px";
//   matn.innerHTML = data["content"];
//   date.style.color = "gray";
//   date.style.margin = "0px";
//   date.style.fontSize = "12px";
//   date.innerHTML = time;
//   data_div.style.maxWidth = "500px";
//   data_div.style.minWidth = "100px";
//   name.style.fontWeight = "bold";
//   if (author == username) {
//     data_div.classList.add("person1");
//     data_div.style.marginLeft = "auto";
//     matn.style.paddingLeft = "15px";
//     data_div.style.direction = "rtl";
//     matn.style.direction = "ltr";
//     date.style.direction = "ltr";
//   } else {
//     data_div.classList.add("person2");
//     matn.style.paddingRight = "15px";
//     date.style.textAlign = "right";
//   }
//   chat.appendChild(data_div);
//   data_div.appendChild(message_setting);
//   message_setting.style.display = "none";

//   data_div.addEventListener("contextmenu", () => {
//     // if (show) {
//       // show = false;
//     message_setting.style.display = "block";
//     // } else {

//     // }
//     // chat.onclick = () => {message_setting.style.display = "none"; show = true};
//     chat.onclick = () => {message_setting.style.display = "none"};
//   });
// }
