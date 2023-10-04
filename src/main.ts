import "./style.css";
import AgoraRTM, { type RTMClient } from "agora-rtm";

let signalingEngine: RTMClient;

const joinButton = document.getElementById("join") as HTMLButtonElement;
const sendButton = document.getElementById("send") as HTMLButtonElement;

joinButton.onclick = async () => {
  const { appId, channelName, token, uid } = getConfig();
  signalingEngine = new AgoraRTM.RTM(appId, String(uid), { token: token });
  signalingEngine.addEventListener("message", (eventArgs) => {
    addMessageToDom(`${eventArgs.publisher}: ${eventArgs.message}`);
  });
  signalingEngine.addEventListener("status", (e) => {
    document.getElementById("status")!.innerText = e.state;
  });
  await signalingEngine.login();
  signalingEngine.subscribe(channelName);
};

sendButton.onclick = async () => {
  const { channelName, message } = getChannelAndMessage();
  await signalingEngine.publish(channelName, message);
  addMessageToDom("Me: " + message);
};

/* utils */
const getConfig = () => {
  const AppID = document.getElementById("AppID") as HTMLInputElement;
  const channelName = document.getElementById("channel") as HTMLInputElement;
  const uid = document.getElementById("uid") as HTMLInputElement;
  const token = document.getElementById("token") as HTMLInputElement;
  const config = {
    appId: AppID.value,
    channelName: channelName.value,
    uid: parseInt(uid.value),
    token: token.value,
  };
  console.log(config);
  if (!config.appId || !config.channelName) {
    alert("Please input all the fields");
    throw new Error("Please input all the fields");
  }
  AppID.disabled = true;
  channelName.disabled = true;
  uid.disabled = true;
  token.disabled = true;
  return config;
};

const getChannelAndMessage = () => {
  const message = (
    document.getElementById("message") as HTMLInputElement
  ).value.trim();
  const channelName = (document.getElementById("channel") as HTMLInputElement)
    .value;
  return {
    message: message,
    channelName: channelName,
  };
};

const addMessageToDom = (message: string) => {
  const messageRes = document.createElement("div");
  messageRes.innerText = message as string;
  const container = document.getElementById("messages") as HTMLDivElement;
  container.appendChild(messageRes);
};
