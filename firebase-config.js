// ==========================================
// AgendaPro - Firebase Configuration & Database Layer
// ==========================================

// ============================================================
// INSTRUÇÕES DE CONFIGURAÇÃO:
// 
// 1. Acesse https://console.firebase.google.com/
// 2. Clique em "Adicionar projeto" → nomeie "AgendaPro"
// 3. Desative Google Analytics (opcional) → Criar projeto
// 4. No painel, clique no ícone "</>" (Web) para registrar app
// 5. Copie as credenciais e substitua abaixo
// 6. Vá em Authentication → Sign-in method → ative "E-mail/senha"
// 7. Vá em Firestore Database → Criar banco de dados → modo teste
// 
// IMPORTANTE: As credenciais abaixo são PLACEHOLDER.
// O sistema funciona em MODO DEMO até você configurar o Firebase.
// ============================================================

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyD3DTnF2Nb0jW7lCYohHYz05qSqyvRBSgw",
    authDomain: "agendapro-bb5fd.firebaseapp.com",
    projectId: "agendapro-bb5fd",
    storageBucket: "agendapro-bb5fd.firebasestorage.app",
    messagingSenderId: "758287636683",
    appId: "1:758287636683:web:a8bdec1fceaf789853634e"
};

// ========== FIREBASE INITIALIZATION ==========
let firebaseApp = null;
let auth = null;
let db = null;
let firebaseReady = false;
let useFirebase = false;

function initFirebase() {
    try {
        // Check if config has been set up
        if (FIREBASE_CONFIG.apiKey === "SUA_API_KEY_AQUI") {
            console.log("⚠️ Firebase não configurado. Rodando em MODO DEMO (dados locais).");
            useFirebase = false;
            return false;
        }

        // Check if firebase SDK loaded
        if (typeof firebase === 'undefined') {
            console.warn("⚠️ Firebase SDK não carregou. Rodando em MODO DEMO.");
            useFirebase = false;
            return false;
        }

        firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
        auth = firebase.auth();
        db = firebase.firestore();
        
        // Enable offline persistence
        db.enablePersistence({ synchronizeTabs: true }).catch(err => {
            if (err.code === 'failed-precondition') {
                console.warn("Firestore persistence: múltiplas abas abertas");
            } else if (err.code === 'unimplemented') {
                console.warn("Firestore persistence: navegador não suporta");
            }
        });

        useFirebase = true;
        firebaseReady = true;
        console.log("✅ Firebase conectado com sucesso!");
        return true;
    } catch (error) {
        console.error("❌ Erro ao inicializar Firebase:", error);
        useFirebase = false;
        return false;
    }
}

// ========== AUTH LAYER ==========
const FirebaseAuth = {
    // Login with email/password
    async login(email, password) {
        if (!useFirebase) return { success: false, demo: true };
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            return { success: true, user: result.user };
        } catch (error) {
            return { success: false, error: getAuthErrorMessage(error.code) };
        }
    },

    // Register new user
    async register(email, password, displayName) {
        if (!useFirebase) return { success: false, demo: true };
        try {
            const result = await auth.createUserWithEmailAndPassword(email, password);
            await result.user.updateProfile({ displayName });
            return { success: true, user: result.user };
        } catch (error) {
            return { success: false, error: getAuthErrorMessage(error.code) };
        }
    },

    // Logout
    async logout() {
        if (!useFirebase) return;
        try {
            await auth.signOut();
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    },

    // Get current user
    getCurrentUser() {
        if (!useFirebase) return null;
        return auth.currentUser;
    },

    // Listen for auth state changes
    onAuthStateChanged(callback) {
        if (!useFirebase) {
            callback(null);
            return () => {};
        }
        return auth.onAuthStateChanged(callback);
    }
};

function getAuthErrorMessage(code) {
    const messages = {
        'auth/user-not-found': 'E-mail não encontrado',
        'auth/wrong-password': 'Senha incorreta',
        'auth/email-already-in-use': 'Este e-mail já está cadastrado',
        'auth/weak-password': 'Senha muito fraca (mínimo 6 caracteres)',
        'auth/invalid-email': 'E-mail inválido',
        'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos.',
        'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
        'auth/invalid-credential': 'E-mail ou senha incorretos',
    };
    return messages[code] || 'Erro na autenticação. Tente novamente.';
}

