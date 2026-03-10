<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dados da Empresa - AgendaPro</title>
    <link rel="stylesheet" href="/css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .card-form {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .section-title {
            margin: 30px 0 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #f0f0f0;
            color: #333;
        }
        .row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <aside class="sidebar">
            <div class="logo">
                <i class="fas fa-calendar-check"></i>
                <span>AgendaPro</span>
            </div>
            <nav class="nav-menu">
                <a href="/"><i class="fas fa-home"></i> Dashboard</a>
                <a href="/clientes"><i class="fas fa-users"></i> Clientes</a>
                <a href="/agendamentos"><i class="fas fa-calendar"></i> Agendamentos</a>
                <a href="/servicos"><i class="fas fa-cut"></i> Serviços</a>
                <a href="/colaboradores"><i class="fas fa-user-md"></i> Colaboradores</a>
                <a href="/configuracoes"><i class="fas fa-cog"></i> WhatsApp</a>
                <a href="/configuracoes-avancadas"><i class="fas fa-sliders-h"></i> Avançado</a>
                <a href="/empresa" class="active"><i class="fas fa-building"></i> Minha Empresa</a>
            </nav>
        </aside>

        <main class="main-content">
            <header class="header">
                <h1>Dados da Empresa</h1>
                <div class="user-info">
                    <span id="userName">Carregando...</span>
                    <i class="fas fa-user-circle"></i>
                </div>
            </header>

            <div class="card-form">
                <h2>Informações da Empresa</h2>
                <p style="color:#666; margin-bottom:20px;">Preencha os dados da sua empresa para personalizar o sistema.</p>

                <form id="empresaForm" onsubmit="salvarEmpresa(event)">
                    <div class="form-group">
                        <label>Nome da Empresa *</label>
                        <input type="text" id="nome_empresa" required>
                    </div>

                    <div class="row">
                        <div class="form-group">
                            <label>CNPJ</label>
                            <input type="text" id="cnpj">
                        </div>
                        <div class="form-group">
                            <label>Inscrição Estadual</label>
                            <input type="text" id="inscricao_estadual">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Atividade Principal</label>
                        <input type="text" id="atividade">
                    </div>

                    <h3 class="section-title">Endereço</h3>

                    <div class="form-group">
                        <label>Endereço</label>
                        <input type="text" id="endereco">
                    </div>

                    <div class="row">
                        <div class="form-group">
                            <label>Cidade</label>
                            <input type="text" id="cidade">
                        </div>
                        <div class="form-group">
                            <label>Estado</label>
                            <input type="text" id="estado" maxlength="2">
                        </div>
                        <div class="form-group">
                            <label>CEP</label>
                            <input type="text" id="cep">
                        </div>
                    </div>

                    <h3 class="section-title">Contato</h3>

                    <div class="row">
                        <div class="form-group">
                            <label>Telefone</label>
                            <input type="text" id="telefone">
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="email">
                        </div>
                        <div class="form-group">
                            <label>Site</label>
                            <input type="url" id="site">
                        </div>
                    </div>

                    <h3 class="section-title">Personalização</h3>

                    <div class="row">
                        <div class="form-group">
                            <label>Cor Primária</label>
                            <input type="color" id="cor_primaria" value="#667eea">
                        </div>
                        <div class="form-group">
                            <label>Cor Secundária</label>
                            <input type="color" id="cor_secundaria" value="#764ba2">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Descrição da Empresa</label>
                        <textarea id="descricao" rows="4"></textarea>
                    </div>

                    <button type="submit" class="btn-submit">
                        <i class="fas fa-save"></i> Salvar Alterações
                    </button>
                </form>
            </div>
        </main>
    </div>

    <script>
        async function carregarDadosUsuario() {
            const response = await fetch('/api/auth/me');
            const usuario = await response.json();
            document.getElementById('userName').textContent = usuario.nome || 'Usuário';
        }

        async function carregarEmpresa() {
            const response = await fetch('/api/empresa');
            const empresa = await response.json();
            
            for (let [key, value] of Object.entries(empresa)) {
                const campo = document.getElementById(key);
                if (campo) campo.value = value || '';
            }
        }

        async function salvarEmpresa(event) {
            event.preventDefault();

            const dados = {
                nome_empresa: document.getElementById('nome_empresa').value,
                cnpj: document.getElementById('cnpj').value,
                inscricao_estadual: document.getElementById('inscricao_estadual').value,
                atividade: document.getElementById('atividade').value,
                endereco: document.getElementById('endereco').value,
                cidade: document.getElementById('cidade').value,
                estado: document.getElementById('estado').value,
                cep: document.getElementById('cep').value,
                telefone: document.getElementById('telefone').value,
                email: document.getElementById('email').value,
                site: document.getElementById('site').value,
                cor_primaria: document.getElementById('cor_primaria').value,
                cor_secundaria: document.getElementById('cor_secundaria').value,
                descricao: document.getElementById('descricao').value
            };

            const response = await fetch('/api/empresa', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            const result = await response.json();
            alert(result.mensagem || '✅ Dados salvos!');
        }

        carregarDadosUsuario();
        carregarEmpresa();
    </script>
</body>
</html>