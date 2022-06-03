import * as express from "express";
import { rtdb, firestore, fieldValue } from "./db";
import * as cors from "cors";
import { nanoid } from "nanoid";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});

const usersCollection = firestore.collection("users");
const roomsCollection = firestore.collection("rooms");

//crea el usuario en la collection dentro de la db
app.post("/signup", (req, res) => {
	const { name } = req.body;
	usersCollection
		.where("name", "==", name)
		.get()
		.then((searchResp) => {
			if (searchResp.empty) {
				usersCollection
					.add({
						name,
					})
					.then((newUserRef) => {
						res.status(201).json({
							id: newUserRef.id,
							new: true,
						});
					});
			} else {
				res.status(200).json({
					message: "user already exist",
					id: searchResp.docs[0].id,
					name: searchResp.docs[0].data().name,
				});
			}
		});
});

//crea la room y guarda su rtdb en la collection
app.post("/rooms", (req, res) => {
	const { userId } = req.body;
	usersCollection
		.doc(userId.toString())
		.get()
		.then((doc) => {
			if (doc.exists) {
				const roomRef = rtdb.ref("rooms/" + nanoid());
				roomRef
					.set({
						owner: userId,
					})
					.then(() => {
						const roomLongId = roomRef.key;
						const roomId = Math.floor(Math.random() * 8999 + 999);
						roomsCollection
							.doc(roomId.toString())
							.set({
								rtdbRoomId: roomLongId,
							})
							.then(() => {
								res.json({
									id: roomId.toString(),
								});
							});
					});
			} else {
				res.status(401).json({
					message: "you don't exist",
				});
			}
		});
});

//obtiene el rtdbId guardado en la collection con el short id
app.get("/rooms/:roomId", (req, res) => {
	const { userId } = req.query;
	const { roomId } = req.params;
	usersCollection
		.doc(userId.toString())
		.get()
		.then((doc) => {
			if (doc.exists) {
				roomsCollection
					.doc(roomId.toString())
					.get()
					.then((snap) => {
						const data = snap.data();
						res.json({
							data,
						});
					});
			} else {
				res.status(401).json({
					message: "you don't exist",
				});
			}
		});
});

//loguea al usuario en una sala por primera vez definiendo su estructura de currentGame y score
app.post("/rooms/first-login", (req, res) => {
	const { rtdbRoomId, userId, name } = req.body;
	const roomRef = rtdb.ref("/rooms/" + rtdbRoomId + "/currentGame/");
	const roomScoreRef = rtdb.ref("/rooms/" + rtdbRoomId + "/score/");
	roomRef
		.child(userId)
		.set({ name: name, choice: "", online: true, start: false });
	roomScoreRef.child(userId).set({ name: name, score: 0 });
	res.json("First login successful");
});

//loguea al usuario en una sala
app.post("/rooms/login", (req, res) => {
	const { rtdbRoomId, userId, name } = req.body;
	const roomRef = rtdb.ref("/rooms/" + rtdbRoomId + "/currentGame/");
	roomRef
		.child(userId)
		.set({ name: name, choice: "", online: true, start: false });
	res.json("Login successful");
});

//desloguea al usuario de la sala
app.post("/rooms/logoff", (req, res) => {
	const { rtdbRoomId, userId, name } = req.body;
	const roomRef = rtdb.ref("/rooms/" + rtdbRoomId + "/currentGame/" + userId);
	roomRef.set({ name: name, choice: "", online: false, start: false });
	res.json("Player disconnected");
});

//define el estado del usuario listo para jugar (start = true)
app.post("/rooms/start", (req, res) => {
	const { rtdbRoomId, userId, name } = req.body;
	const roomRef = rtdb.ref("/rooms/" + rtdbRoomId + "/currentGame/" + userId);
	roomRef.set({ name: name, choice: "", online: true, start: true });
	res.json("Ready to play");
});

//define el estado del usuario como "no listo" para jugar
app.post("/rooms/end", (req, res) => {
	const { rtdbRoomId, userId } = req.body;
	const roomRef = rtdb.ref(
		"/rooms/" + rtdbRoomId + "/currentGame/" + userId + "/start"
	);
	roomRef.set(false);
	res.json("Not ready");
});

//envía la jugada del usuario a la rtdb
app.post("/rooms/move", (req, res) => {
	const { rtdbRoomId, userId, choice } = req.body;
	const roomRef = rtdb.ref(
		"/rooms/" + rtdbRoomId + "/currentGame/" + userId + "/choice"
	);
	roomRef.set(choice);
	res.json("You made a move");
});

//actualiza los datos del score en la rtdb
app.post("/rooms/score", (req, res) => {
	const { rtdbRoomId, userId, score } = req.body;
	const roomRef = rtdb.ref(
		"/rooms/" + rtdbRoomId + "/score/" + userId + "/score"
	);
	roomRef.set(score);
	res.json("Score updated");
});

//resetea el score de la sala a 0
app.post("/rooms/reset", (req, res) => {
	const { rtdbRoomId, userId1, userId2 } = req.body;
	const roomRef1 = rtdb.ref(
		"/rooms/" + rtdbRoomId + "/score/" + userId1 + "/score"
	);
	const roomRef2 = rtdb.ref(
		"/rooms/" + rtdbRoomId + "/score/" + userId2 + "/score"
	);
	roomRef1.set(0);
	roomRef2.set(0);
	res.json("Score reseted");
});

//guarda la jugada en la collection
// app.post("/rooms/:roomId/push", (req, res) => {
// 	const { roomId } = req.params;
// 	const { p1, p2, p1Choice, p2Choice } = req.body;
// 	const roomRef = roomsCollection.doc(roomId.toString());
// 	roomRef.update({
// 		history: fieldValue.arrayUnion({
// 			p1name: p1,
// 			p1choice: p1Choice,
// 			p2name: p2,
// 			p2choice: p2Choice,
// 		}),
// 	});
// 	res.json("History updated");
// });

//resetesa el historial de jugadas en la collection
// app.post("/rooms/:roomId/reset", (req, res) => {
// 	const { roomId } = req.params;
// 	const roomRef = roomsCollection.doc(roomId.toString());
// 	roomRef.update({
// 		history: fieldValue.delete(),
// 	});
// 	res.json("History reseted");
// });

app.use(express.static("dist"));

app.get("*", (req, res) => {
	res.sendFile(__dirname + "/dist/index.html");
});
