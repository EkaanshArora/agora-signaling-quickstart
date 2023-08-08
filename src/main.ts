import "./style.css";
import AgoraRTM, { type RTMClient } from "agora-rtm";

let signalingEngine: RTMClient;

const joinButton = document.getElementById("join") as HTMLButtonElement;
const sendButton = document.getElementById("send") as HTMLButtonElement;
const messageContainer = document.getElementById(
	"messageContainer"
) as HTMLDivElement;

joinButton.onclick = async () => {
	const { appId, channelName, token, uid } = getConfig();
	signalingEngine = new AgoraRTM.RTM(appId, String(uid), { token: token });
	signalingEngine.addEventListener({
		message: (eventArgs) => {
			addMessageToDom(`${eventArgs.publisher}: ${eventArgs.message}`);
		},
		status: (e) => {
			document.getElementById("status")!.innerText = e.state;
		},
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
	const AppID = (document.getElementById("AppID") as HTMLInputElement).value;
	const channelName = (document.getElementById("channel") as HTMLInputElement)
		.value;
	const uid = (document.getElementById("uid") as HTMLInputElement).value;
	const token = (document.getElementById("token") as HTMLInputElement).value;
	const config = {
		appId: AppID,
		channelName: channelName,
		uid: parseInt(uid),
		token: token,
	};
	if (!config.appId || !config.channelName || !config.uid || !config.token) {
		alert("Please input all the fields");
		throw new Error("Please input all the fields");
	}
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
	messageContainer.appendChild(messageRes);
};
