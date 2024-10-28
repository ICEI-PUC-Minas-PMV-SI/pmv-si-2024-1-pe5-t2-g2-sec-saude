document.addEventListener('DOMContentLoaded', function() {
    const botaoCancelar = document.querySelectorAll('.cancelar-consulta');
    const historicoConsultas = document.getElementById('historico-consultas');
    const filtroData = document.getElementById('filtroData');

    // Função para transferir a consulta cancelada para o histórico
    function transferirParaHistorico(linhaConsulta) {
        const novaLinha = document.createElement('tr');
        novaLinha.innerHTML = `
            <td>${linhaConsulta.cells[0].innerText}</td>
            <td>${linhaConsulta.cells[1].innerText}</td>
            <td>${linhaConsulta.cells[2].innerText}</td>
            <td>${linhaConsulta.cells[3].innerText}</td>
            <td><span class="badge bg-secondary">Cancelada</span></td>
        `;
        historicoConsultas.appendChild(novaLinha);
    }

    // Função para cancelar consultas
    botaoCancelar.forEach(botao => {
        botao.addEventListener('click', function() {
            const linhaConsulta = this.closest('tr');
            
            if (confirm('Tem certeza que deseja cancelar esta consulta?')) {
                // Remove a consulta da tabela de próximas consultas
                linhaConsulta.remove();

                // Transfere a consulta cancelada para o histórico
                transferirParaHistorico(linhaConsulta);

                // Aqui, você pode adicionar uma chamada AJAX para comunicar ao servidor sobre o cancelamento da consulta.
            }
        });
    });

    // Função para filtrar o histórico de consultas por data
    filtroData.addEventListener('input', function() {
        const dataFiltro = new Date(filtroData.value);
        const linhasHistorico = historicoConsultas.querySelectorAll('tr');

        linhasHistorico.forEach(linha => {
            const dataConsulta = new Date(linha.cells[0].innerText.split('/').reverse().join('-'));

            if (isNaN(dataFiltro.getTime()) || dataConsulta.getTime() === dataFiltro.getTime()) {
                linha.style.display = '';
            } else {
                linha.style.display = 'none';
            }
        });
    });
});
