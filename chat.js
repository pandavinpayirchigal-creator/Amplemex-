import { getFirestore, doc, updateDoc, serverTimestamp, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = getFirestore();

// Live Typing status tracking
function updateTypingStatus(chatId, isTyping, role = "customer") {
    const chatRef = doc(db, "conversations", chatId);
    updateDoc(chatRef, {
        [`typingStatus.${role}`]: isTyping
    });
}

// Real-Time Listener for Read Receipts & Live Status
function initializeChatStream(chatId) {
    onSnapshot(doc(db, "conversations", chatId), (docSnap) => {
        if (docSnap.exists()) {
            const chatData = docSnap.data();
            
            // Handle Typing Indicators
            if (chatData.typingStatus?.admin) {
                document.getElementById("chat-typing-indicator").classList.add("visible");
            } else {
                document.getElementById("chat-typing-indicator").classList.remove("visible");
            }
            
            // Render last message read status instantly
            updateMessageStatusUI(chatData.messages);
        }
    });
}
