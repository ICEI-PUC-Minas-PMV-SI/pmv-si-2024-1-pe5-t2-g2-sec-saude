// Inicializa o Date Range Picker para selecionar o intervalo de datas
$(function() {
    $('#calendario').daterangepicker({
        locale: {
            format: 'YYYY-MM-DD',
            separator: " até ",
            applyLabel: "Aplicar",
            cancelLabel: "Cancelar",
            daysOfWeek: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
            monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
            firstDay: 1
        }
    });
});

// Simulação de Busca de Consultas
document.getElementById('buscarConsultas').addEventListener('click', function() {
    // Dados simulados para consultas disponíveis
    const consultasDisponiveis = [
        {
            data: '2024-11-01',
            horario: '09:00',
            medico: 'Dr. Marcos Almeida',
            especialidade: 'Cardiologia'
        },
        {
            data: '2024-11-02',
            horario: '10:00',
            medico: 'Dra. Ana Souza',
            especialidade: 'Dermatologia'
        },
        {
            data: '2024-11-03',
            horario: '11:00',
            medico: 'Dr. João Oliveira',
            especialidade: 'Pediatria'
        }
    ];

    // Limpa a tabela antes de exibir novos resultados
    const tbody = document.getElementById('consultasDisponiveis');
    tbody.innerHTML = '';

    // Preenche a tabela com os resultados
    consultasDisponiveis.forEach(consulta => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${consulta.data}</td>
            <td>${consulta.horario}</td>
            <td>${consulta.medico}</td>
            <td>${consulta.especialidade}</td>
            <td><button class="btn btn-primary agendar-btn" data-data="${consulta.data}" data-horario="${consulta.horario}" data-medico="${consulta.medico}">Agendar</button></td>
        `;
        tbody.appendChild(tr);
    });

    // Adiciona evento para cada botão "Agendar" exibido
    document.querySelectorAll('.agendar-btn').forEach(button => {
        button.addEventListener('click', function() {
            const data = this.getAttribute('data-data');
            const horario = this.getAttribute('data-horario');
            const medico = this.getAttribute('data-medico');

            // Preenche o modal com os dados da consulta selecionada
            document.getElementById('dataModal').textContent = data;
            document.getElementById('horarioModal').textContent = horario;
            document.getElementById('medicoModal').textContent = medico;

            // Exibe o modal
            const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
            confirmModal.show();
        });
    });
});

// Função para limpar os resultados das consultas
document.getElementById('limparConsultas').addEventListener('click', function() {
    const tbody = document.getElementById('consultasDisponiveis');
    tbody.innerHTML = ''; // Limpa a tabela de resultados
});

// Função para confirmar o agendamento
document.getElementById('confirmAgendar').addEventListener('click', function() {
    alert('Consulta agendada com sucesso!');
    const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
    confirmModal.hide(); // Fecha o modal
});