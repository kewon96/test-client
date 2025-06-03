import axios from "axios";
const BASE_URL = 'https://api-dev.ubittz.co.kr/i-planning';

const stompClient = new StompJs.Client({
  // brokerURL: 'ws://localhost:8080/gs-guide-websocket'
  // brokerURL: 'http://localhost:8282/i-planning/ws-chat'
  brokerURL: `${BASE_URL}/ws-chat`
});

stompClient.onConnect = (frame) => {
  setConnected(true);
  console.log('Connected: ' + frame);
  stompClient.subscribe('/topic/room/room-1', (greeting) => {
      console.log(greeting);
      showGreeting(JSON.parse(greeting.body).content);
  });
};

stompClient.onWebSocketError = (error) => {
  console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
  console.error('Broker reported error: ' + frame.headers['message']);
  console.error('Additional details: ' + frame.body);
};

function setConnected(connected) {
  $("#connect").prop("disabled", connected);
  $("#disconnect").prop("disabled", !connected);
  if (connected) {
      $("#conversation").show();
  }
  else {
      $("#conversation").hide();
  }
  $("#greetings").html("");
}

function connect() {
  stompClient.activate();
}

function disconnect() {
  stompClient.deactivate();
  setConnected(false);
  console.log("Disconnected");
}

function sendName() {
  console.log();

  // const axios = require('axios').defaults;
  // const axios = import 'axios'

  const message = {
    type: 'CHAT',
    context: "내용내용",
    sender: '사용자1',
    roomId: "room-1",
  };

  axios.put(`${BASE_URL}/chat/send`, message);
  
  
  // stompClient.publish({
  //     // destination: "/app/hello",
  //     destination: "/chat.sendMessageToRoom",
  //     // body: JSON.stringify({'name': $("#name").val()})
  //     body: JSON.stringify(message)
  // });
}

function showGreeting(message) {
  $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
  $("form").on('submit', (e) => e.preventDefault());
  $( "#connect" ).click(() => connect());
  $( "#disconnect" ).click(() => disconnect());
  $( "#send" ).click(() => sendName());
});