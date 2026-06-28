import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize App Services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// State Engine
let localProductsRegistry = [];
let shoppingCart = [];

// Fetch initial batch of products from Firestore
async function loadProductsEngine() {
    try {
        const q = query(collection(db, "products"), limit(198));
        const querySnapshot = await getDocs(q);
        localProductsRegistry = [];
        
        querySnapshot.forEach((doc) => {
            localProductsRegistry.push({ id: doc.id, ...doc.data() });
        });
        
        renderProductGrid(localProductsRegistry);
    } catch (error) {
        console.error("Data ingestion failure:", error);
    }
}

// Render Engine with Multi-Criteria Filtering
function renderProductGrid(products) {
    const grid = document.getElementById("main-product-grid");
    const countLabel = document.getElementById("product-count");
    grid.innerHTML = "";
    countLabel.innerText = products.length;

    products.forEach(prod => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div class="card-img-holder">
                <img src="${prod.images[0]}" alt="${prod.name}" style="width:100%; border-radius:12px;">
            </div>
            <h4 style="margin-top: 1rem;">${prod.name}</h4>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem;">
                <span style="color:var(--neon-glow); font-weight:700;">$${prod.price}</span>
                <button class="btn-cart-add" data-id="${prod.id}"><i class="fa-solid fa-plus"></i></button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Execution Entrypoint
document.addEventListener("DOMContentLoaded", () => {
    loadProductsEngine();
});