// ========== FIRESTORE DATABASE LAYER ==========
const Database = {
    // ===== GENERIC CRUD =====
    async getAll(collection) {
        if (!useFirebase) return null; // Falls back to demo data
        try {
            const snapshot = await db.collection(collection).get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error(`Erro ao buscar ${collection}:`, error);
            return null;
        }
    },

    async getById(collection, id) {
        if (!useFirebase) return null;
        try {
            const doc = await db.collection(collection).doc(id).get();
            return doc.exists ? { id: doc.id, ...doc.data() } : null;
        } catch (error) {
            console.error(`Erro ao buscar ${collection}/${id}:`, error);
            return null;
        }
    },

    async add(collection, data) {
        if (!useFirebase) return null;
        try {
            const docRef = await db.collection(collection).add({
                ...data,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { id: docRef.id, ...data };
        } catch (error) {
            console.error(`Erro ao adicionar em ${collection}:`, error);
            return null;
        }
    },

    async update(collection, id, data) {
        if (!useFirebase) return false;
        try {
            await db.collection(collection).doc(id).update({
                ...data,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error(`Erro ao atualizar ${collection}/${id}:`, error);
            return false;
        }
    },

    async delete(collection, id) {
        if (!useFirebase) return false;
        try {
            await db.collection(collection).doc(id).delete();
            return true;
        } catch (error) {
            console.error(`Erro ao excluir ${collection}/${id}:`, error);
            return false;
        }
    },

    // ===== USER PROFILE =====
    async saveUserProfile(uid, data) {
        if (!useFirebase) return false;
        try {
            await db.collection('users').doc(uid).set({
                ...data,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            return true;
        } catch (error) {
            console.error("Erro ao salvar perfil:", error);
            return false;
        }
    },

    async getUserProfile(uid) {
        if (!useFirebase) return null;
        try {
            const doc = await db.collection('users').doc(uid).get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            console.error("Erro ao buscar perfil:", error);
            return null;
        }
    },

    // ===== SEED INITIAL DATA =====
    async seedDemoData(demoData) {
        if (!useFirebase) return;
        
        const collections = ['services', 'clients', 'professionals', 'appointments', 'recurringAppointments', 'reviews', 'coupons'];
        
        for (const col of collections) {
            if (!demoData[col]) continue;
            
            // Check if collection already has data
            const existing = await db.collection(col).limit(1).get();
            if (!existing.empty) {
                console.log(`⏭️ ${col} já possui dados, pulando seed.`);
                continue;
            }
            
            console.log(`🌱 Semeando ${col}...`);
            const batch = db.batch();
            demoData[col].forEach(item => {
                const ref = db.collection(col).doc(String(item.id));
                batch.set(ref, { ...item, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
            });
            await batch.commit();
            console.log(`✅ ${col} semeado com ${demoData[col].length} itens`);
        }
    },

    // ===== LOAD ALL DATA =====
    async loadAllData() {
        if (!useFirebase) return null;
        
        try {
            const [services, clients, professionals, appointments, recurringAppointments, reviews, coupons] = await Promise.all([
                this.getAll('services'),
                this.getAll('clients'),
                this.getAll('professionals'),
                this.getAll('appointments'),
                this.getAll('recurringAppointments'),
                this.getAll('reviews'),
                this.getAll('coupons'),
            ]);

            return {
                services: services || [],
                clients: clients || [],
                professionals: professionals || [],
                appointments: appointments || [],
                recurringAppointments: recurringAppointments || [],
                reviews: reviews || [],
                coupons: coupons || [],
            };
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            return null;
        }
    },

    // ===== REAL-TIME LISTENERS =====
    onCollectionChange(collection, callback) {
        if (!useFirebase) return () => {};
        return db.collection(collection).onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(data);
        });
    }
};

// ========== INITIALIZE ON LOAD ==========
initFirebase();
