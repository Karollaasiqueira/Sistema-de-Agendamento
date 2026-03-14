// ==========================================
// AgendaPro — Utilitários de Segurança
// Incluir em todas as páginas protegidas
// ==========================================

'use strict';

// ===== ESCAPE XSS =====
// Usar em TODOS os dados dinâmicos inseridos no DOM
function esc(s) {
    if (s === null || s === undefined) return '';
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ===== STATUS PERMITIDOS =====
// Whitelist de valores para classes CSS dinâmicas
const STATUS_AGENDAMENTO = {
    pendente: 'pendente',
    confirmado: 'confirmado',
    cancelado: 'cancelado',
    concluido: 'concluido'
};

function statusSeguro(s) {
    return STATUS_AGENDAMENTO[s] || 'pendente';
}

// ===== VERIFICAR AUTENTICAÇÃO =====
// Chamar no início de cada página protegida
async function verificarAuth() {
    try {
        const r = await fetch('/api/auth/me');
        if (!r.ok) {
            window.location.href = '/login.html';
            return null;
        }
        const user = await r.json();
        // Atualizar nome do usuário na interface se existir o elemento
        const el = document.getElementById('userName');
        if (el) el.textContent = esc(user.nome);
        return user;
    } catch (e) {
        window.location.href = '/login.html';
        return null;
    }
}

// ===== LOGOUT =====
async function logout() {
    try {
        await fetch('/auth/logout', { method: 'POST' });
    } finally {
        window.location.href = '/login.html';
    }
}

// ===== TOAST (substitui alert()) =====
function toast(msg, tipo = 'sucesso') {
    const cores = {
        sucesso: '#28a745',
        erro: '#dc3545',
        info: '#17a2b8',
        aviso: '#ffc107'
    };
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = `
        position:fixed;bottom:24px;right:24px;z-index:9999;
        background:${cores[tipo] || cores.info};color:#fff;
        padding:12px 20px;border-radius:8px;font-size:14px;
        box-shadow:0 4px 12px rgba(0,0,0,.2);max-width:360px;
        font-family:Poppins,sans-serif;line-height:1.4;
    `;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 4000);
}

// ===== FORMATAR DATA =====
function formatarData(d) {
    if (!d) return '---';
    try {
        return new Date(d).toLocaleDateString('pt-BR');
    } catch {
        return '---';
    }
}

function formatarDataHora(d) {
    if (!d) return '---';
    try {
        return new Date(d).toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    } catch {
        return '---';
    }
}
