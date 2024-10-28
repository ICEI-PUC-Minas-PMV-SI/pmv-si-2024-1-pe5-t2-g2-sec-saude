// Simulação de dados de agendas já cadastradas
let existingSchedules = [];

// Função para capturar os dados do formulário e adicionar à tabela de consultas com intervalo
document.getElementById('schedule-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const doctorName = document.getElementById('doctor-select').options[document.getElementById('doctor-select').selectedIndex].text.split(' - ')[0];
    const specialty = document.getElementById('doctor-specialty').value;
    const date = document.getElementById('schedule-date').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const intervalTime = parseInt(document.getElementById('interval-time').value);

    function timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    function minutesToTime(minutes) {
        const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
        const mins = String(minutes % 60).padStart(2, '0');
        return `${hours}:${mins}`;
    }

    let startTimeInMinutes = timeToMinutes(startTime);
    const endTimeInMinutes = timeToMinutes(endTime);

    const appointmentList = document.getElementById('appointment-list');
    
    while (startTimeInMinutes < endTimeInMinutes) {
        const consultationEndTime = startTimeInMinutes + intervalTime;
        if (consultationEndTime > endTimeInMinutes) break;

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${date}</td>
            <td>${doctorName}</td>
            <td>${specialty}</td>
            <td>${minutesToTime(startTimeInMinutes)}</td>
            <td>Disponível</td>
            <td>
                <button class="btn btn-sm btn-warning edit-btn">Alterar</button>
                <button class="btn btn-sm btn-danger delete-btn">Excluir</button>
            </td>
        `;
        appointmentList.appendChild(newRow);

        existingSchedules.push({
            doctor: doctorName,
            specialty: specialty,
            date: date,
            time: `${minutesToTime(startTimeInMinutes)}`,
            status: 'Disponível'
        });

        startTimeInMinutes = consultationEndTime;
    }

    alert('Agenda criada com sucesso!');

    // Função para manipular as ações após a criação da agenda
    setupActionButtons(appointmentList);
});

// Função para limpar a tabela de agenda
document.getElementById('clear-table-btn').addEventListener('click', function() {
    document.getElementById('appointment-list').innerHTML = '';
});

// Função para configurar os botões de Ações (Alterar/Excluir)
function setupActionButtons(tableBody) {
    // Configura os botões de Alterar
    tableBody.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const row = button.closest('tr');
            const cells = row.getElementsByTagName('td');
            const doctor = cells[1].innerText;
            const time = cells[3].innerText;

            const newDoctor = prompt('Alterar Médico:', doctor);
            const newTime = prompt('Alterar Horário:', time);

            if (newDoctor !== null && newTime !== null) {
                cells[1].innerText = newDoctor;
                cells[3].innerText = newTime;
            }
        });
    });

    // Configura os botões de Excluir
    tableBody.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const row = button.closest('tr');
            row.remove();

            // Remover do array existingSchedules
            const time = row.getElementsByTagName('td')[3].innerText;
            existingSchedules = existingSchedules.filter(schedule => schedule.time !== time);
        });
    });
}

// Função para popular a especialidade automaticamente ao selecionar um médico
document.getElementById('doctor-select').addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];  // Pega a opção selecionada
    const specialty = selectedOption.getAttribute('data-specialty');  // Busca a especialidade no data-specialty
    document.getElementById('doctor-specialty').value = specialty || '';  // Preenche o campo de especialidade
});

// Função para limpar o formulário de configuração da agenda
document.getElementById('clear-form-btn').addEventListener('click', function() {
    document.getElementById('schedule-form').reset();
    document.getElementById('doctor-specialty').value = '';
});

// Função para buscar as agendas existentes
document.getElementById('search-btn').addEventListener('click', function() {
    const searchDoctorName = document.getElementById('search-doctor-name').value;
    const searchSpecialty = document.getElementById('search-specialty').value;
    const searchDate = document.getElementById('search-date').value;

    const results = existingSchedules.filter(schedule => {
        return (!searchDoctorName || schedule.doctor.toLowerCase().includes(searchDoctorName.toLowerCase())) &&
               (!searchSpecialty || schedule.specialty.toLowerCase().includes(searchSpecialty.toLowerCase())) &&
               (!searchDate || schedule.date === searchDate);
    });

    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';

    if (results.length === 0) {
        const noResultsRow = document.createElement('tr');
        noResultsRow.innerHTML = `<td colspan="7">Nenhuma agenda encontrada.</td>`;
        searchResults.appendChild(noResultsRow);
    } else {
        results.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.date}</td>
                <td>${result.doctor}</td>
                <td>${result.specialty}</td>
                <td>${result.time}</td>
                <td>${result.patient ? result.patient : '-'}</td>
                <td>${result.status}</td>
                <td>
                    <button class="btn btn-sm btn-warning edit-btn">Alterar</button>
                    <button class="btn btn-sm btn-danger delete-btn">Excluir</button>
                </td>
            `;
            searchResults.appendChild(row);
        });

        // Configura os botões de ações na tabela de busca
        setupActionButtons(searchResults);
    }
});

// Função para limpar o formulário de busca e os resultados
document.getElementById('clear-search-btn').addEventListener('click', function() {
    document.getElementById('search-form').reset();
    document.getElementById('search-results').innerHTML = '';
});

// Função para salvar a agenda e limpar a tabela após salvar
document.getElementById('save-schedule-btn').addEventListener('click', function() {
    alert('Agenda salva com sucesso!');
    document.getElementById('appointment-list').innerHTML = '';
    document.getElementById('search-results').innerHTML = '';  // Limpa a tabela de busca
});
