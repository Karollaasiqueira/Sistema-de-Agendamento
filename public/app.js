// ==========================================
// AgendaPro - Complete Application Logic
// ==========================================

// ========== DEMO DATA ==========
let demoData = {
    professionals: [
        { id: 1, name: 'Bruno Silva', phone: '+55 11 91111-1111', email: 'bruno@barbeariasilva.com', specialty: 'Barbeiro Senior', color: '#3b82f6', serviceIds: [1, 2, 3], commission: 45, active: true, avatar: 'BS' },
        { id: 2, name: 'Camila Rocha', phone: '+55 11 92222-2222', email: 'camila@barbeariasilva.com', specialty: 'Cabeleireira / Colorista', color: '#8b5cf6', serviceIds: [1, 4, 5], commission: 40, active: true, avatar: 'CR' },
        { id: 3, name: 'Rafael Mendes', phone: '+55 11 93333-3333', email: 'rafael@barbeariasilva.com', specialty: 'Barbeiro', color: '#10b981', serviceIds: [1, 2, 3, 4], commission: 40, active: true, avatar: 'RM' },
        { id: 4, name: 'Juliana Alves', phone: '+55 11 94444-4444', email: 'juliana@barbeariasilva.com', specialty: 'Designer de Sobrancelhas', color: '#f59e0b', serviceIds: [4], commission: 35, active: false, avatar: 'JA' }
    ],
    services: [
        { id: 1, name: 'Corte de Cabelo', description: 'Corte tradicional com máquina e tesoura', duration: 30, valueType: 'fixed', value: 50, active: true },
        { id: 2, name: 'Barba', description: 'Aparar e modelar barba', duration: 20, valueType: 'fixed', value: 30, active: true },
        { id: 3, name: 'Corte + Barba', description: 'Pacote completo', duration: 45, valueType: 'fixed', value: 70, active: true },
        { id: 4, name: 'Design de Sobrancelha', description: 'Modelagem de sobrancelha', duration: 15, valueType: 'fixed', value: 20, active: true },
        { id: 5, name: 'Luzes/Mechas', description: 'Coloração e luzes', duration: 90, valueType: 'range', valueMin: 80, valueMax: 150, active: true }
    ],
    clients: [
        { id: 1, name: 'Carlos Silva', phone: '+55 11 98765-4321', status: 'vip', totalAppointments: 15, lastVisit: '2026-02-25', created: '2025-12-10' },
        { id: 2, name: 'Maria Santos', phone: '+55 11 97654-3210', status: 'regular', totalAppointments: 3, lastVisit: '2026-02-20', created: '2026-01-15' },
        { id: 3, name: 'João Oliveira', phone: '+55 11 96543-2109', status: 'regular', totalAppointments: 7, lastVisit: '2026-02-22', created: '2025-11-05' },
        { id: 4, name: 'Ana Costa', phone: '+55 11 95432-1098', status: 'vip', totalAppointments: 22, lastVisit: '2026-02-26', created: '2025-09-20' },
        { id: 5, name: 'Pedro Souza', phone: '+55 11 94321-0987', status: 'blocked', totalAppointments: 2, lastVisit: '2026-01-10', created: '2025-12-20' }
    ],
    appointments: [
        { id: 1, clientId: 1, professionalId: 1, service: 'Corte de Cabelo', date: '2026-02-28', time: '15:00', status: 'confirmed', confirmedAt: '2026-02-27T10:00:00' },
        { id: 2, clientId: 2, professionalId: 3, service: 'Corte + Barba', date: '2026-02-28', time: '16:00', status: 'pending', createdAt: '2026-02-28T13:00:00' },
        { id: 3, clientId: 3, professionalId: 1, service: 'Barba', date: '2026-03-01', time: '10:00', status: 'confirmed', confirmedAt: '2026-02-25T14:30:00' },
        { id: 4, clientId: 4, professionalId: 2, service: 'Luzes/Mechas', date: '2026-03-01', time: '14:00', status: 'confirmed', confirmedAt: '2026-02-26T09:15:00' },
        { id: 5, clientId: 1, professionalId: 3, service: 'Corte de Cabelo', date: '2026-03-03', time: '11:00', status: 'confirmed', confirmedAt: '2026-02-28T08:00:00' }
    ],
    recurringAppointments: [
        { 
            id: 1, 
            clientId: 4, 
            professionalId: 2,
            serviceName: 'Luzes/Mechas', 
            dayOfWeek: 4,
            time: '15:00', 
            frequency: 'weekly',
            startDate: '2026-02-06',
            active: true,
            createdAt: '2026-01-15T10:00:00'
        },
        { 
            id: 2, 
            clientId: 1, 
            professionalId: 1,
            serviceName: 'Corte de Cabelo', 
            dayOfWeek: 6,
            time: '10:00', 
            frequency: 'biweekly',
            startDate: '2026-02-01',
            active: true,
            createdAt: '2026-01-20T09:00:00'
        }
    ],
    reviews: [
        { id: 1, clientId: 1, professionalId: 1, service: 'Corte de Cabelo', rating: 5, comment: 'Excelente como sempre! Corte perfeito, recomendo demais.', date: '2026-02-25', appointmentId: 1 },
        { id: 2, clientId: 4, professionalId: 2, service: 'Luzes/Mechas', rating: 5, comment: 'Amei o resultado! Ficou exatamente como eu queria.', date: '2026-02-20', appointmentId: 4 },
        { id: 3, clientId: 2, professionalId: 3, service: 'Corte + Barba', rating: 4, comment: 'Muito bom, só demorou um pouquinho mais que o esperado.', date: '2026-02-18', appointmentId: 2 },
        { id: 4, clientId: 3, professionalId: 1, service: 'Barba', rating: 5, comment: 'Barba impecável! Atendimento nota 10.', date: '2026-02-15', appointmentId: 3 },
        { id: 5, clientId: 1, professionalId: 3, service: 'Corte de Cabelo', rating: 4, comment: 'Bom corte, ambiente agradável.', date: '2026-02-10', appointmentId: 5 },
        { id: 6, clientId: 4, professionalId: 2, service: 'Design de Sobrancelha', rating: 5, comment: 'Perfeito! Muito caprichosa.', date: '2026-02-08', appointmentId: null },
        { id: 7, clientId: 3, professionalId: 1, service: 'Corte de Cabelo', rating: 3, comment: 'Foi ok, mas já tive cortes melhores aqui.', date: '2026-02-05', appointmentId: null },
        { id: 8, clientId: 2, professionalId: 3, service: 'Barba', rating: 5, comment: 'Nota 10! Profissional muito atencioso.', date: '2026-02-01', appointmentId: null },
        { id: 9, clientId: 1, professionalId: 1, service: 'Corte + Barba', rating: 4, comment: 'Ótimo serviço, preço justo.', date: '2026-01-28', appointmentId: null },
        { id: 10, clientId: 4, professionalId: 2, service: 'Luzes/Mechas', rating: 5, comment: 'Melhor profissional da cidade para luzes!', date: '2026-01-20', appointmentId: null }
    ],
    coupons: [
        { id: 1, code: 'FIEL10', description: '10% de desconto para clientes fiéis', type: 'percent', value: 10, minVisits: 5, expiry: '2026-06-30', maxUses: 50, usedCount: 12, serviceId: null, active: true, createdAt: '2026-01-01' },
        { id: 2, code: 'BARBA20', description: 'R$20 off na barba após 10 visitas', type: 'fixed', value: 20, minVisits: 10, expiry: '2026-04-30', maxUses: 30, usedCount: 5, serviceId: 2, active: true, createdAt: '2026-01-15' },
        { id: 3, code: 'VIP15', description: '15% especial para clientes VIP', type: 'percent', value: 15, minVisits: 15, expiry: '2026-12-31', maxUses: 100, usedCount: 3, serviceId: null, active: true, createdAt: '2026-02-01' },
        { id: 4, code: 'CORTE-GRATIS', description: 'Corte grátis após 20 visitas', type: 'free_service', value: 0, minVisits: 20, expiry: '2026-12-31', maxUses: 20, usedCount: 1, serviceId: 1, active: true, createdAt: '2026-02-10' },
        { id: 5, code: 'BEMVINDO', description: '5% na primeira visita', type: 'percent', value: 5, minVisits: 1, expiry: '2026-03-31', maxUses: 200, usedCount: 45, serviceId: null, active: false, createdAt: '2025-12-01' }
    ]
};

// ========== UTILITY FUNCTIONS ==========
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('toast-show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => container.removeChild(toast), 300);
    }, 3000);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatPhone(phone) {
    return phone.replace(/(\+55\s?)(\d{2})\s?(\d{5})-?(\d{4})/, '($2) $3-$4');
}

function getCurrentTime() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// ========== NAVIGATION ==========
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('open');
    document.querySelector('.sidebar-overlay').classList.toggle('open');
}

// ========== AUTH SYSTEM ==========
const defaultUsers = [
    { id: 1, name: 'Administrador', email: 'admin@barbeariasilva.com', password: '123456', role: 'admin', business: 'Barbearia Silva', avatar: 'AD' },
    { id: 2, name: 'Bruno Silva', email: 'bruno@barbeariasilva.com', password: '123456', role: 'professional', business: 'Barbearia Silva', avatar: 'BS' },
    { id: 3, name: 'Camila Rocha', email: 'camila@barbeariasilva.com', password: '123456', role: 'professional', business: 'Barbearia Silva', avatar: 'CR' }
];

let currentUser = null;
let isFirebaseMode = false;

function getUsers() {
    const saved = localStorage.getItem('agendapro-users');
    return saved ? JSON.parse(saved) : defaultUsers;
}

function saveUsers(users) {
    localStorage.setItem('agendapro-users', JSON.stringify(users));
}

function hideAllScreens() {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('register-screen').style.display = 'none';
    document.getElementById('app').style.display = 'none';
}

function showLoginScreen() {
    hideAllScreens();
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('login-email').focus();
}

function showRegisterScreen() {
    hideAllScreens();
    document.getElementById('register-screen').style.display = 'flex';
    document.getElementById('register-business').value = '';
    document.getElementById('register-name').value = '';
    document.getElementById('register-email').value = '';
    document.getElementById('register-password').value = '';
    document.getElementById('register-confirm').value = '';
    document.getElementById('register-business').focus();
}

function backToLanding() {
    hideAllScreens();
    document.getElementById('landing-page').style.display = 'block';
}

function fillLoginDemo(email, password) {
    document.getElementById('login-email').value = email;
    document.getElementById('login-password').value = password;
    showToast('Credenciais preenchidas! Clique em Entrar.', 'info');
}

function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

async function handleLogin() {
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showToast('Preencha e-mail e senha', 'error');
        return;
    }
    
    // Try Firebase first
    if (useFirebase) {
        showToast('Autenticando...', 'info');
        const result = await FirebaseAuth.login(email, password);
        if (result.success) {
            isFirebaseMode = true;
            const profile = await Database.getUserProfile(result.user.uid);
            const user = {
                id: result.user.uid,
                name: profile?.name || result.user.displayName || 'Usuário',
                email: result.user.email,
                role: profile?.role || 'admin',
                business: profile?.business || 'Meu Negócio',
                avatar: (profile?.name || result.user.displayName || 'US').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
            };
            await loginUser(user);
            return;
        } else if (!result.demo) {
            showToast(result.error, 'error');
            return;
        }
    }
    
    // Fallback to local auth
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email && u.password === password);
    
    if (!user) {
        showToast('E-mail ou senha incorretos', 'error');
        return;
    }
    
    await loginUser(user);
}

