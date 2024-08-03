# simple chat application 
This is a simple yet powerful chat application built using Django for the backend and HTML, CSS, and JavaScript for the frontend. The app supports WebSocket connections for real-time chat functionality and includes features like message reply, speech-to-text, copy text message, emoji support, and group chat.

## Features
* Real-time chat with WebSocket connections.
* Message reply.
* Speech-to-text functionality.
* Copy text message.
* Send emojis in chat.
* Create and join groups for chatting with friends.

## Technologies
* **Backend**: Django
* **Frontend**: HTML, CSS, JavaScript
* **WebSockets**: Django Channels

## Installation
1.Clone the repository:
```
git clone [https://github.com//simple-chatroom.git](https://github.com/lead-team/simple-chatroom.git)
cd simple-chatroom
```
2.Install dependencies:
```
pip install -r requirements.txt
```
4. Apply migrations and create a superuser:
```
python manage.py migrate
python manage.py createsuperuser
```
5.Start the development server:
```
python manage.py runserver 0.0.0.0:8000
```
6.Ensure that the Django Channels is configured correctly for WebSocket support.

## Usage
1. Open a web browser and navigate to `http://localhost:8000`.
2. Create an account or log in using your credentials.
3. Create or join a chat group.
4. Start chatting with your friends in real-time!

## WebSocket Integration
The application uses Django Channels for handling WebSocket connections, enabling real-time communication between users.

### Key Files and Configurations

* **Routing**: WebSocket URL routing is configured in routing.py.
* **Consumers**: WebSocket consumers for handling messages are defined in consumers.py.
* **Templates**: HTML templates for the chat interface are located in the templates directory.
* **Static Files**: CSS and JavaScript files are stored in the static directory.

## Contributing
We welcome contributions! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

