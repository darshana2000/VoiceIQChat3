﻿import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Pusher from "pusher-js";

const baseUrl = 'http://localhost:49240';

const Welcome = ({ onSubmit }) => {
    let usernameInput;
    return (
        <div>
            <p>Enter your Twitter name and start chatting!</p>
            <form onSubmit={(e) => {
                e.preventDefault();
                onSubmit(usernameInput.value);
            }}>
                <input type="text" placeholder="Enter name here" ref={node => {
                    usernameInput = node;
                }} />
                <input type="submit" value="Join the chat" />
            </form>
        </div>
    );
};

const ChatInputForm = ({
    onSubmit
}) => {
    let messageInput;
    return (
        <form onSubmit={e => {
            e.preventDefault();
            onSubmit(messageInput.value);
            messageInput.value = "";
        }}>
            <input type="text" placeholder="message" ref={node => {
                messageInput = node;
            }} />
            <input type="submit" value="Send" />
        </ form>
    );
};

const ChatMessage = ({ message, username }) => (
    <li className='chat-message-li'>
        <img src={`https://twitter.com/${username}/profile_image?size=original`} style={{
            width: 24,
            height: 24
        }} />
        <strong>@{username}: </strong> {message}
    </li>
);

const ChatMessageList = ({ messages }) => (
    <ul>
        {messages.map((message, index) =>
            <ChatMessage
                key={index}
                message={message.Text}
                username={message.AuthorTwitterHandle} />
        )}
    </ul>
);


const Chat = ({ onSubmit, messages }) => (
    <div>
        <ChatMessageList messages={messages} />
        <ChatInputForm onSubmit={onSubmit} />
    </div>
);

const App = React.createClass({
    getInitialState() {
        return {
            authorTwitterHandle: "",
            messages: []
        }
    },

    componentDidMount() {
        console.log("This is the base URL :" + baseUrl);
        axios
            .get('${baseUrl}/api/messages')
            .then(response => {
                this.setState({
                    messages: response.data
                });
                var pusher = new Pusher('20012b9e7339e931c542', {
                    encrypted: true
                });
                var chatRoom = pusher.subscribe('messages');
                chatRoom.bind('new_message', message => {
                    this.setState({
                        messages: this.state.messages.concat(message)
                    });
                });
            });
    },

    sendMessage(messageText) {
        console.log('send-Hash');
        axios
            .post(`${baseUrl}/api/messages`, {
                text: messageText,
                authorTwitterHandle: this.state.authorTwitterHandle
            })
            .catch(() => alert('Something went wrong ss:('));
    },

    render() {
        if (this.state.authorTwitterHandle === '') {
            return (
                <Welcome onSubmit={author =>
                    this.setState({
                        authorTwitterHandle: author
                    })
                } />
            );
        } else {
            return <Chat messages={this.state.messages} onSubmit={this.sendMessage} />;
        }
    }
});

ReactDOM.render(<App />, document.getElementById("app"));