async function handleRegister() {
    const business = document.getElementById('register-business').value.trim();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim().toLowerCase();
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    
    if (!business || !name || !email || !password) {
        showToast('Preencha todos os campos', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('A senha deve ter no mínimo 6 caracteres', 'error');
        return;
    }
    
    if (password !== confirm) {
        showToast('As senhas não coincidem', 'error');
        return;
    }
    
    // Try Firebase first
    if (useFirebase) {
        showToast('Criando conta...', 'info');
        const result = await FirebaseAuth.register(email, password, name);
        if (result.success) {
            isFirebaseMode = true;
            const avatar = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
            
            // Save profile to Firestore
            await Database.saveUserProfile(result.user.uid, {
                name, email, role: 'admin', business, avatar,
                createdAt: new Date().toISOString()
            });
            
            // Seed demo data for new user
            await Database.seedDemoData(demoData);
            
            const user = { id: result.user.uid, name, email, role: 'admin', business, avatar };
            await loginUser(user);
            showToast('Conta criada com sucesso! Dados de demonstração foram adicionados.', 'success');
            return;
        } else if (!result.demo) {
            showToast(result.error, 'error');
            return;
        }
    }
    
    // Fallback to local
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email)) {
        showToast('Já existe uma conta com este e-mail', 'error');
        return;
    }
    
    const avatar = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    const newUser = { id: Date.now(), name, email, password, role: 'admin', business, avatar };
    users.push(newUser);
    saveUsers(users);
    await loginUser(newUser);
    showToast('Conta criada com sucesso! Bem-vindo(a)!', 'success');
}

async function loginUser(user) {
    currentUser = user;
    
    // Save local session as backup
    localStorage.setItem('agendapro-session', JSON.stringify({ userId: user.id, email: user.email }));
    
    // Load data from Firebase if available
    if (useFirebase && isFirebaseMode) {
        showToast('Carregando dados...', 'info');
        const firebaseData = await Database.loadAllData();
        if (firebaseData) {
            // Merge Firebase data with demoData structure
            Object.keys(firebaseData).forEach(key => {
                if (firebaseData[key] && firebaseData[key].length > 0) {
                    demoData[key] = firebaseData[key];
                }
            });
            console.log('✅ Dados carregados do Firebase');
        }
    }
    
    // Update sidebar
    updateSidebarUser(user);
    
    // Show app
    hideAllScreens();
    document.getElementById('app').style.display = 'flex';
    renderDashboard();
    
    const roleLabel = user.role === 'admin' ? 'Administrador' : 'Profissional';
    const modeLabel = isFirebaseMode ? '☁️ Online' : '💾 Local';
    showToast(`Bem-vindo(a), ${user.name.split(' ')[0]}! (${roleLabel}) ${modeLabel}`, 'success');
}

function updateSidebarUser(user) {
    document.getElementById('user-avatar').textContent = user.avatar;
    document.getElementById('user-name').textContent = user.name;
    const roleLabel = user.role === 'admin' ? 'Administrador' : 'Profissional';
    document.getElementById('user-role').textContent = roleLabel;
}

async function handleLogout() {
    if (confirm('Deseja sair do sistema?')) {
        if (useFirebase) await FirebaseAuth.logout();
        currentUser = null;
        isFirebaseMode = false;
        localStorage.removeItem('agendapro-session');
        sessionStorage.removeItem('agendapro-session');
        hideAllScreens();
        document.getElementById('landing-page').style.display = 'block';
        showToast('Você saiu do sistema. Até breve!', 'info');
    }
}

function checkExistingSession() {
    // Firebase auth state is handled in DOMContentLoaded
    // This only checks local sessions
    if (useFirebase) return false; // Let Firebase handle it
    
    const session = localStorage.getItem('agendapro-session') || sessionStorage.getItem('agendapro-session');
    if (session) {
        const { userId, email } = JSON.parse(session);
        const users = getUsers();
        const user = users.find(u => u.id === userId || u.email === email);
        if (user) {
            loginUser(user);
            return true;
        }
    }
    return false;
}

function showDemo() {
    const demoUser = { id: 0, name: 'Visitante Demo', email: 'demo@agendapro.com', role: 'admin', business: 'Barbearia Silva', avatar: 'VD' };
    currentUser = demoUser;
    isFirebaseMode = false;
    updateSidebarUser(demoUser);
    hideAllScreens();
    document.getElementById('app').style.display = 'flex';
    showToast('Modo demonstração ativado! Explore o sistema.', 'success');
    renderDashboard();
}

function exitDemo() {
    handleLogout();
}

function scrollToFeatures() {
    document.getElementById('features-section').scrollIntoView({ behavior: 'smooth' });
}

// ========== DATA PERSISTENCE HELPER ==========
async function persistData(collection, id, data) {
    if (useFirebase && isFirebaseMode) {
        if (id) {
            await Database.update(collection, String(id), data);
        } else {
            const result = await Database.add(collection, data);
            return result ? result.id : null;
        }
    }
    return id;
}

async function persistDelete(collection, id) {
    if (useFirebase && isFirebaseMode) {
        await Database.delete(collection, String(id));
    }
}

function switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    
    // Show selected view
    document.getElementById(`view-${viewName}`).classList.add('active');
    document.querySelector(`.nav-item[data-view="${viewName}"]`).classList.add('active');
    
    // Close sidebar on mobile
    document.querySelector('.sidebar').classList.remove('open');
    document.querySelector('.sidebar-overlay').classList.remove('open');
    
    // Render view content
    switch(viewName) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'whatsapp':
            // WhatsApp view is always ready
            break;
        case 'services':
            renderServices();
            break;
        case 'professionals':
            renderProfessionals();
            break;
        case 'clients':
            renderClients();
            break;
        case 'calendar':
            renderCalendar();
            break;
        case 'recurring':
            renderRecurring();
            break;
        case 'reviews':
            renderReviews();
            break;
        case 'loyalty':
            renderLoyalty();
            break;
        case 'reports':
            renderReports();
            break;
        case 'settings':
            // Settings are static HTML
            break;
    }
}

// Event listener for navigation
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            switchView(view);
        });
    });
});

// ========== DASHBOARD ==========
function renderDashboard() {
    // Update stats dynamically
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = demoData.appointments.filter(a => a.date === today);
    const totalClients = demoData.clients.length;
    const avgRating = demoData.reviews.length > 0 
        ? (demoData.reviews.reduce((sum, r) => sum + r.rating, 0) / demoData.reviews.length).toFixed(1)
        : '0.0';
    
    // Update stat cards
    const statValues = document.querySelectorAll('.stat-card .stat-value');
    if (statValues.length >= 4) {
        statValues[0].textContent = todayAppointments.length || '0';
        statValues[2].textContent = totalClients;
        statValues[3].textContent = avgRating;
    }
    
    renderUpcomingAppointments();
    renderServicesRanking();
    renderActivityFeed();
    renderMonthlyChart();
}

function renderUpcomingAppointments() {
    const container = document.getElementById('upcoming-appointments');
    const today = new Date().toISOString().split('T')[0];
    const upcoming = demoData.appointments
        .filter(apt => apt.date >= today)
        .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time))
        .slice(0, 5);
    
    if (upcoming.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhum agendamento próximo</p>';
        return;
    }
    
    container.innerHTML = upcoming.map(apt => {
        const client = demoData.clients.find(c => c.id === apt.clientId);
        const professional = demoData.professionals.find(p => p.id === apt.professionalId);
        const statusClass = apt.status === 'confirmed' ? 'success' : apt.status === 'pending' ? 'warning' : 'default';
        const statusText = apt.status === 'confirmed' ? 'Confirmado' : apt.status === 'pending' ? 'Pendente' : 'Agendado';
        const profName = professional ? professional.name.split(' ')[0] : '';
        const profColor = professional ? professional.color : 'var(--gray)';
        
        return `
            <div class="appointment-item">
                <div class="appointment-time">
                    <strong>${apt.time}</strong>
                    <span>${new Date(apt.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                </div>
                <div class="appointment-details">
                    <strong>${client.name}</strong>
                    <span>${apt.service}${profName ? ` · <span style="color:${profColor};font-weight:600">${profName}</span>` : ''}</span>
                </div>
                <span class="badge badge-${statusClass}">${statusText}</span>
            </div>
        `;
    }).join('');
}

