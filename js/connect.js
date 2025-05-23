import { firebaseGet, firebaseSaveUpdate } from "./firebase_controll.js";

let peer, dataChannel;

document.addEventListener("DOMContentLoaded", makeAwnswer)


window.sendCommand = sendCommand
function sendCommand(cmd) {
    if (dataChannel && dataChannel.readyState === "open") {
        dataChannel.send(cmd);
        console.log("Enviado: " + cmd);
    } else {
        console.log("Canal não está aberto.");
    }
}

async function createAnswer(offer, id) {
    peer = new RTCPeerConnection({
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" }
        ]
    });

    peer.ondatachannel = event => {
        dataChannel = event.channel;
        dataChannel.onopen = () => console.log("Canal aberto!");
        dataChannel.onmessage = e => console.log("Recebido: " + e.data);
    };

    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    peer.onicecandidate = e => {
        if (e.candidate === null) {
            firebaseSaveUpdate({"answer" : peer.localDescription}, id);
        }
    };
}

async function makeAwnswer(e) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const offer = await firebaseGet(id)
    await createAnswer(offer, id)

}
