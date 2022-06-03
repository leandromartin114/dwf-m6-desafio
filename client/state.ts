import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { find, map, keys } from "lodash";
import "dotenv/config";

const firebaseConfig = {
	apiKey: "OTLhXwscIj3XxmffXMgnXdNEw86pttjzddNdSBto",
	databaseURL: "https://dwf-m6-desafio-c066f-default-rtdb.firebaseio.com",
	projectId: "dwf-m6-desafio-c066f",
	authDomain: "dwf-m6-desafio-c066f.firebaseapp.com",
	storageBucket: "dwf-m6-desafio-c066f.appspot.com",
	messagingSenderId: "1026711357930",
	appId: "1:1026711357930:web:b92abf3ae260623d600a93",
	measurementId: "G-HS9YH8Y5XR",
};

const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);
const firestore = getFirestore(app);
const dev = process.env.NODE_ENV == "development";
let API_BASE_URL = "http://localhost:3000";
if (dev) {
	API_BASE_URL = "http://localhost:3000";
}

type Move = "piedra" | "papel" | "tijera";

const state = {
	data: {
		userId: "",
		ownerId: "",
		name: "",
		roomId: "",
		rtdbRoomId: "",
		currentGame: {},
		history: [],
		score: {},
	},
	listeners: [],
	initState() {
		const stateFromStorage = JSON.parse(localStorage.getItem("multiplayer"));
		if (stateFromStorage != null) {
			this.setState(stateFromStorage);
		} else {
			this.setState(this.getState());
		}
	},
	getState() {
		return this.data;
	},
	setState(newState) {
		this.data = newState;
		for (const cb of this.listeners) {
			cb();
		}
		localStorage.setItem("multiplayer", JSON.stringify(newState));
	},
	subscribe(callback: (any) => any) {
		this.listeners.push(callback);
	},
	setNameAndRoomId(name: string, roomId?: string) {
		const currentState = this.getState();
		currentState.name = name;
		currentState.roomId = roomId || "";
		this.setState(currentState);
	},
	createUser(callback) {
		const currentState = this.getState();
		const name = currentState.name;
		if (name) {
			fetch(API_BASE_URL + "/signup", {
				method: "post",
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify({
					name,
				}),
			})
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					currentState.userId = data.id;
					this.setState(currentState);
					callback();
				});
		} else {
			console.error("There isn't data in state");
			callback(true);
		}
	},
	createRoom(callback?) {
		const currentState = this.getState();
		const userId = currentState.userId;
		if (userId) {
			fetch(API_BASE_URL + "/rooms", {
				method: "post",
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify({
					userId,
				}),
			})
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					currentState.roomId = data.id;
					currentState.ownerId = userId;
					this.setState(currentState);
					if (callback) {
						callback();
					}
				});
		} else {
			console.error("There isn't userId in state");
		}
	},
	getRoom(callback?) {
		const currentState = this.getState();
		const userId = currentState.userId;
		const roomId = currentState.roomId;
		fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				currentState.rtdbRoomId = data.data.rtdbRoomId;
				this.setState(currentState);
				this.listenRoom();
				if (callback) {
					callback();
				}
			});
	},
	listenRoom() {
		const currentState = this.getState();
		const rtdbRoomId = currentState.rtdbRoomId;
		console.log("Connected to gameroom " + rtdbRoomId);
		const realTimeRoomRef = ref(rtdb, "/rooms/" + rtdbRoomId);
		onValue(realTimeRoomRef, (snapshot) => {
			const dataFromServer = snapshot.val();
			const currentGameFromServer = dataFromServer.currentGame;
			const currentScoreFromServer = dataFromServer.score;
			currentState.currentGame = currentGameFromServer;
			currentState.score = currentScoreFromServer;
			this.setState(currentState);
		});
	},
	//para setear los datos del jugador en currentGame y score dentro de la db la primera vez que ingresa en la sala
	firstLogin() {
		const currentState = this.getState();
		const rtdbRoomId = currentState.rtdbRoomId;
		const userId = currentState.userId;
		const name = currentState.name;
		fetch(API_BASE_URL + "/rooms/first-login", {
			method: "post",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				rtdbRoomId: rtdbRoomId,
				userId: userId,
				name: name,
			}),
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log(data);
			});
	},
	//para setear los datos del jugador en currentGame dentro de la db cuando ingresa a la sala
	login() {
		const currentState = this.getState();
		const rtdbRoomId = currentState.rtdbRoomId;
		const userId = currentState.userId;
		const name = currentState.name;
		fetch(API_BASE_URL + "/rooms/login", {
			method: "post",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				rtdbRoomId: rtdbRoomId,
				userId: userId,
				name: name,
			}),
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log(data);
			});
	},
	//para setear los datos del jugador en currentGame dentro de la db cuando abandonla la sala
	logoff() {
		const currentState = this.getState();
		const rtdbRoomId = currentState.rtdbRoomId;
		const userId = currentState.userId;
		const name = currentState.name;
		fetch(API_BASE_URL + "/rooms/logoff", {
			method: "post",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				rtdbRoomId: rtdbRoomId,
				userId: userId,
				name: name,
			}),
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log(data);
			});
	},
	//para setear los datos del jugador en currentGame dentro de la db cuando pulsa PLAY y está listo para jugar
	start(callback?) {
		const currentState = this.getState();
		const rtdbRoomId = currentState.rtdbRoomId;
		const userId = currentState.userId;
		const name = currentState.name;
		fetch(API_BASE_URL + "/rooms/start", {
			method: "post",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				rtdbRoomId: rtdbRoomId,
				userId: userId,
				name: name,
			}),
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log(data);
				if (callback) {
					callback();
				}
			});
	},
	//para setear los datos del jugador en currentGame dentro de la db cuando finalizó la jugada
	end() {
		const currentState = this.getState();
		const rtdbRoomId = currentState.rtdbRoomId;
		const userId = currentState.userId;
		const name = currentState.name;
		fetch(API_BASE_URL + "/rooms/end", {
			method: "post",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				rtdbRoomId: rtdbRoomId,
				userId: userId,
				name: name,
			}),
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log(data);
			});
	},
	//enviar a la db la jugada del jugador
	sendMove(move: string) {
		const currentState = this.getState();
		const rtdbRoomId = currentState.rtdbRoomId;
		const userId = currentState.userId;
		fetch(API_BASE_URL + "/rooms/move", {
			method: "post",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				rtdbRoomId: rtdbRoomId,
				userId: userId,
				choice: move,
			}),
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log(data);
			});
	},
	//define si el usuario es el ganador, actualiza en la rtdb el score sumándole 1 punto
	setScore() {
		const currentState = this.getState();
		const currentGame = map(currentState.currentGame);
		const currentScore = map(currentState.score);
		if (currentGame[0].name == currentState.name) {
			const result = this.defineWinner(
				currentGame[0].choice,
				currentGame[1].choice
			);
			if (result == "¡You Won!") {
				let myScore = parseInt(currentScore[0].score);
				myScore++;
				fetch(API_BASE_URL + "/rooms/score", {
					method: "post",
					headers: {
						"content-type": "application/json",
					},
					body: JSON.stringify({
						rtdbRoomId: currentState.rtdbRoomId,
						userId: currentState.userId,
						score: myScore,
					}),
				})
					.then((res) => {
						return res.json();
					})
					.then((data) => {
						console.log(data);
					});
			}
		}
		if (currentGame[1].name == currentState.name) {
			const result = this.defineWinner(
				currentGame[1].choice,
				currentGame[0].choice
			);
			if (result == "¡You Won!") {
				let myScore = parseInt(currentScore[1].score);
				myScore++;
				fetch(API_BASE_URL + "/rooms/score", {
					method: "post",
					headers: {
						"content-type": "application/json",
					},
					body: JSON.stringify({
						rtdbRoomId: currentState.rtdbRoomId,
						userId: currentState.userId,
						score: myScore,
					}),
				})
					.then((res) => {
						return res.json();
					})
					.then((data) => {
						console.log(data);
					});
			}
		}
	},
	//si algún jugador decide, puede resetear todo el score de la sala volviendo a 0
	resetScore() {
		const currentState = this.getState();
		const currentScoreIds = keys(currentState.score);
		const userId1 = currentScoreIds[0];
		const userId2 = currentScoreIds[1];
		fetch(API_BASE_URL + "/rooms/reset", {
			method: "post",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				rtdbRoomId: currentState.rtdbRoomId,
				userId1: userId1,
				userId2: userId2,
			}),
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log(data);
			});
	},
	defineWinner(player1Move: Move, player2Move: Move) {
		const tieGame = [
			{ myPlay: "piedra", opponentPlay: "piedra", result: "¡It's a Tie!" },
			{ myPlay: "papel", opponentPlay: "papel", result: "¡It's a Tie!" },
			{ myPlay: "tijera", opponentPlay: "tijera", result: "¡It's a Tie!" },
		];
		const wonGame = [
			{ myPlay: "piedra", opponentPlay: "tijera", result: "¡You Won!" },
			{ myPlay: "papel", opponentPlay: "piedra", result: "¡You Won!" },
			{ myPlay: "tijera", opponentPlay: "papel", result: "¡You Won!" },
		];
		const lostGame = [
			{ myPlay: "piedra", opponentPlay: "papel", result: "¡You Lost!" },
			{ myPlay: "papel", opponentPlay: "tijera", result: "¡You Lost!" },
			{ myPlay: "tijera", opponentPlay: "piedra", result: "¡You Lost!" },
		];
		for (const i of tieGame) {
			if (i.myPlay == player1Move && i.opponentPlay == player2Move) {
				return i.result;
			}
		}
		for (const a of wonGame) {
			if (a.myPlay == player1Move && a.opponentPlay == player2Move) {
				return a.result;
			}
		}
		for (const x of lostGame) {
			if (x.myPlay == player1Move && x.opponentPlay == player2Move) {
				return x.result;
			}
		}
	},
	pushToHistory() {
		const currentState = this.getState();
		const currentGame = currentState.currentGame;
		if (currentState.ownerId == currentState.userId) {
			const owner = find(currentGame, (k) => {
				if (k.name == currentState.name) {
					return k.name;
				}
			});
			const opponent = find(currentGame, (k) => {
				if (k.name !== currentState.name) {
					return k.name;
				}
			});
			fetch(API_BASE_URL + "/rooms/" + currentState.roomId + "/push", {
				method: "post",
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify({
					p1: owner.name,
					p2: opponent.name,
					p1Choice: owner.choice,
					p2Choice: opponent.choice,
				}),
			});
		}
	},
};
export { state };
