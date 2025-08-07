import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

window.addEventListener("DOMContentLoaded", async () => {
  console.log("Script loaded and DOM ready");

const firebaseConfig = {
  apiKey: "AIzaSyCPuxA-JJNBYn2ud1IGiK3fViYYzlaUSTo",
  authDomain: "oriarebun-princeton.firebaseapp.com",
  projectId: "oriarebun-princeton",
  storageBucket: "oriarebun-princeton.firebasestorage.app",
  messagingSenderId: "705209377492",
  appId: "1:705209377492:web:982de37c9936ee5e6a5141",
  measurementId: "G-HLC7T126TN"
};

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const docRef = doc(db, "votes", "portfolioFeedback");

  const likeBtn = document.getElementById("likeBtn");
  const dislikeBtn = document.getElementById("dislikeBtn");
  const likeCountSpan = document.getElementById("likeCount");
  const dislikeCountSpan = document.getElementById("dislikeCount");

  if (!likeBtn || !dislikeBtn) {
    console.error("Buttons not found");
    return;
  }

  // Load current counts
  try {
    const docSnap = await getDoc(docRef);
    console.log("Fetched document:", docSnap.exists());
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Doc data:", data);
      likeCountSpan.textContent = data.likes ?? 0;
      dislikeCountSpan.textContent = data.dislikes ?? 0;
    } else {
      console.log("Doc doesn't exist. Creating...");
      await setDoc(docRef, { likes: 0, dislikes: 0 });
      likeCountSpan.textContent = 0;
      dislikeCountSpan.textContent = 0;
    }
  } catch (err) {
    console.error("Error fetching doc:", err);
  }

//   const hasVoted = localStorage.getItem("hasVoted");
//   if (hasVoted) {
//     likeBtn.disabled = true;
//     dislikeBtn.disabled = true;
//   }

likeBtn.addEventListener("click", async () => {
  const vote = localStorage.getItem("hasVoted");
  if (vote === "like") return;

  try {
    if (vote === "dislike") {
      await updateDoc(docRef, {
        dislikes: increment(-1),
        likes: increment(1),
      });
    } else {
      await updateDoc(docRef, {
        likes: increment(1),
      });
    }

    localStorage.setItem("hasVoted", "like");
    await updateVoteUI();
  } catch (err) {
    console.error("Like failed", err);
  }
});


dislikeBtn.addEventListener("click", async () => {
  const vote = localStorage.getItem("hasVoted");

  if (vote === "dislike") return; // do nothing if already disliked

  try {
    if (vote === "like") {
      // switch from like to dislike
      await updateDoc(docRef, {
        likes: increment(-1),
        dislikes: increment(1),
      });
      likeCountSpan.textContent = +likeCountSpan.textContent - 1;
    } else {
      // first time dislike
      await updateDoc(docRef, {
        dislikes: increment(1),
      });
    }

    dislikeCountSpan.textContent = +dislikeCountSpan.textContent + 1;
    localStorage.setItem("hasVoted", "dislike");
  } catch (err) {
    console.error("Failed to dislike:", err);
  }
});
async function updateVoteUI() {
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    likeCountSpan.textContent = data.likes;
    dislikeCountSpan.textContent = data.dislikes;
  }
}

});

