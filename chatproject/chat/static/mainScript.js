      var chat = document.getElementById("chat-log");
      chat.oncontextmenu = () => {return false};

      const roomName = JSON.parse(document.getElementById('room-name').textContent);
      document.getElementById("name").innerHTML = roomName;

      var isreply = false, from_id, messages_div_List = [], messages_data_List = [], num;
      var username={{ username }};

      const chatSocket = new ReconnectingWebSocket(
          'ws://'
          + window.location.host
          + '/ws/chat/'
          + roomName
          + '/'
      );

      chatSocket.onopen = function(e) {
        chatSocket.send(JSON.stringify({
            "command":"fetch_message",
            "roomname":roomName
        }));
      }

      chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        if (data["command"] === "fetch_message") {
          num = data["message"].length;
          for(let i = data["message"].length-1; i >= 0; i--) {
            content = data["message"][i];
            message = new Message(content, username, num);
            let data_div = message.create_message();
            messages_div_List.push(data_div);
            messages_data_List.push(message);
            chat.appendChild(data_div);
          }
        } else {
            message = new Message(data["message"], username, n);
            let data_div = message.create_message();
            chat.appendChild(data_div);
          }
          chat.scroll({ top: chat.scrollHeight});
          // chat.scroll({ top: chat.scrollHeight, behavior: "smooth"});
      }

      document.getElementById("clear_chat").addEventListener("click", () => {
      window.location.pathname = "/chat/clear_chat/" + roomName + "/";});

      class Message {
        constructor(data, username, n) {
          this.num = n;
          this.id = data["id"];
          this.author = data["__str__"];
          this.content = data["content"];
          this.replystatus = data["Isreply"];

          if (this.replystatus) {
            this.replied_content = data["replied_content"];
            this.replied_id = data["replied_id"];
          }

          var time = "";
          for (let i = 11;;i++) {
            if (i === 16) break;
            time += data["timestamp"][i];
          }

          this.time = time;
          this.username = username;
        }

        #set_setting() {
          var message_setting = document.createElement("div");
          message_setting.classList.add("dropdown-menu");
          message_setting.classList.add("setting");
          message_setting.style.backgroundColor = "white";
          message_setting.style.padding = "5px";
          message_setting.style.borderRadius = "10px";
          message_setting.style.boxShadow = "-2px 2px 10px black";
          message_setting.style.position = "relative";
          message_setting.style.float = "left";
          message_setting.style.direction = "ltr";
          message_setting.style.minWidth = "60px";
          this.message_setting = message_setting;
          return message_setting;
        }

        #set_delete_option() {
          var id = this.id;
          var del = document.createElement("button");
          del.classList.add("delete");
          var delete_icon = document.createElement("i");
          delete_icon.setAttribute("class", "fa fa-trash");
          del.appendChild(delete_icon);
          delete_icon.style.marginRight = "8px";
          del.innerHTML += "Delete";
          del = this.#content_menu_style_helper(del);
          this.message_setting.appendChild(del);
          del.addEventListener("click", () => {
            window.location.pathname = "/chat/del_msg/" + id + "/";
          });
        }

        #set_reply_option() {
          var reply = document.createElement("button");
          reply.classList.add("reply");
          var reply_icon = document.createElement("i");
          reply_icon.setAttribute("class", "fa fa-reply");
          reply_icon.style.marginRight = "8px";
          reply.appendChild(reply_icon);
          reply.innerHTML += "Reply";
          reply = this.#content_menu_style_helper(reply);
          this.message_setting.appendChild(reply);
          var id = this.id;
          var repText = this.content;

          reply.addEventListener("click", () => {
            var showReply = document.getElementById("show-reply");
            showReply.innerHTML = repText;
            showReply.style.display = "block";
            messageDir(showReply);
            isreply = true;
            from_id = id;
            document.getElementById("chat-message-input").focus();
            $("#chat-message-submit").click(() => {$("#show-reply").hide()});
          });
        }

        #set_edit_option() {
          var edit = document.createElement("button");
          edit.classList.add("edit");
          var edit_icon = document.createElement("i");
          edit_icon.setAttribute("class", "fa fa-pencil");
          edit_icon.style.marginRight = "8px";
          edit.appendChild(edit_icon);
          edit.innerHTML += "Edit";
          edit = this.#content_menu_style_helper(edit);
          edit.style.marginTop = "4px";
          this.message_setting.appendChild(edit);
          var id = this.id;
          var matn = this.content;

          edit.addEventListener("click", () => {
            document.querySelector('#chat-message-input').focus();
            var input = document.getElementById("chat-message-input");

            input.value = matn;
            document.querySelector('#chat-message-input').onkeyup = function(e) {
              if (e.key === 'Enter') {
                let str = input.value;
                window.location.pathname = '/chat/edit_msg/' + id + '/' + (str || matn) + '/';
              }
            };
          });
        }

        #set_speak_option() {
          var speak = document.createElement("button");
          speak.classList.add('speak');
          var speak_icon = document.createElement("i");
          speak_icon.setAttribute("class", "fa fa-volume-up");
          speak_icon.style.marginRight = "8px";
          speak.appendChild(speak_icon);
          speak.innerHTML += "Speak";
          var speed = 1;
          speak = this.#content_menu_style_helper(speak);
          speak.style.marginTop = "4px";
          this.message_setting.appendChild(speak);
          var content = this.content;

          speak.addEventListener("click", () => {
            const text = new SpeechSynthesisUtterance(content);
            text.rate = speed;
            speechSynthesis.speak(text);
          });
        }

        #set_copy_option() {
          var copy = document.createElement("button");
          copy.classList.add("edit");
          var copy_icon = document.createElement("i");
          copy_icon.setAttribute("class", "fa fa-copy");
          copy_icon.style.marginRight = "8px";
          copy.appendChild(copy_icon);
          copy.innerHTML += "Copy Text";
          copy = this.#content_menu_style_helper(copy);
          copy.style.marginTop = "4px";
          this.message_setting.appendChild(copy);
          var content = this.content;

          copy.addEventListener("click", () => {
            navigator.clipboard.writeText(content);
            alert("Text Copied!");
          });
        }

        #content_menu_style_helper(element) {
          var show = true;
          element.style.display = "block";
          element.style.border = "none";
          element.style.borderRadius = "10px";
          element.style.backgroundColor = "white";
          element.style.width = "100%";
          element.style.textAlign = "left";
          element.onmouseover = () => {element.style.backgroundColor = "#c1c1c1"; element.style.transition = "0.3s"};
          element.onmouseleave = () => {element.style.backgroundColor = "white"; element.style.transition = "0.3s"};
          element.onclick = () => {this.message_setting.style.display = 'none'; show = true};
          return element;
        }

        #set_name() {
          var name = document.createElement("p");
          name.classList.add("name");
          name.innerHTML = this.author;
          name.style.cursor = "default";
          name.style.width = "fit-content";
          name.style.marginBottom = "7px";
          name.style.fontWeight = "bold";
          return name;
        }

        #set_content() {
          var matn = document.createElement("p");
          matn.classList.add("matn");
          matn.style.cursor = "text";
          matn.style.width = "fit-content";
          matn.style.marginBottom = "7px";
          var messageLen = this.content.length;
          console.log(messageLen);
          matn.innerHTML = this.content;
          var maxLen = 65;
          if (messageLen > maxLen) {
            let messageArr = [];
            for (let i = 0; i != messageLen; i++) messageArr[i] = this.content[i];
            for (let i = 1; i <= messageLen + 1; i++) {
              if (messageArr[i] == ' ' && i % maxLen == 0) {
                messageArr.splice(i, 0, "<br />");
                i++;
              } else if (messageArr[i] != ' ' && i % maxLen == 0) {
                while (messageArr[i] != ' ') {
                  i++;
                  if (messageArr[i] == ' ') {
                    messageArr.splice(i, 0, "<br />");
                    break;
                  }
                }
              }
            }
            matn.innerHTML = messageArr.join('');
          }
          return matn;
        }

        #set_date() {
          var date = document.createElement("p");
          date.classList.add("date");
          date.style.cursor = "default";
          date.style.color = "gray";
          date.style.margin = "0px";
          date.style.fontSize = "12px";
          if (this.replystatus) date.innerHTML = this.time + "  replied";
          else date.innerHTML = this.time + "  not replied";
          return date;
        }

        create_message() {
          var data_div = document.createElement("div");
          let name = this.#set_name();
          let matn = this.#set_content();
          let date = this.#set_date();
          data_div.appendChild(name);
          data_div.style.whiteSpace = "nowrap";
          if (this.replystatus) {
            var repDiv = document.createElement("div");
            repDiv.style.padding = "5px";
            repDiv.style.backgroundColor = "white";
            repDiv.style.marginBottom = "5px";
            repDiv.style.borderRadius = "10px";
            repDiv.style.opacity = "0.8";
            repDiv.classList.add("replied_content");
            var repliedContent = this.replied_content;
            if (this.replied_content.length >= 90) repDiv.innerHTML = repliedContent.slice(0, 30) + "...";
            else if (this.replied_content.length >= 15) repDiv.innerHTML = repliedContent.slice(0, repliedContent.length / 3) + "...";
            else repDiv.innerHTML = repliedContent.slice(0,);
            messageDir(repDiv);

            repDiv.addEventListener("click", () => {
              let number = find_divs_number(this.replied_id);
              scroll(0, number);
            });
            data_div.appendChild(repDiv);
          }

          data_div.appendChild(matn);
          data_div.appendChild(date);
          data_div.style.maxWidth = "500px";
          data_div.style.minWidth = "130px";
          if (this.author == username) {
            data_div.classList.add("person1");
            data_div.style.marginLeft = "auto";
            matn.style.paddingLeft = "15px";
            data_div.style.direction = "rtl";
            matn.style.direction = "ltr";
            date.style.direction = "ltr";
          } else {
            data_div.classList.add("person2");
            matn.style.paddingRight = "15px";
            date.style.textAlign = "right";
          }
          // create setting and add options
          this.#set_setting();
          this.#set_reply_option();
          this.#set_delete_option();
          this.#set_copy_option();
          this.#set_speak_option();
          this.#set_edit_option();
          data_div.appendChild(this.message_setting);
          const content_menu=this.message_setting;
          content_menu.style.display = "none";
          messageDir(matn);

          data_div.addEventListener("contextmenu", () => {
            var chat = document.getElementById("chat-log");
            content_menu.style.display = "block";
            content_menu.scrollIntoView({ behavior: 'smooth', block: 'center' });
            chat.onclick = () => {content_menu.style.display = "none";}
          });
          return data_div;
        }
      }

      var input = document.getElementById("chat-message-input");
      var text = input.value;
      var members = document.getElementById("members");
      var innerMembers = members.innerHTML;
      setInterval(() => {
        if (text !== input.value) {
          members.innerHTML = username + " is typing...";
          text = input.value;
        } else if (text === input.value || text === "") members.innerHTML = innerMembers;
      }, 500);

      function messageDir(element) {
        let char = new RegExp("[\u0600-\u06FF]");
        if (char.test(element.innerHTML) === true) element.style.direction = "rtl";
        else element.style.direction = "ltr";
      }

      function findType(element) {
        let char = new RegExp("[\u0600-\u06FF]");
        if (char.test(element.value) === true) element.style.direction = "rtl";
        else element.style.direction = "ltr";
      }
      setInterval(() => {findType(input)}, 1);

      var message1 = document.getElementsByClassName("person1");
      var message2 = document.getElementsByClassName("person2");

      // function calculate_height() {
      //   var ht = 0;
      //   for (let i = 0; i != num; i++) ht += messages_div_List[i].clientHeight;
      //   return ht;
      // }

      function scroll(speed, num) {
        var ht = 0;
        for (let i = 0; i != num; i++) ht += messages_div_List[i].clientHeight;
        ht += 30;
        $("#chat-log").animate({scrollTop: ht}, speed);
      }

      // function scroll_till_end(speed){
      //   var ht=0;
      //   $("#chat-log div").each(()=>{
      //     ht+=$(this).height()
      //   })
      //   $("#chat-log").animate({scrollTop: ht}, speed);
      // }

      function find_divs_number(id){
        for (let i = 0; i < messages_data_List.length; i++) {
          const element = messages_data_List[i];
          if (element.id === id){
            if (i===0) return i;
            return i-1;
          }
        }
      }

      var content = document.getElementById("members");
      document.addEventListener("DOMContentLoaded", () => {let textContent = `${navigator.onLine ? "Online" : "Offline"}`});

      const send = document.getElementById("send");
      setInterval(check_inp, 1);
      function check_inp() {
        if (input.value !== "") {
          send.setAttribute("class", "fa fa-send");
          send.style.fontSize = "23px";
        } else {
          send.setAttribute("class", "fa fa-microphone");
          send.style.fontSize = "30px";
        }
      }

      chatSocket.onclose = () => {console.error('Chat socket closed unexpectedly')}
      // chatSocket.onclose = function(e) {
      //   console.error('Chat socket closed unexpectedly');
      // };

      document.querySelector('#chat-message-input').focus();
      document.querySelector('#chat-message-input').onkeyup = (e) => {
        if (e.key === 'Enter' && input.value !== "") {
          document.querySelector('#chat-message-submit').click();
          location.reload();
        }
      }

      document.querySelector('#chat-message-submit').onclick = function(e) {
        if (input.value !== "") {
          const messageInputDom = document.querySelector('#chat-message-input');
          const message = messageInputDom.value;
          chatSocket.send(JSON.stringify({
            'message': message,
            'command':'new_message',
            'username':username,
            "roomname":roomName,
            "reply":{
              "status":isreply,
              "from_id":from_id,
            },
          }));
          messageInputDom.value = '';
          location.reload();
        }
      };