function renderServicesRanking() {
    const container = document.getElementById('services-ranking');
    const serviceCount = {};
    
    demoData.appointments.forEach(apt => {
        serviceCount[apt.service] = (serviceCount[apt.service] || 0) + 1;
    });
    
    const sorted = Object.entries(serviceCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const total = sorted.reduce((sum, [, count]) => sum + count, 0);
    
    container.innerHTML = sorted.map(([service, count], index) => {
        const percentage = Math.round((count / total) * 100);
        return `
            <div class="ranking-item">
                <div class="ranking-position">${index + 1}</div>
                <div class="ranking-details">
                    <strong>${service}</strong>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
                <div class="ranking-count">${count}</div>
            </div>
        `;
    }).join('');
}

function renderActivityFeed() {
    const container = document.getElementById('activity-feed');
    const activities = [
        { icon: 'calendar-check', text: 'Novo agendamento de Maria Santos', time: '5 min atrás', type: 'success' },
        { icon: 'times-circle', text: 'Cancelamento de Pedro Souza', time: '23 min atrás', type: 'danger' },
        { icon: 'clock', text: 'João Oliveira avisou atraso', time: '1 hora atrás', type: 'warning' },
        { icon: 'star', text: 'Nova avaliação 5★ de Ana Costa', time: '2 horas atrás', type: 'success' },
        { icon: 'bell', text: 'Lembrete enviado para Carlos Silva', time: '3 horas atrás', type: 'info' }
    ];
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon activity-${activity.type}">
                <i class="fas fa-${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <p>${activity.text}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        </div>
    `).join('');
}

function renderMonthlyChart() {
    const ctx = document.getElementById('monthly-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
            datasets: [{
                label: 'Agendamentos',
                data: [45, 52, 48, 61],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// ========== WHATSAPP BOT SIMULATOR ==========
let chatState = {
    currentFlow: null,
    step: 0,
    userData: {},
    conversationStarted: false
};

const botFlows = {
    scheduling: [
        {
            bot: 'Ótimo! Vamos agendar seu horário. 📅\n\nPrimeiro, qual serviço você deseja?',
            quickReplies: ['Corte de Cabelo', 'Barba', 'Corte + Barba', 'Design de Sobrancelha']
        },
        {
            bot: 'Perfeito! Agora escolha uma data disponível:',
            quickReplies: ['Hoje 28/02', 'Amanhã 01/03', '02/03 (segunda)', '03/03 (terça)']
        },
        {
            bot: 'Horários disponíveis para esse dia:',
            quickReplies: ['09:00', '10:30', '14:00', '15:30', '17:00']
        },
        {
            bot: '⏱️ Atenção: Você tem 30 minutos para confirmar este agendamento.\n\nEste serviço requer pagamento antecipado de 30% (R$ 15,00 via Pix).\n\n💳 Link de pagamento: [pix.me/exemplo]\n\nO agendamento será confirmado após o pagamento. Caso não confirme em 30 minutos, o horário será liberado automaticamente.',
            quickReplies: ['✅ Paguei', '❌ Cancelar']
        },
        {
            bot: '✅ Pagamento confirmado!\n\n📋 Resumo do agendamento:\n• Serviço: {service}\n• Data: {date}\n• Horário: {time}\n• Local: Rua das Flores, 123\n\n🔔 Você receberá lembretes 24h e 2h antes.\n\nAté breve! 😊',
            quickReplies: null,
            final: true
        }
    ],
    cancellation: [
        {
            bot: 'Entendo que você deseja cancelar um agendamento. 📅\n\nPor favor, informe o motivo do cancelamento:',
            quickReplies: ['Emergência', 'Mudança de planos', 'Outro compromisso', 'Outro motivo']
        },
        {
            bot: '✅ Agendamento cancelado com sucesso.\n\nComo o cancelamento foi feito com mais de 2h de antecedência, o valor do sinal será reembolsado em até 24h úteis.\n\n💰 Reembolso: R$ 15,00\n\nAté a próxima! 😊',
            quickReplies: null,
            final: true
        }
    ],
    delay: [
        {
            bot: 'Entendi que você está atrasado(a). ⏰\n\nQuanto tempo de atraso você terá aproximadamente?',
            quickReplies: ['5-10 minutos', '10-15 minutos', '15-30 minutos', 'Mais de 30 minutos']
        },
        {
            bot: '⏳ Aguarde um momento...\n\nEstou verificando com o profissional se ele pode aguardar.',
            quickReplies: null
        },
        {
            bot: '✅ O profissional confirmou que pode aguardar!\n\nPor favor, chegue o quanto antes.\n\nEndereço: Rua das Flores, 123 - São Paulo, SP',
            quickReplies: null,
            final: true
        }
    ],
    handoff: [
        {
            bot: '👤 Entendido! Vou transferir você para um atendente humano.\n\n⏳ Por favor, aguarde um momento...',
            quickReplies: null
        },
        {
            bot: '🟢 Conectado com atendente!\n\n*Bruno Silva* está online agora.\n\nOlá! Sou o Bruno, em que posso ajudar?',
            quickReplies: null,
            final: true
        }
    ]
};

function startFlow(flowName) {
    chatState = {
        currentFlow: flowName,
        step: 0,
        userData: {},
        conversationStarted: true
    };
    
    // Clear quick replies
    document.getElementById('quick-replies').innerHTML = '';
    
    // Send bot message
    const flow = botFlows[flowName][0];
    sendBotMessage(flow.bot, flow.quickReplies);
}

function resetChat() {
    const container = document.getElementById('chat-messages');
    container.innerHTML = `
        <div class="chat-date">Hoje</div>
        <div class="message bot">
            <div class="message-bubble">
                <p>Olá! 👋 Bem-vindo à <strong>Barbearia Silva</strong>.</p>
                <p>Sou o assistente virtual e estou aqui para ajudar!</p>
                <p>O que deseja fazer?</p>
            </div>
            <div class="message-time">${getCurrentTime()}</div>
        </div>
    `;
    
    document.getElementById('quick-replies').innerHTML = `
        <button class="quick-reply" onclick="sendMessage('Agendar horário')">
            📅 Agendar horário
        </button>
        <button class="quick-reply" onclick="sendMessage('Cancelar agendamento')">
            ❌ Cancelar agendamento
        </button>
        <button class="quick-reply" onclick="sendMessage('Falar com atendente')">
            👤 Falar com atendente
        </button>
    `;
    
    chatState = {
        currentFlow: null,
        step: 0,
        userData: {},
        conversationStarted: false
    };
    
    showToast('Chat resetado!', 'info');
}

function sendMessage(text) {
    const container = document.getElementById('chat-messages');
    
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.innerHTML = `
        <div class="message-bubble">${text}</div>
        <div class="message-time">${getCurrentTime()}</div>
    `;
    container.appendChild(userMsg);
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
    
    // Clear input
    document.getElementById('message-input').value = '';
    
    // Process user input
    processUserMessage(text);
}

function sendUserMessage() {
    const input = document.getElementById('message-input');
    const text = input.value.trim();
    
    if (text) {
        sendMessage(text);
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendUserMessage();
    }
}

function processUserMessage(text) {
    // Clear quick replies
    document.getElementById('quick-replies').innerHTML = '';
    
    // Determine flow based on message
    if (!chatState.conversationStarted) {
        if (text.toLowerCase().includes('agendar')) {
            startFlow('scheduling');
        } else if (text.toLowerCase().includes('cancelar')) {
            startFlow('cancellation');
        } else if (text.toLowerCase().includes('atendente') || text.toLowerCase().includes('humano')) {
            startFlow('handoff');
        } else if (text.toLowerCase().includes('atraso')) {
            startFlow('delay');
        } else {
            // Default response
            setTimeout(() => {
                sendBotMessage('Desculpe, não entendi. 🤔\n\nPor favor, escolha uma das opções abaixo:', 
                    ['📅 Agendar', '❌ Cancelar', '👤 Atendente']);
            }, 1000);
        }
    } else {
        // Continue current flow
        advanceFlow(text);
    }
}

function advanceFlow(userInput) {
    if (!chatState.currentFlow) return;
    
    // Store user data
    const flowSteps = ['service', 'date', 'time', 'payment', 'reason'];
    if (chatState.step < flowSteps.length) {
        chatState.userData[flowSteps[chatState.step]] = userInput;
    }
    
    chatState.step++;
    const flow = botFlows[chatState.currentFlow];
    
    if (chatState.step < flow.length) {
        const nextStep = flow[chatState.step];
        let message = nextStep.bot;
        
        // Replace placeholders
        message = message
            .replace('{service}', chatState.userData.service || 'Serviço')
            .replace('{date}', chatState.userData.date || 'Data')
            .replace('{time}', chatState.userData.time || 'Horário');
        
        setTimeout(() => {
            sendBotMessage(message, nextStep.quickReplies);
            
            if (nextStep.final) {
                chatState.conversationStarted = false;
            }
        }, 1500);
    } else {
        // Flow completed
        chatState.conversationStarted = false;
    }
}

function sendBotMessage(text, quickReplies = null) {
    const container = document.getElementById('chat-messages');
    
    // Show typing indicator
    const typing = document.createElement('div');
    typing.className = 'message bot';
    typing.innerHTML = `
        <div class="message-bubble typing-indicator">
            <span></span><span></span><span></span>
        </div>
    `;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
    
    // After delay, replace with actual message
    setTimeout(() => {
        container.removeChild(typing);
        
        const botMsg = document.createElement('div');
        botMsg.className = 'message bot';
        botMsg.innerHTML = `
            <div class="message-bubble">${text.replace(/\n/g, '<br>')}</div>
            <div class="message-time">${getCurrentTime()}</div>
        `;
        container.appendChild(botMsg);
        container.scrollTop = container.scrollHeight;
        
        // Show quick replies if provided
        if (quickReplies) {
            const quickRepliesContainer = document.getElementById('quick-replies');
            quickRepliesContainer.innerHTML = quickReplies.map(reply => 
                `<button class="quick-reply" onclick="sendMessage('${reply}')">${reply}</button>`
            ).join('');
        }
    }, 1500);
}

// ========== SERVICES MANAGEMENT ==========
function renderServices() {
    const container = document.getElementById('services-grid');
    
    container.innerHTML = demoData.services.map(service => {
        const valueDisplay = service.valueType === 'fixed' 
            ? formatCurrency(service.value)
            : `${formatCurrency(service.valueMin)} - ${formatCurrency(service.valueMax)}`;
        
        const statusClass = service.active ? 'success' : 'danger';
        const statusText = service.active ? 'Ativo' : 'Inativo';
        
        return `
            <div class="service-card">
                <div class="service-header">
                    <h3>${service.name}</h3>
                    <span class="badge badge-${statusClass}">${statusText}</span>
                </div>
                <p class="service-description">${service.description}</p>
                <div class="service-info">
                    <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <span>${service.duration} min</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>${valueDisplay}</span>
                    </div>
                </div>
                <div class="service-actions">
                    <button class="btn-icon" onclick="editService(${service.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="toggleServiceStatus(${service.id})" title="${service.active ? 'Desativar' : 'Ativar'}">
                        <i class="fas fa-${service.active ? 'eye-slash' : 'eye'}"></i>
                    </button>
                    <button class="btn-icon btn-danger" onclick="deleteService(${service.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

let editingServiceId = null;

function openServiceModal(serviceId = null) {
    const modal = document.getElementById('service-modal');
    const title = document.getElementById('modal-title');
    editingServiceId = serviceId;
    
    if (serviceId) {
        const service = demoData.services.find(s => s.id === serviceId);
        title.textContent = 'Editar Serviço';
        
        document.getElementById('service-name').value = service.name;
        document.getElementById('service-description').value = service.description;
        document.getElementById('service-duration').value = service.duration;
        document.getElementById('service-value-type').value = service.valueType;
        document.getElementById('service-active').checked = service.active;
        
        toggleValueInputs();
        
        if (service.valueType === 'fixed') {
            document.getElementById('service-value').value = service.value;
        } else {
            document.getElementById('service-value-min').value = service.valueMin;
            document.getElementById('service-value-max').value = service.valueMax;
        }
    } else {
        title.textContent = 'Novo Serviço';
        document.getElementById('service-name').value = '';
        document.getElementById('service-description').value = '';
        document.getElementById('service-duration').value = 30;
        document.getElementById('service-value-type').value = 'fixed';
        document.getElementById('service-value').value = 50;
        document.getElementById('service-active').checked = true;
        toggleValueInputs();
    }
    
    modal.style.display = 'flex';
}

function closeServiceModal() {
    document.getElementById('service-modal').style.display = 'none';
}

function toggleValueInputs() {
    const type = document.getElementById('service-value-type').value;
    const valueInputs = document.getElementById('value-inputs');
    const rangeInputs = document.getElementById('range-inputs');
    
    if (type === 'fixed') {
        valueInputs.style.display = 'flex';
        rangeInputs.style.display = 'none';
    } else {
        valueInputs.style.display = 'none';
        rangeInputs.style.display = 'flex';
    }
}

async function saveService() {
    const name = document.getElementById('service-name').value.trim();
    const description = document.getElementById('service-description').value.trim();
    const duration = parseInt(document.getElementById('service-duration').value);
    const valueType = document.getElementById('service-value-type').value;
    const active = document.getElementById('service-active').checked;
    
    if (!name) {
        showToast('Por favor, informe o nome do serviço', 'error');
        return;
    }
    
    if (editingServiceId) {
        // Update existing service
        const service = demoData.services.find(s => s.id === editingServiceId);
        if (service) {
            service.name = name;
            service.description = description;
            service.duration = duration;
            service.valueType = valueType;
            service.active = active;
            
            if (valueType === 'fixed') {
                service.value = parseFloat(document.getElementById('service-value').value);
                delete service.valueMin;
                delete service.valueMax;
            } else {
                service.valueMin = parseFloat(document.getElementById('service-value-min').value);
                service.valueMax = parseFloat(document.getElementById('service-value-max').value);
                delete service.value;
            }
            
            showToast('Serviço atualizado com sucesso!', 'success');
            await persistData('services', editingServiceId, service);
        }
    } else {
        // Create new service
        const service = {
            id: Date.now(),
            name,
            description,
            duration,
            valueType,
            active
        };
        
        if (valueType === 'fixed') {
            service.value = parseFloat(document.getElementById('service-value').value);
        } else {
            service.valueMin = parseFloat(document.getElementById('service-value-min').value);
            service.valueMax = parseFloat(document.getElementById('service-value-max').value);
        }
        
        demoData.services.push(service);
        await persistData('services', null, service);
        showToast('Serviço criado com sucesso!', 'success');
    }
    
    editingServiceId = null;
    renderServices();
    closeServiceModal();
}

function editService(id) {
    openServiceModal(id);
}

function toggleServiceStatus(id) {
    const service = demoData.services.find(s => s.id === id);
    service.active = !service.active;
    renderServices();
    showToast(`Serviço ${service.active ? 'ativado' : 'desativado'} com sucesso!`, 'success');
}

function deleteService(id) {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
        demoData.services = demoData.services.filter(s => s.id !== id);
        persistDelete('services', id);
        renderServices();
        showToast('Serviço excluído com sucesso!', 'success');
    }
}

// ========== CLIENTS MANAGEMENT ==========
function renderClients() {
    const tbody = document.getElementById('clients-tbody');
    const searchTerm = document.getElementById('client-search').value.toLowerCase();
    const filter = document.getElementById('client-filter').value;
    
    let filtered = demoData.clients;
    
    if (searchTerm) {
        filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(searchTerm) || 
            c.phone.includes(searchTerm)
        );
    }
    
    if (filter !== 'all') {
        filtered = filtered.filter(c => c.status === filter);
    }
    
    tbody.innerHTML = filtered.map(client => {
        const statusClass = client.status === 'vip' ? 'success' : client.status === 'blocked' ? 'danger' : 'default';
        const statusText = client.status === 'vip' ? 'VIP' : client.status === 'blocked' ? 'Bloqueado' : 'Regular';
        const lastVisit = new Date(client.lastVisit).toLocaleDateString('pt-BR');
        
        return `
            <tr>
                <td><strong>${client.name}</strong></td>
                <td>${formatPhone(client.phone)}</td>
                <td><span class="badge badge-${statusClass}">${statusText}</span></td>
                <td>${client.totalAppointments}</td>
                <td>${lastVisit}</td>
                <td>
                    <button class="btn-icon" onclick="viewClient(${client.id})" title="Ver detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="editClient(${client.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function filterClients() {
    renderClients();
}

function viewClient(id) {
    const client = demoData.clients.find(c => c.id === id);
    if (!client) return;
    
    const clientAppointments = demoData.appointments.filter(a => a.clientId === id);
    const statusClass = client.status === 'vip' ? 'success' : client.status === 'blocked' ? 'danger' : 'default';
    const statusText = client.status === 'vip' ? 'VIP' : client.status === 'blocked' ? 'Bloqueado' : 'Regular';
    
    const appointmentsHTML = clientAppointments.length > 0 
        ? clientAppointments.map(apt => {
            const aptStatusClass = apt.status === 'confirmed' ? 'success' : apt.status === 'pending' ? 'warning' : 'danger';
            const aptStatusText = apt.status === 'confirmed' ? 'Confirmado' : apt.status === 'pending' ? 'Pendente' : 'Cancelado';
            return `
                <div class="appointment-item">
                    <div class="appointment-time">
                        <strong>${apt.time}</strong>
                        <span>${new Date(apt.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div class="appointment-details">
                        <strong>${apt.service}</strong>
                    </div>
                    <span class="badge badge-${aptStatusClass}">${aptStatusText}</span>
                </div>
            `;
        }).join('')
        : '<p class="empty-state">Nenhum agendamento encontrado</p>';
    
    // Create and show modal
    let modal = document.getElementById('client-detail-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'client-detail-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-user-circle"></i> ${client.name}</h2>
                <button class="btn-close" onclick="closeClientDetailModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="client-detail-grid">
                    <div class="detail-section">
                        <h4>Informações</h4>
                        <div class="detail-item"><i class="fas fa-phone"></i> <span>${formatPhone(client.phone)}</span></div>
                        <div class="detail-item"><i class="fas fa-tag"></i> <span class="badge badge-${statusClass}">${statusText}</span></div>
                        <div class="detail-item"><i class="fas fa-calendar-plus"></i> <span>Cliente desde ${new Date(client.created).toLocaleDateString('pt-BR')}</span></div>
                        <div class="detail-item"><i class="fas fa-calendar-check"></i> <span>${client.totalAppointments} agendamentos</span></div>
                        <div class="detail-item"><i class="fas fa-clock"></i> <span>Última visita: ${new Date(client.lastVisit).toLocaleDateString('pt-BR')}</span></div>
                    </div>
                    <div class="detail-section">
                        <h4>Histórico de Agendamentos</h4>
                        <div class="appointments-list">${appointmentsHTML}</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeClientDetailModal()">Fechar</button>
                <button class="btn-primary" onclick="closeClientDetailModal(); editClient(${client.id});">
                    <i class="fas fa-edit"></i> Editar Cliente
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function closeClientDetailModal() {
    const modal = document.getElementById('client-detail-modal');
    if (modal) modal.style.display = 'none';
}

function editClient(id) {
    const client = demoData.clients.find(c => c.id === id);
    if (!client) return;
    
    let modal = document.getElementById('client-edit-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'client-edit-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Editar Cliente</h2>
                <button class="btn-close" onclick="closeClientEditModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Nome</label>
                    <input type="text" id="edit-client-name" value="${client.name}">
                </div>
                <div class="form-group">
                    <label>Telefone</label>
                    <input type="tel" id="edit-client-phone" value="${client.phone}">
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select id="edit-client-status">
                        <option value="regular" ${client.status === 'regular' ? 'selected' : ''}>Regular</option>
                        <option value="vip" ${client.status === 'vip' ? 'selected' : ''}>VIP</option>
                        <option value="blocked" ${client.status === 'blocked' ? 'selected' : ''}>Bloqueado</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeClientEditModal()">Cancelar</button>
                <button class="btn-primary" onclick="saveClientEdit(${client.id})">Salvar</button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function closeClientEditModal() {
    const modal = document.getElementById('client-edit-modal');
    if (modal) modal.style.display = 'none';
}

async function saveClientEdit(id) {
    const client = demoData.clients.find(c => c.id === id);
    if (!client) return;
    
    const name = document.getElementById('edit-client-name').value.trim();
    const phone = document.getElementById('edit-client-phone').value.trim();
    const status = document.getElementById('edit-client-status').value;
    
    if (!name || !phone) {
        showToast('Por favor, preencha nome e telefone', 'error');
        return;
    }
    
    client.name = name;
    client.phone = phone;
    client.status = status;
    
    await persistData('clients', id, { name, phone, status });
    
    closeClientEditModal();
    renderClients();
    showToast(`Cliente ${name} atualizado com sucesso!`, 'success');
}

// ========== CALENDAR ==========
let calendarState = {
    year: new Date().getFullYear(),
    month: new Date().getMonth()
};

function renderCalendar() {
    const container = document.getElementById('calendar-grid');
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const today = new Date();
    const year = calendarState.year;
    const month = calendarState.month;
    
    document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();
    
    let html = '<div class="calendar-header">';
    ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(day => {
        html += `<div class="calendar-day-name">${day}</div>`;
    });
    html += '</div><div class="calendar-days">';
    
    // Empty cells before first day
    for (let i = 0; i < startDay; i++) {
        html += '<div class="calendar-cell empty"></div>';
    }
    
    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const appointments = demoData.appointments.filter(apt => apt.date === date);
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        
        html += `
            <div class="calendar-cell ${isToday ? 'today' : ''}">
                <div class="cell-date">${day}</div>
                ${appointments.map(apt => {
                    const professional = demoData.professionals.find(p => p.id === apt.professionalId);
                    const bgColor = professional ? professional.color : (apt.status === 'confirmed' ? 'var(--primary)' : apt.status === 'pending' ? 'var(--warning)' : 'var(--gray)');
                    return `<div class="cell-appointment" style="background:${bgColor}">${apt.time} - ${apt.service}</div>`;
                }).join('')}
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

function previousMonth() {
    calendarState.month--;
    if (calendarState.month < 0) {
        calendarState.month = 11;
        calendarState.year--;
    }
    renderCalendar();
}

function nextMonth() {
    calendarState.month++;
    if (calendarState.month > 11) {
        calendarState.month = 0;
        calendarState.year++;
    }
    renderCalendar();
}

// ========== REPORTS ==========
function renderReports() {
    renderStatusChart();
    renderRevenueChart();
    renderPeakHoursChart();
    renderCancellationChart();
}

function renderStatusChart() {
    const ctx = document.getElementById('status-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Confirmado', 'Pendente', 'Cancelado'],
            datasets: [{
                data: [18, 4, 2],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function renderRevenueChart() {
    const ctx = document.getElementById('revenue-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [{
                label: 'Receita (R$)',
                data: [3200, 4100, 3800, 4500, 5200, 4800],
                backgroundColor: '#3b82f6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderPeakHoursChart() {
    const ctx = document.getElementById('peak-hours-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['9h', '10h', '11h', '12h', '14h', '15h', '16h', '17h', '18h'],
            datasets: [{
                label: 'Agendamentos',
                data: [3, 5, 7, 4, 6, 8, 9, 7, 5],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderCancellationChart() {
    const ctx = document.getElementById('cancellation-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [{
                label: 'Taxa (%)',
                data: [12, 10.5, 9.2, 8.8, 10.4, 8.3],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 15
                }
            }
        }
    });
}

// ========== PROFESSIONALS ==========
let editingProfessionalId = null;

function renderProfessionals() {
    renderProfessionalsStats();
    renderProfessionalsGrid();
}

function renderProfessionalsStats() {
    const container = document.getElementById('professionals-stats');
    const profs = demoData.professionals;
    const activeCount = profs.filter(p => p.active).length;
    const totalAppointments = demoData.appointments.length;
    
    // Calculate top professional
    const profAppCount = {};
    demoData.appointments.forEach(a => {
        if (a.professionalId) {
            profAppCount[a.professionalId] = (profAppCount[a.professionalId] || 0) + 1;
        }
    });
    const topProfId = Object.entries(profAppCount).sort((a, b) => b[1] - a[1])[0];
    const topProf = topProfId ? demoData.professionals.find(p => p.id === parseInt(topProfId[0])) : null;
    
    // Calculate avg rating per professional
    const profRatings = {};
    demoData.reviews.forEach(r => {
        if (r.professionalId) {
            if (!profRatings[r.professionalId]) profRatings[r.professionalId] = { sum: 0, count: 0 };
            profRatings[r.professionalId].sum += r.rating;
            profRatings[r.professionalId].count++;
        }
    });
    
    container.innerHTML = `
        <div class="stats-grid" style="margin-bottom:1.5rem">
            <div class="stat-card">
                <div class="stat-icon blue"><i class="fas fa-user-tie"></i></div>
                <div class="stat-info">
                    <div class="stat-value">${profs.length}</div>
                    <div class="stat-label">Total Profissionais</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
                <div class="stat-info">
                    <div class="stat-value">${activeCount}</div>
                    <div class="stat-label">Ativos</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orange"><i class="fas fa-trophy"></i></div>
                <div class="stat-info">
                    <div class="stat-value">${topProf ? topProf.name.split(' ')[0] : '-'}</div>
                    <div class="stat-label">Mais Agendamentos</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon purple"><i class="fas fa-calendar-check"></i></div>
                <div class="stat-info">
                    <div class="stat-value">${totalAppointments}</div>
                    <div class="stat-label">Atendimentos Total</div>
                </div>
            </div>
        </div>
    `;
}

function renderProfessionalsGrid() {
    const container = document.getElementById('professionals-grid');
    
    if (demoData.professionals.length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhum profissional cadastrado</div>';
        return;
    }
    
    container.innerHTML = demoData.professionals.map(prof => {
        const services = prof.serviceIds.map(sid => {
            const s = demoData.services.find(sv => sv.id === sid);
            return s ? s.name : '';
        }).filter(Boolean);
        
        const appointments = demoData.appointments.filter(a => a.professionalId === prof.id);
        const reviews = demoData.reviews.filter(r => r.professionalId === prof.id);
        const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '-';
        
        const statusClass = prof.active ? 'success' : 'danger';
        const statusText = prof.active ? 'Ativo' : 'Inativo';
        
        return `
            <div class="professional-card" style="border-left: 4px solid ${prof.color}">
                <div class="prof-header">
                    <div class="prof-identity">
                        <div class="prof-avatar" style="background:${prof.color}">${prof.avatar}</div>
                        <div>
                            <strong>${prof.name}</strong>
                            <span class="prof-specialty">${prof.specialty}</span>
                        </div>
                    </div>
                    <span class="badge badge-${statusClass}">${statusText}</span>
                </div>
                <div class="prof-services">
                    ${services.map(s => `<span class="prof-service-tag">${s}</span>`).join('')}
                </div>
                <div class="prof-metrics">
                    <div class="prof-metric">
                        <i class="fas fa-calendar-check"></i>
                        <span>${appointments.length} atendimentos</span>
                    </div>
                    <div class="prof-metric">
                        <i class="fas fa-star" style="color:#f59e0b"></i>
                        <span>${avgRating} ${reviews.length > 0 ? `(${reviews.length})` : ''}</span>
                    </div>
                    <div class="prof-metric">
                        <i class="fas fa-percent"></i>
                        <span>${prof.commission}% comissão</span>
                    </div>
                </div>
                <div class="prof-contact">
                    <span><i class="fas fa-phone"></i> ${formatPhone(prof.phone)}</span>
                    <span><i class="fas fa-envelope"></i> ${prof.email}</span>
                </div>
                <div class="prof-actions">
                    <button class="btn-icon" onclick="editProfessional(${prof.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="toggleProfessionalStatus(${prof.id})" title="${prof.active ? 'Desativar' : 'Ativar'}">
                        <i class="fas fa-${prof.active ? 'eye-slash' : 'eye'}"></i>
                    </button>
                    <button class="btn-icon btn-danger" onclick="deleteProfessional(${prof.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function openProfessionalModal(profId = null) {
    const modal = document.getElementById('professional-modal');
    const title = document.getElementById('professional-modal-title');
    editingProfessionalId = profId;
    
    // Populate services checkboxes
    const checkboxContainer = document.getElementById('prof-services-checkboxes');
    checkboxContainer.innerHTML = demoData.services.filter(s => s.active).map(s => `
        <label class="checkbox-label">
            <input type="checkbox" value="${s.id}" class="prof-service-cb">
            ${s.name}
        </label>
    `).join('');
    
    if (profId) {
        const prof = demoData.professionals.find(p => p.id === profId);
        title.textContent = 'Editar Profissional';
        document.getElementById('prof-name').value = prof.name;
        document.getElementById('prof-phone').value = prof.phone;
        document.getElementById('prof-email').value = prof.email;
        document.getElementById('prof-specialty').value = prof.specialty;
        document.getElementById('prof-color').value = prof.color;
        document.getElementById('prof-commission').value = prof.commission;
        document.getElementById('prof-active').checked = prof.active;
        
        // Check services
        document.querySelectorAll('.prof-service-cb').forEach(cb => {
            cb.checked = prof.serviceIds.includes(parseInt(cb.value));
        });
    } else {
        title.textContent = 'Novo Profissional';
        document.getElementById('prof-name').value = '';
        document.getElementById('prof-phone').value = '';
        document.getElementById('prof-email').value = '';
        document.getElementById('prof-specialty').value = '';
        document.getElementById('prof-color').value = '#3b82f6';
        document.getElementById('prof-commission').value = 40;
        document.getElementById('prof-active').checked = true;
        document.querySelectorAll('.prof-service-cb').forEach(cb => cb.checked = false);
    }
    
    modal.style.display = 'flex';
}

function closeProfessionalModal() {
    document.getElementById('professional-modal').style.display = 'none';
    editingProfessionalId = null;
}

async function saveProfessional() {
    const name = document.getElementById('prof-name').value.trim();
    const phone = document.getElementById('prof-phone').value.trim();
    const email = document.getElementById('prof-email').value.trim();
    const specialty = document.getElementById('prof-specialty').value.trim();
    const color = document.getElementById('prof-color').value;
    const commission = parseInt(document.getElementById('prof-commission').value);
    const active = document.getElementById('prof-active').checked;
    const serviceIds = Array.from(document.querySelectorAll('.prof-service-cb:checked')).map(cb => parseInt(cb.value));
    
    if (!name) {
        showToast('Por favor, informe o nome do profissional', 'error');
        return;
    }
    
    if (serviceIds.length === 0) {
        showToast('Selecione ao menos um serviço', 'error');
        return;
    }
    
    const avatar = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    
    if (editingProfessionalId) {
        const prof = demoData.professionals.find(p => p.id === editingProfessionalId);
        if (prof) {
            Object.assign(prof, { name, phone, email, specialty, color, commission, active, serviceIds, avatar });
            await persistData('professionals', editingProfessionalId, prof);
            showToast(`Profissional ${name} atualizado!`, 'success');
        }
    } else {
        const newProf = { id: Date.now(), name, phone, email, specialty, color, commission, active, serviceIds, avatar };
        demoData.professionals.push(newProf);
        await persistData('professionals', null, newProf);
        showToast(`Profissional ${name} adicionado!`, 'success');
    }
    
    closeProfessionalModal();
    renderProfessionals();
}

function editProfessional(id) {
    openProfessionalModal(id);
}

function toggleProfessionalStatus(id) {
    const prof = demoData.professionals.find(p => p.id === id);
    prof.active = !prof.active;
    renderProfessionals();
    showToast(`${prof.name} ${prof.active ? 'ativado' : 'desativado'}!`, 'success');
}

function deleteProfessional(id) {
    const prof = demoData.professionals.find(p => p.id === id);
    if (confirm(`Tem certeza que deseja excluir ${prof.name}?\n\nOs agendamentos existentes deste profissional não serão removidos.`)) {
        demoData.professionals = demoData.professionals.filter(p => p.id !== id);
        persistDelete('professionals', id);
        renderProfessionals();
        showToast(`Profissional ${prof.name} removido!`, 'success');
    }
}

function getProfessionalName(id) {
    const prof = demoData.professionals.find(p => p.id === id);
    return prof ? prof.name : '';
}

// ========== REVIEWS ==========
function renderReviews() {
    renderReviewsSummary();
    renderReviewsList();
    renderReviewsChart();
}

function renderReviewsSummary() {
    const container = document.getElementById('reviews-summary');
    const reviews = demoData.reviews;
    
    if (reviews.length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhuma avaliação ainda</div>';
        return;
    }
    
    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
    const totalReviews = reviews.length;
    const fiveStars = reviews.filter(r => r.rating === 5).length;
    const fiveStarPercent = Math.round((fiveStars / totalReviews) * 100);
    
    // Rating distribution
    const distribution = [5, 4, 3, 2, 1].map(star => {
        const count = reviews.filter(r => r.rating === star).length;
        const percent = Math.round((count / totalReviews) * 100);
        return { star, count, percent };
    });
    
    container.innerHTML = `
        <div class="reviews-overview">
            <div class="rating-big">
                <div class="rating-number">${avgRating}</div>
                <div class="rating-stars">${renderStars(Math.round(avgRating))}</div>
                <div class="rating-total">${totalReviews} avaliações</div>
            </div>
            <div class="rating-bars">
                ${distribution.map(d => `
                    <div class="rating-bar-row">
                        <span class="bar-label">${d.star} <i class="fas fa-star"></i></span>
                        <div class="rating-bar">
                            <div class="rating-bar-fill" style="width: ${d.percent}%"></div>
                        </div>
                        <span class="bar-count">${d.count}</span>
                    </div>
                `).join('')}
            </div>
            <div class="rating-highlights">
                <div class="highlight-card">
                    <div class="highlight-value">${fiveStarPercent}%</div>
                    <div class="highlight-label">5 estrelas</div>
                </div>
                <div class="highlight-card">
                    <div class="highlight-value">${avgRating >= 4.5 ? '🔥' : avgRating >= 4 ? '👍' : '📊'}</div>
                    <div class="highlight-label">${avgRating >= 4.5 ? 'Excelente' : avgRating >= 4 ? 'Muito Bom' : avgRating >= 3 ? 'Bom' : 'Regular'}</div>
                </div>
                <div class="highlight-card">
                    <div class="highlight-value">${getMostReviewedService()}</div>
                    <div class="highlight-label">Mais avaliado</div>
                </div>
            </div>
        </div>
    `;
}

function getMostReviewedService() {
    const count = {};
    demoData.reviews.forEach(r => {
        count[r.service] = (count[r.service] || 0) + 1;
    });
    const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : '-';
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star ${i <= rating ? 'star-filled' : 'star-empty'}"></i>`;
    }
    return stars;
}

function renderStarsInteractive(currentRating, reviewId) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star star-interactive ${i <= currentRating ? 'star-filled' : 'star-empty'}" 
                    data-rating="${i}" data-review="${reviewId}"
                    onmouseenter="previewStars(this)" 
                    onmouseleave="resetStars(this)"
                    onclick="setRating(${reviewId}, ${i})"></i>`;
    }
    return stars;
}

function previewStars(el) {
    const rating = parseInt(el.dataset.rating);
    const container = el.parentElement || el.closest('.stars-interactive');
    const stars = container ? container.querySelectorAll('.star-interactive') : el.parentNode.querySelectorAll('.star-interactive');
    stars.forEach((star, index) => {
        star.classList.toggle('star-filled', index < rating);
        star.classList.toggle('star-empty', index >= rating);
    });
}

function resetStars(el) {
    // Reset is handled by the parent container's mouseleave
}

function renderReviewsList() {
    const container = document.getElementById('reviews-list');
    const filter = document.getElementById('reviews-filter').value;
    
    let reviews = [...demoData.reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (filter !== 'all') {
        reviews = reviews.filter(r => r.rating === parseInt(filter));
    }
    
    if (reviews.length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhuma avaliação encontrada para esse filtro</div>';
        return;
    }
    
    container.innerHTML = reviews.map(review => {
        const client = demoData.clients.find(c => c.id === review.clientId);
        const professional = demoData.professionals.find(p => p.id === review.professionalId);
        const clientName = client ? client.name : 'Cliente';
        const profName = professional ? professional.name : '';
        const dateFormatted = new Date(review.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
        
        return `
            <div class="review-card">
                <div class="review-header">
                    <div class="review-client">
                        <div class="review-avatar">${clientName.charAt(0)}</div>
                        <div>
                            <strong>${clientName}</strong>
                            <span class="review-service">${review.service}${profName ? ` · com ${profName}` : ''}</span>
                        </div>
                    </div>
                    <div class="review-meta">
                        <div class="review-stars">${renderStars(review.rating)}</div>
                        <span class="review-date">${dateFormatted}</span>
                    </div>
                </div>
                <p class="review-comment">${review.comment}</p>
            </div>
        `;
    }).join('');
}

function renderReviewsChart() {
    const ctx = document.getElementById('reviews-distribution-chart');
    if (!ctx) return;
    
    // Destroy existing chart if any
    const existingChart = Chart.getChart(ctx);
    if (existingChart) existingChart.destroy();
    
    // Reviews per service
    const serviceReviews = {};
    demoData.reviews.forEach(r => {
        if (!serviceReviews[r.service]) {
            serviceReviews[r.service] = { total: 0, sum: 0 };
        }
        serviceReviews[r.service].total++;
        serviceReviews[r.service].sum += r.rating;
    });
    
    const labels = Object.keys(serviceReviews);
    const avgData = labels.map(s => (serviceReviews[s].sum / serviceReviews[s].total).toFixed(1));
    const countData = labels.map(s => serviceReviews[s].total);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Nota Média',
                    data: avgData,
                    backgroundColor: '#f59e0b',
                    borderRadius: 6,
                    yAxisID: 'y'
                },
                {
                    label: 'Qtd. Avaliações',
                    data: countData,
                    backgroundColor: '#3b82f6',
                    borderRadius: 6,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                    min: 0,
                    max: 5,
                    title: { display: true, text: 'Nota Média' }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    min: 0,
                    grid: { drawOnChartArea: false },
                    title: { display: true, text: 'Quantidade' }
                }
            }
        }
    });
}

// ========== LOYALTY PROGRAM ==========
let editingCouponId = null;

function renderLoyalty() {
    renderLoyaltyStats();
    renderLoyaltyRanking();
    renderActiveCouponsList();
    renderCouponsGrid();
}

function renderLoyaltyStats() {
    const container = document.getElementById('loyalty-stats');
    const coupons = demoData.coupons;
    const activeCoupons = coupons.filter(c => c.active);
    const totalUsed = coupons.reduce((sum, c) => sum + c.usedCount, 0);
    const vipClients = demoData.clients.filter(c => c.status === 'vip').length;
    
    // Estimate savings
    let totalSavings = 0;
    coupons.forEach(c => {
        if (c.type === 'percent') {
            totalSavings += c.usedCount * 50 * (c.value / 100); // avg R$50 per service
        } else if (c.type === 'fixed') {
            totalSavings += c.usedCount * c.value;
        } else if (c.type === 'free_service') {
            totalSavings += c.usedCount * 50;
        }
    });
    
    container.innerHTML = `
        <div class="stats-grid" style="margin-bottom:1.5rem">
            <div class="stat-card">
                <div class="stat-icon blue"><i class="fas fa-ticket-alt"></i></div>
                <div class="stat-info">
                    <div class="stat-value">${activeCoupons.length}</div>
                    <div class="stat-label">Cupons Ativos</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green"><i class="fas fa-check-double"></i></div>
                <div class="stat-info">
                    <div class="stat-value">${totalUsed}</div>
                    <div class="stat-label">Cupons Utilizados</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orange"><i class="fas fa-crown"></i></div>
                <div class="stat-info">
                    <div class="stat-value">${vipClients}</div>
                    <div class="stat-label">Clientes VIP</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon purple"><i class="fas fa-piggy-bank"></i></div>
                <div class="stat-info">
                    <div class="stat-value">${formatCurrency(totalSavings)}</div>
                    <div class="stat-label">Economia dos Clientes</div>
                </div>
            </div>
        </div>
    `;
}

function renderLoyaltyRanking() {
    const container = document.getElementById('loyalty-ranking');
    
    const ranked = [...demoData.clients]
        .filter(c => c.status !== 'blocked')
        .sort((a, b) => b.totalAppointments - a.totalAppointments)
        .slice(0, 5);
    
    container.innerHTML = ranked.map((client, index) => {
        const tier = client.totalAppointments >= 20 ? 'gold' : client.totalAppointments >= 10 ? 'silver' : 'bronze';
        const tierLabel = tier === 'gold' ? 'Ouro' : tier === 'silver' ? 'Prata' : 'Bronze';
        const tierIcon = tier === 'gold' ? '🥇' : tier === 'silver' ? '🥈' : '🥉';
        const progress = Math.min((client.totalAppointments / 20) * 100, 100);
        const nextTier = client.totalAppointments >= 20 ? 'Max' : client.totalAppointments >= 10 ? `${20 - client.totalAppointments} p/ Ouro` : `${10 - client.totalAppointments} p/ Prata`;
        
        // Eligible coupons count
        const eligible = demoData.coupons.filter(c => c.active && client.totalAppointments >= c.minVisits).length;
        
        return `
            <div class="loyalty-rank-item">
                <div class="rank-position">${index + 1}</div>
                <div class="rank-client">
                    <strong>${client.name}</strong>
                    <span>${client.totalAppointments} visitas · ${eligible} cupons</span>
                </div>
                <div class="rank-tier">
                    <span class="tier-badge tier-${tier}">${tierIcon} ${tierLabel}</span>
                    <div class="tier-progress">
                        <div class="tier-progress-fill" style="width:${progress}%"></div>
                    </div>
                    <span class="tier-next">${nextTier}</span>
                </div>
            </div>
        `;
    }).join('');
}

function renderActiveCouponsList() {
    const container = document.getElementById('coupons-list');
    const active = demoData.coupons.filter(c => c.active).slice(0, 5);
    
    if (active.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhum cupom ativo</p>';
        return;
    }
    
    container.innerHTML = active.map(coupon => {
        const usagePercent = Math.round((coupon.usedCount / coupon.maxUses) * 100);
        const typeLabel = coupon.type === 'percent' ? `${coupon.value}%` : coupon.type === 'fixed' ? formatCurrency(coupon.value) : 'Grátis';
        const expiry = new Date(coupon.expiry).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
        
        return `
            <div class="coupon-mini">
                <div class="coupon-mini-code">${coupon.code}</div>
                <div class="coupon-mini-info">
                    <span class="coupon-discount">${typeLabel} OFF</span>
                    <span class="coupon-usage">${coupon.usedCount}/${coupon.maxUses} usos · até ${expiry}</span>
                </div>
                <div class="coupon-mini-bar">
                    <div class="coupon-mini-fill" style="width:${usagePercent}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

function renderCouponsGrid() {
    const container = document.getElementById('coupons-grid');
    
    if (demoData.coupons.length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhum cupom cadastrado</div>';
        return;
    }
    
    const typeLabels = { percent: 'Percentual', fixed: 'Valor Fixo', free_service: 'Serviço Grátis' };
    const typeIcons = { percent: 'percentage', fixed: 'dollar-sign', free_service: 'gift' };
    
    container.innerHTML = demoData.coupons.map(coupon => {
        const statusClass = coupon.active ? 'success' : 'danger';
        const statusText = coupon.active ? 'Ativo' : 'Inativo';
        const usagePercent = Math.round((coupon.usedCount / coupon.maxUses) * 100);
        const service = coupon.serviceId ? demoData.services.find(s => s.id === coupon.serviceId) : null;
        const discountDisplay = coupon.type === 'percent' ? `${coupon.value}%` : coupon.type === 'fixed' ? formatCurrency(coupon.value) : 'GRÁTIS';
        const isExpired = new Date(coupon.expiry) < new Date();
        
        return `
            <div class="coupon-card ${isExpired ? 'coupon-expired' : ''}">
                <div class="coupon-card-header">
                    <div class="coupon-code-display">
                        <i class="fas fa-${typeIcons[coupon.type]}"></i>
                        <span>${coupon.code}</span>
                    </div>
                    <span class="badge badge-${statusClass}">${isExpired ? 'Expirado' : statusText}</span>
                </div>
                <div class="coupon-discount-big">${discountDisplay}</div>
                <p class="coupon-desc">${coupon.description}</p>
                <div class="coupon-details">
                    <div class="coupon-detail"><i class="fas fa-user-check"></i> Min. ${coupon.minVisits} visitas</div>
                    <div class="coupon-detail"><i class="fas fa-calendar"></i> Até ${new Date(coupon.expiry).toLocaleDateString('pt-BR')}</div>
                    <div class="coupon-detail"><i class="fas fa-tag"></i> ${service ? service.name : 'Todos os serviços'}</div>
                    <div class="coupon-detail"><i class="fas fa-chart-bar"></i> ${coupon.usedCount}/${coupon.maxUses} usos (${usagePercent}%)</div>
                </div>
                <div class="coupon-usage-bar">
                    <div class="coupon-usage-fill" style="width:${usagePercent}%"></div>
                </div>
                <div class="coupon-actions">
                    <button class="btn-icon" onclick="editCoupon(${coupon.id})" title="Editar"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon" onclick="toggleCouponStatus(${coupon.id})" title="${coupon.active ? 'Desativar' : 'Ativar'}"><i class="fas fa-${coupon.active ? 'eye-slash' : 'eye'}"></i></button>
                    <button class="btn-icon btn-danger" onclick="deleteCoupon(${coupon.id})" title="Excluir"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }).join('');
}

function openCouponModal(couponId = null) {
    const modal = document.getElementById('coupon-modal');
    const title = document.getElementById('coupon-modal-title');
    editingCouponId = couponId;
    
    // Populate service dropdown
    const serviceSelect = document.getElementById('coupon-service');
    serviceSelect.innerHTML = '<option value="">Todos os serviços</option>' +
        demoData.services.filter(s => s.active).map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    
    // Set default expiry to 3 months from now
    const defaultExpiry = new Date();
    defaultExpiry.setMonth(defaultExpiry.getMonth() + 3);
    
    if (couponId) {
        const c = demoData.coupons.find(cp => cp.id === couponId);
        title.textContent = 'Editar Cupom';
        document.getElementById('coupon-code').value = c.code;
        document.getElementById('coupon-description').value = c.description;
        document.getElementById('coupon-type').value = c.type;
        document.getElementById('coupon-value').value = c.value;
        document.getElementById('coupon-min-visits').value = c.minVisits;
        document.getElementById('coupon-expiry').value = c.expiry;
        document.getElementById('coupon-max-uses').value = c.maxUses;
        document.getElementById('coupon-service').value = c.serviceId || '';
        document.getElementById('coupon-active').checked = c.active;
    } else {
        title.textContent = 'Novo Cupom';
        document.getElementById('coupon-code').value = '';
        document.getElementById('coupon-description').value = '';
        document.getElementById('coupon-type').value = 'percent';
        document.getElementById('coupon-value').value = 10;
        document.getElementById('coupon-min-visits').value = 5;
        document.getElementById('coupon-expiry').value = defaultExpiry.toISOString().split('T')[0];
        document.getElementById('coupon-max-uses').value = 50;
        document.getElementById('coupon-service').value = '';
        document.getElementById('coupon-active').checked = true;
    }
    
    modal.style.display = 'flex';
}

function closeCouponModal() {
    document.getElementById('coupon-modal').style.display = 'none';
    editingCouponId = null;
}

function generateCouponCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    document.getElementById('coupon-code').value = code;
}

async function saveCoupon() {
    const code = document.getElementById('coupon-code').value.trim().toUpperCase();
    const description = document.getElementById('coupon-description').value.trim();
    const type = document.getElementById('coupon-type').value;
    const value = parseFloat(document.getElementById('coupon-value').value) || 0;
    const minVisits = parseInt(document.getElementById('coupon-min-visits').value) || 1;
    const expiry = document.getElementById('coupon-expiry').value;
    const maxUses = parseInt(document.getElementById('coupon-max-uses').value) || 50;
    const serviceId = parseInt(document.getElementById('coupon-service').value) || null;
    const active = document.getElementById('coupon-active').checked;
    
    if (!code || !description) {
        showToast('Preencha o código e a descrição', 'error');
        return;
    }
    
    if (!expiry) {
        showToast('Defina a data de validade', 'error');
        return;
    }
    
    // Check for duplicate code
    const duplicate = demoData.coupons.find(c => c.code === code && c.id !== editingCouponId);
    if (duplicate) {
        showToast('Já existe um cupom com este código', 'error');
        return;
    }
    
    if (editingCouponId) {
        const coupon = demoData.coupons.find(c => c.id === editingCouponId);
        if (coupon) {
            Object.assign(coupon, { code, description, type, value, minVisits, expiry, maxUses, serviceId, active });
            await persistData('coupons', editingCouponId, coupon);
            showToast(`Cupom ${code} atualizado!`, 'success');
        }
    } else {
        const newCoupon = { id: Date.now(), code, description, type, value, minVisits, expiry, maxUses, usedCount: 0, serviceId, active, createdAt: new Date().toISOString().split('T')[0] };
        demoData.coupons.push(newCoupon);
        await persistData('coupons', null, newCoupon);
        showToast(`Cupom ${code} criado!`, 'success');
    }
    
    closeCouponModal();
    renderLoyalty();
}

function editCoupon(id) { openCouponModal(id); }

function toggleCouponStatus(id) {
    const c = demoData.coupons.find(cp => cp.id === id);
    c.active = !c.active;
    renderLoyalty();
    showToast(`Cupom ${c.code} ${c.active ? 'ativado' : 'desativado'}!`, 'success');
}

function deleteCoupon(id) {
    const c = demoData.coupons.find(cp => cp.id === id);
    if (confirm(`Excluir cupom ${c.code}?`)) {
        demoData.coupons = demoData.coupons.filter(cp => cp.id !== id);
        persistDelete('coupons', id);
        renderLoyalty();
        showToast(`Cupom ${c.code} removido!`, 'success');
    }
}

// ========== SETTINGS ==========
function saveSettings() {
    const settings = {
        businessName: document.getElementById('business-name').value,
        businessPhone: document.getElementById('business-phone').value,
        businessEmail: document.getElementById('business-email').value,
        businessAddress: document.getElementById('business-address').value,
        cancelDeadline: document.getElementById('cancel-deadline').value,
        confirmationDeadline: document.getElementById('confirmation-deadline').value,
        maxConcurrent: document.getElementById('max-concurrent').value,
        requireDeposit: document.getElementById('require-deposit').checked,
        depositPercentage: document.getElementById('deposit-percentage').value,
        enableReminders: document.getElementById('enable-reminders').checked,
        enableWaitlist: document.getElementById('enable-waitlist').checked,
        enableRecurring: document.getElementById('enable-recurring').checked,
        notifyNewBooking: document.getElementById('notify-new-booking').checked,
        notifyCancellation: document.getElementById('notify-cancellation').checked,
        notifyDelay: document.getElementById('notify-delay').checked,
        dailySummary: document.getElementById('daily-summary').checked
    };
    
    localStorage.setItem('agendapro-settings', JSON.stringify(settings));
    showToast('Configurações salvas com sucesso!', 'success');
}

function updateDepositLabel(value) {
    document.getElementById('deposit-label').textContent = value + '%';
}

// ========== RECURRING APPOINTMENTS ==========
function renderRecurring() {
    renderRecurringDashboard();
    renderRecurringDaysChart();
    renderUpcomingRecurringList();
    renderRecurringGrid();
}

function renderRecurringDashboard() {
    const container = document.getElementById('recurring-dashboard');
    const all = demoData.recurringAppointments;
    const active = all.filter(r => r.active);
    const weekly = all.filter(r => (r.frequency || 'weekly') === 'weekly');
    const biweekly = all.filter(r => r.frequency === 'biweekly');
    
    // Calculate recurring revenue estimate
    let monthlyRevenue = 0;
    all.filter(r => r.active).forEach(r => {
        const service = demoData.services.find(s => s.name === r.serviceName);
        if (service) {
            const value = service.valueType === 'fixed' ? service.value : ((service.valueMin + service.valueMax) / 2);
            const timesPerMonth = (r.frequency === 'biweekly') ? 2 : 4.3;
            monthlyRevenue += value * timesPerMonth;
        }
    });
    
    // Unique clients with recurring
    const uniqueClients = new Set(active.map(r => r.clientId)).size;
    
    container.innerHTML = `
        <div class="stats-grid" style="margin-bottom:1.5rem">
            <div class="stat-card">
                <div class="stat-icon blue"><i class="fas fa-sync-alt"></i></div>
                <div class="stat-info">
                    <div class="stat-value">${all.length}</div>
                    <div class="stat-label">Total Recorrências</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
                <div class="stat-info">
                    <div class="stat-value">${active.length}</div>
                    <div class="stat-label">Ativas</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orange"><i class="fas fa-users"></i></div>
                <div class="stat-info">
                    <div class="stat-value">${uniqueClients}</div>
                    <div class="stat-label">Clientes Recorrentes</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon purple"><i class="fas fa-dollar-sign"></i></div>
                <div class="stat-info">
                    <div class="stat-value">${formatCurrency(monthlyRevenue)}</div>
                    <div class="stat-label">Receita Recorrente/Mês</div>
                </div>
            </div>
        </div>
        <div class="recurring-freq-summary">
            <div class="freq-summary-item">
                <span class="freq-badge freq-weekly"><i class="fas fa-calendar-week"></i> Semanal</span>
                <strong>${weekly.length}</strong>
            </div>
            <div class="freq-summary-item">
                <span class="freq-badge freq-biweekly"><i class="fas fa-calendar-alt"></i> Quinzenal</span>
                <strong>${biweekly.length}</strong>
            </div>
            <div class="freq-summary-item">
                <span class="freq-badge freq-paused"><i class="fas fa-pause-circle"></i> Pausadas</span>
                <strong>${all.length - active.length}</strong>
            </div>
        </div>
    `;
}

function renderRecurringDaysChart() {
    const ctx = document.getElementById('recurring-days-chart');
    if (!ctx) return;
    
    const existingChart = Chart.getChart(ctx);
    if (existingChart) existingChart.destroy();
    
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    const dayCountsBiweekly = [0, 0, 0, 0, 0, 0, 0];
    
    demoData.recurringAppointments.forEach(r => {
        if (r.active) {
            if (r.frequency === 'biweekly') {
                dayCountsBiweekly[r.dayOfWeek]++;
            } else {
                dayCounts[r.dayOfWeek]++;
            }
        }
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dayNames,
            datasets: [
                {
                    label: 'Semanal',
                    data: dayCounts,
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderRadius: 6
                },
                {
                    label: 'Quinzenal',
                    data: dayCountsBiweekly,
                    backgroundColor: 'rgba(139, 92, 246, 0.8)',
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            },
            scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1 } }
            }
        }
    });
}

function renderUpcomingRecurringList() {
    const container = document.getElementById('upcoming-recurring-list');
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    // Collect next occurrence for each active recurring
    const upcoming = [];
    demoData.recurringAppointments.filter(r => r.active).forEach(r => {
        const interval = r.frequency === 'biweekly' ? 14 : 7;
        const today = new Date();
        let current = new Date(today);
        
        while (current.getDay() !== r.dayOfWeek) {
            current.setDate(current.getDate() + 1);
        }
        
        // Add next 2 occurrences per recurring
        for (let i = 0; i < 2; i++) {
            upcoming.push({
                date: new Date(current),
                recurring: r
            });
            current.setDate(current.getDate() + interval);
        }
    });
    
    // Sort by date and take first 7
    upcoming.sort((a, b) => a.date - b.date);
    const next7 = upcoming.slice(0, 7);
    
    if (next7.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhuma recorrência ativa</p>';
        return;
    }
    
    container.innerHTML = next7.map(item => {
        const r = item.recurring;
        const client = demoData.clients.find(c => c.id === r.clientId);
        const professional = demoData.professionals.find(p => p.id === r.professionalId);
        const profColor = professional ? professional.color : 'var(--gray)';
        const freq = r.frequency === 'biweekly' ? 'Quinzenal' : 'Semanal';
        const dateStr = item.date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
        
        return `
            <div class="upcoming-recurring-item">
                <div class="upcoming-date-badge">
                    <span class="upcoming-day">${item.date.getDate()}</span>
                    <span class="upcoming-month">${item.date.toLocaleDateString('pt-BR', { month: 'short' })}</span>
                </div>
                <div class="upcoming-info">
                    <strong>${client.name}</strong>
                    <span>${r.serviceName} · ${r.time}${professional ? ` · <span style="color:${profColor};font-weight:600">${professional.name.split(' ')[0]}</span>` : ''}</span>
                </div>
                <span class="freq-badge ${r.frequency === 'biweekly' ? 'freq-biweekly' : 'freq-weekly'}" style="font-size:0.65rem">${freq}</span>
            </div>
        `;
    }).join('');
}

function renderRecurringGrid() {
    const container = document.getElementById('recurring-grid');
    
    if (demoData.recurringAppointments.length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhum agendamento fixo cadastrado</div>';
        return;
    }
    
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const freqLabels = { weekly: 'Semanal', biweekly: 'Quinzenal' };
    const freqIcons = { weekly: 'calendar-week', biweekly: 'calendar-alt' };
    
    container.innerHTML = demoData.recurringAppointments.map(recurring => {
        const client = demoData.clients.find(c => c.id === recurring.clientId);
        const professional = demoData.professionals.find(p => p.id === recurring.professionalId);
        const statusClass = recurring.active ? 'success' : 'default';
        const statusText = recurring.active ? 'Ativo' : 'Pausado';
        const freq = recurring.frequency || 'weekly';
        const interval = freq === 'biweekly' ? 14 : 7;
        const nextDates = getNextRecurringDates(recurring.dayOfWeek, recurring.time, 4, interval);
        const freqBadgeClass = freq === 'biweekly' ? 'freq-biweekly' : 'freq-weekly';
        
        return `
            <div class="recurring-card">
                <div class="recurring-header">
                    <div class="recurring-client">
                        <i class="fas fa-user-circle"></i>
                        <div>
                            <strong>${client.name}</strong>
                            <span>${formatPhone(client.phone)}</span>
                        </div>
                    </div>
                    <div class="recurring-badges">
                        <span class="freq-badge ${freqBadgeClass}"><i class="fas fa-${freqIcons[freq]}"></i> ${freqLabels[freq]}</span>
                        <span class="badge badge-${statusClass}">${statusText}</span>
                    </div>
                </div>
                <div class="recurring-details">
                    <div class="detail-item">
                        <i class="fas fa-cut"></i>
                        <span>${recurring.serviceName}</span>
                    </div>
                    ${professional ? `
                    <div class="detail-item">
                        <i class="fas fa-user-tie" style="color:${professional.color}"></i>
                        <span>${professional.name}</span>
                    </div>` : ''}
                    <div class="detail-item">
                        <i class="fas fa-redo"></i>
                        <span>${freq === 'biweekly' ? 'A cada 2 semanas -' : 'Toda'} ${dayNames[recurring.dayOfWeek]}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${recurring.time}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-play-circle"></i>
                        <span>Desde ${new Date(recurring.startDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                </div>
                <div class="next-appointments">
                    <strong>Próximos agendamentos automáticos:</strong>
                    <div class="next-dates">
                        ${nextDates.map(date => `
                            <div class="next-date">
                                <i class="fas fa-calendar-check"></i>
                                <span>${date}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="recurring-actions">
                    <button class="btn-icon" onclick="editRecurring(${recurring.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="toggleRecurringStatus(${recurring.id})" title="${recurring.active ? 'Pausar' : 'Ativar'}">
                        <i class="fas fa-${recurring.active ? 'pause' : 'play'}-circle"></i>
                    </button>
                    <button class="btn-icon btn-danger" onclick="deleteRecurring(${recurring.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function getNextRecurringDates(dayOfWeek, time, count, intervalDays) {
    const dates = [];
    const today = new Date();
    let current = new Date(today);
    const interval = intervalDays || 7;
    
    // Find next occurrence of this day of week
    while (current.getDay() !== dayOfWeek) {
        current.setDate(current.getDate() + 1);
    }
    
    for (let i = 0; i < count; i++) {
        const dateStr = current.toLocaleDateString('pt-BR', { 
            weekday: 'short', 
            day: '2-digit', 
            month: 'short' 
        });
        dates.push(`${dateStr} às ${time}`);
        current.setDate(current.getDate() + interval);
    }
    
    return dates;
}

function openRecurringModal(recurringId = null) {
    const modal = document.getElementById('recurring-modal');
    const title = document.getElementById('recurring-modal-title');
    
    // Populate client dropdown
    const clientSelect = document.getElementById('recurring-client');
    clientSelect.innerHTML = '<option value="">Selecione um cliente</option>' +
        demoData.clients.filter(c => c.status !== 'blocked').map(client => 
            `<option value="${client.id}">${client.name}</option>`
        ).join('');
    
    // Populate professional dropdown
    const profSelect = document.getElementById('recurring-professional');
    profSelect.innerHTML = '<option value="">Selecione um profissional</option>' +
        demoData.professionals.filter(p => p.active).map(prof => 
            `<option value="${prof.id}">${prof.name} - ${prof.specialty}</option>`
        ).join('');
    
    // Populate service dropdown
    const serviceSelect = document.getElementById('recurring-service');
    serviceSelect.innerHTML = '<option value="">Selecione um serviço</option>' +
        demoData.services.filter(s => s.active).map(service => 
            `<option value="${service.id}">${service.name}</option>`
        ).join('');
    
    // Set today as minimum start date
    const startDateInput = document.getElementById('recurring-start-date');
    const today = new Date().toISOString().split('T')[0];
    startDateInput.min = today;
    startDateInput.value = today;
    
    if (recurringId) {
        const recurring = demoData.recurringAppointments.find(r => r.id === recurringId);
        title.textContent = 'Editar Agendamento Fixo';
        
        clientSelect.value = recurring.clientId;
        if (recurring.professionalId) profSelect.value = recurring.professionalId;
        document.getElementById('recurring-frequency').value = recurring.frequency || 'weekly';
        document.getElementById('recurring-day').value = recurring.dayOfWeek;
        document.getElementById('recurring-time').value = recurring.time;
        startDateInput.value = recurring.startDate;
        document.getElementById('recurring-active').checked = recurring.active;
    } else {
        title.textContent = 'Novo Agendamento Fixo';
        document.getElementById('recurring-client').value = '';
        document.getElementById('recurring-professional').value = '';
        document.getElementById('recurring-service').value = '';
        document.getElementById('recurring-frequency').value = 'weekly';
        document.getElementById('recurring-day').value = '4';
        document.getElementById('recurring-time').value = '15:00';
        document.getElementById('recurring-active').checked = true;
    }
    
    modal.style.display = 'flex';
}

function closeRecurringModal() {
    document.getElementById('recurring-modal').style.display = 'none';
}

async function saveRecurring() {
    const clientId = parseInt(document.getElementById('recurring-client').value);
    const professionalId = parseInt(document.getElementById('recurring-professional').value) || null;
    const serviceId = parseInt(document.getElementById('recurring-service').value);
    const frequency = document.getElementById('recurring-frequency').value;
    const dayOfWeek = parseInt(document.getElementById('recurring-day').value);
    const time = document.getElementById('recurring-time').value;
    const startDate = document.getElementById('recurring-start-date').value;
    const active = document.getElementById('recurring-active').checked;
    
    if (!clientId || !serviceId) {
        showToast('Por favor, selecione cliente e serviço', 'error');
        return;
    }
    
    const client = demoData.clients.find(c => c.id === clientId);
    const service = demoData.services.find(s => s.id === serviceId);
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const freqLabel = frequency === 'biweekly' ? 'Quinzenal' : 'Semanal';
    
    const recurring = {
        id: Date.now(),
        clientId,
        professionalId,
        serviceName: service.name,
        frequency,
        dayOfWeek,
        time,
        startDate,
        active,
        createdAt: new Date().toISOString()
    };
    
    demoData.recurringAppointments.push(recurring);
    await persistData('recurringAppointments', null, recurring);    
    // Create next 4 occurrences automatically
    if (active) {
        createRecurringAppointments(recurring);
    }
    
    renderRecurring();
    closeRecurringModal();
    showToast(`${freqLabel}: ${client.name} - ${dayNames[dayOfWeek]} às ${time}`, 'success');
}

function createRecurringAppointments(recurring) {
    const interval = recurring.frequency === 'biweekly' ? 14 : 7;
    const dates = getNextRecurringDatesForCreation(recurring.dayOfWeek, recurring.startDate, 4, interval);
    
    dates.forEach(date => {
        const exists = demoData.appointments.some(apt => 
            apt.clientId === recurring.clientId && 
            apt.date === date && 
            apt.time === recurring.time
        );
        
        if (!exists) {
            demoData.appointments.push({
                id: Date.now() + Math.random(),
                clientId: recurring.clientId,
                professionalId: recurring.professionalId,
                service: recurring.serviceName,
                date: date,
                time: recurring.time,
                status: 'confirmed',
                isRecurring: true,
                recurringId: recurring.id,
                createdAt: new Date().toISOString(),
                confirmedAt: new Date().toISOString()
            });
        }
    });
}

function getNextRecurringDatesForCreation(dayOfWeek, startDate, count, intervalDays) {
    const dates = [];
    const start = new Date(startDate);
    let current = new Date(start);
    const interval = intervalDays || 7;
    
    // Find next occurrence of this day of week
    while (current.getDay() !== dayOfWeek) {
        current.setDate(current.getDate() + 1);
    }
    
    for (let i = 0; i < count; i++) {
        const dateStr = current.toISOString().split('T')[0];
        dates.push(dateStr);
        current.setDate(current.getDate() + interval);
    }
    
    return dates;
}

function editRecurring(id) {
    openRecurringModal(id);
}

function toggleRecurringStatus(id) {
    const recurring = demoData.recurringAppointments.find(r => r.id === id);
    recurring.active = !recurring.active;
    
    const client = demoData.clients.find(c => c.id === recurring.clientId);
    const statusText = recurring.active ? 'ativado' : 'pausado';
    
    renderRecurring();
    showToast(`Agendamento fixo ${statusText} para ${client.name}`, 'success');
}

function deleteRecurring(id) {
    if (confirm('Tem certeza que deseja excluir este agendamento fixo?\n\nOs agendamentos já criados não serão removidos, mas novos não serão criados automaticamente.')) {
        const recurring = demoData.recurringAppointments.find(r => r.id === id);
        const client = demoData.clients.find(c => c.id === recurring.clientId);
        
        demoData.recurringAppointments = demoData.recurringAppointments.filter(r => r.id !== id);
        persistDelete('recurringAppointments', id);
        renderRecurring();
        showToast(`Agendamento fixo removido para ${client.name}`, 'success');
    }
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    // Load saved settings
    const savedSettings = localStorage.getItem('agendapro-settings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        Object.keys(settings).forEach(key => {
            const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = settings[key];
                } else {
                    element.value = settings[key];
                }
            }
        });
    }
    
    // Enter key support for login/register forms
    document.getElementById('login-password').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    document.getElementById('login-email').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') document.getElementById('login-password').focus();
    });
    document.getElementById('register-confirm').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleRegister();
    });

    // Handle authentication
    // Always show landing page first, then check auth
    document.getElementById('landing-page').style.display = 'block';

    if (useFirebase) {
        FirebaseAuth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    isFirebaseMode = true;
                    const profile = await Database.getUserProfile(firebaseUser.uid);
                    const user = {
                        id: firebaseUser.uid,
                        name: profile?.name || firebaseUser.displayName || 'Usuário',
                        email: firebaseUser.email,
                        role: profile?.role || 'admin',
                        business: profile?.business || 'Meu Negócio',
                        avatar: (profile?.name || firebaseUser.displayName || 'US').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                    };
                    await loginUser(user);
                } catch (err) {
                    console.error('Erro ao fazer login Firebase:', err);
                }
            }
        });
    } else {
        checkExistingSession();
    }
});
