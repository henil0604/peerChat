var peerChat = {};

peerChat.data = {};

peerChat.data.mine = {};

peerChat.randomRange = (min, max) => {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

peerChat.createPeer = () => {
    return new Promise((resolve) => {
        peerChat.data.mine.peer = new Peer();

        peerChat.data.mine.peer.on('open', function (id) {
            document.getElementsByClassName("yourId")[0].innerHTML = `Your Id: ${id}`

            resolve()
        });

    })
}

peerChat.setListeners = () => {
    document.getElementById("joinBtn").onclick = () => {
        peerChat.join()
    }

    peerChat.data.mine.peer.on("connection", (conn) => {
        peerChat.data.mine.conn = conn
        console.log(`Connected With ${conn.peer}`)
        peerChat.onConnection(conn)
        peerChat.onDataSetUp()
    })

    document.getElementById("send").onclick = () => {
        peerChat.sendMsg()
    }

    document.getElementById("msg").addEventListener("keydown", (e) => {
        if (e.which == 13) {
            peerChat.sendMsg()
        }
    })

}

peerChat.sendMsg = () => {
    let data = {
        text: document.getElementById("msg").value,
        nickname: document.getElementById("nickname").value
    }

    peerChat.sendData(data)

    peerChat.appandMsg(data.text, data.nickname)

    document.getElementById("msg").value = ""
}

peerChat.join = () => {

    peerChat.data.mine.conn = peerChat.data.mine.peer.connect(document.getElementById("join").value);

    document.getElementById("join").value = ""
    document.getElementsByClassName("chat")[0].innerHTML = ""

    peerChat.onDataSetUp()

}

peerChat.sendData = (data) => {
    peerChat.data.mine.conn.send(data)
}

peerChat.onDataSetUp = () => {
    peerChat.data.mine.conn.on("data", (data) => {
        peerChat.onData(data)
    })
}

peerChat.onData = (data) => {
    peerChat.appandMsg(data.text, data.nickname)
}

peerChat.appandMsg = (text, span = "") => {
    let temp = `
        <div class="container">
            <p>${text}</p>
            <span class="time-left">${span}</span>
        </div>
    `

    document.getElementsByClassName("chat")[0].innerHTML += temp;

    document.getElementsByClassName("chat")[0].scrollTop = document.getElementsByClassName("chat")[0].scrollHeight;

}

peerChat.onConnection = (conn) => {
    document.getElementsByClassName("chat")[0].innerHTML = ""

    peerChat.appandMsg(`Connected With ${conn.peer}`, "PeerChat")

}

peerChat.init = async () => {

    await peerChat.createPeer()

    document.getElementById("nickname").value = "User" + peerChat.randomRange(0000, 9999)

    peerChat.setListeners()

}


peerChat.init()