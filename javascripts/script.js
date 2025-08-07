  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
  import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment
  } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCPuxA-JJNBYn2ud1IGiK3fViYYzlaUSTo",
    authDomain: "oriarebun-princeton.firebaseapp.com",
    projectId: "oriarebun-princeton",
    storageBucket: "oriarebun-princeton.appspot.com",
    messagingSenderId: "705209377492",
    appId: "1:705209377492:web:982de37c9936ee5e6a5141",
    measurementId: "G-HLC7T126TN"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const docRef = doc(db, "votes", "portfolioFeedback");

  const likeBtn = document.getElementById("likeBtn");
  const dislikeBtn = document.getElementById("dislikeBtn");
  const likeCount = document.getElementById("likeCount");
  const dislikeCount = document.getElementById("dislikeCount");

  // Get vote from localStorage
  const getStoredVote = () => localStorage.getItem("portfolio_vote");
  const setStoredVote = (vote) => localStorage.setItem("portfolio_vote", vote);

  // Load initial counts
  async function loadVotes() {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      likeCount.textContent = data.likes ?? 0;
      dislikeCount.textContent = data.dislikes ?? 0;
    } else {
      await setDoc(docRef, { likes: 0, dislikes: 0 });
    }
  }

  // Update vote
  async function handleVote(type) {
    const previousVote = getStoredVote();

    if (type === "like") {
      if (previousVote === "like") return; // already liked

      await updateDoc(docRef, {
        likes: increment(1),
        ...(previousVote === "dislike" && { dislikes: increment(-1) })
      });

      setStoredVote("like");
    }

    if (type === "dislike") {
      if (previousVote === "dislike") return; // already disliked

      await updateDoc(docRef, {
        dislikes: increment(1),
        ...(previousVote === "like" && { likes: increment(-1) })
      });

      setStoredVote("dislike");
    }

    loadVotes(); // Refresh UI
  }

  likeBtn.addEventListener("click", () => handleVote("like"));
  dislikeBtn.addEventListener("click", () => handleVote("dislike"));

  window.addEventListener("DOMContentLoaded", loadVotes);