// Inicializa o Daterangepicker para seleção de intervalo de datas
$(function() {
    $('#filtroCalendario').daterangepicker({
        locale: {
            format: 'YYYY-MM-DD',
            applyLabel: 'Aplicar',
            cancelLabel: 'Cancelar',
            fromLabel: 'De',
            toLabel: 'Até',
            customRangeLabel: 'Personalizado',
            weekLabel: 'S',
            daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            firstDay: 0
        }
    });
});

// Função para filtrar a agenda com base no intervalo de datas
function filtrarAgenda() {
    const filtroCalendario = document.getElementById('filtroCalendario').value;
    const [dataInicio, dataFim] = filtroCalendario.split(" to ");

    const agendaLinhas = document.querySelectorAll('#agenda tr');

    agendaLinhas.forEach(linha => {
        const dataConsulta = linha.getAttribute('data-data');
        if (!dataInicio || !dataFim) {
            linha.style.display = ""; // Mostra todas as linhas se os filtros estiverem vazios
        } else if (dataConsulta >= dataInicio && dataConsulta <= dataFim) {
            linha.style.display = "";
        } else {
            linha.style.display = "none";
        }
    });
}

// Funções para ações nas consultas
function confirmarConsulta(id) {
    const statusElement = document.getElementById(`status-${id}`);
    statusElement.textContent = "Confirmado";
    statusElement.className = "badge bg-success";

    atualizarStatusConsultaHoje(id, "Confirmado", "bg-success");
}

function atenderConsulta(id) {
    const statusElement = document.getElementById(`status-${id}`);
    statusElement.textContent = "Atendido";
    statusElement.className = "badge bg-primary";

    atualizarStatusConsultaHoje(id, "Atendido", "bg-primary");
}

function cancelarConsulta(id) {
    const statusElement = document.getElementById(`status-${id}`);
    statusElement.textContent = "Cancelado";
    statusElement.className = "badge bg-danger";

    atualizarStatusConsultaHoje(id, "Cancelado", "bg-danger");
}

function atualizarStatusConsultaHoje(id, status, classe) {
    const statusHojeElement = document.getElementById(`status-hoje-${id}`);
    if (statusHojeElement) {
        statusHojeElement.textContent = status;
        statusHojeElement.className = `badge ${classe}`;
    }
}
