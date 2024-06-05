let tasks = {};

document.getElementById('add-task').addEventListener('click', () => {
    const date = document.getElementById('add-task-date').value;
    const time = document.getElementById('task-time').value;
    const desc = document.getElementById('task-desc').value;

    if (!tasks[date]) {
        tasks[date] = [];
    }

    tasks[date].push({ time, desc });
    saveTasksToLocalStorage();
    displayTasks(date);
});

document.getElementById('show-tasks').addEventListener('click', () => {
    const date = document.getElementById('task-date').value;
    displayTasks(date);
});

function displayTasks(date) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    if (!tasks[date] || tasks[date].length === 0) {
        taskList.innerHTML = '<p>No tasks for this date.</p>';
        return;
    }

    tasks[date].forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.innerHTML = `
            <span>${task.time}</span>
            <span>${task.desc}</span>
            <button onclick="finishTask('${date}', ${index})">Finish</button>
            <button onclick="deleteTask('${date}', ${index})">Delete</button>
        `;
        taskList.appendChild(taskItem);
    });
}

function finishTask(date, index) {
    const modal = document.getElementById('finished-task-modal');
    modal.style.display = 'block';

    document.getElementById('save-finished-task').onclick = function() {
        const finishedDesc = document.getElementById('finished-desc').value;

        fetch('http://localhost:3000/api/saveFinishedTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: date,
                time: tasks[date][index].time,
                desc: tasks[date][index].desc,
                finishedDesc: finishedDesc
            })
        }).then(response => response.json())
          .then(data => {
              if (data.success) {
                  deleteTask(date, index);
                  closeFinishedModal();
              } else {
                  alert('Failed to save finished task.');
              }
          });
    };

    document.getElementById('close-finished-modal').onclick = closeFinishedModal;
}

function closeFinishedModal() {
    const modal = document.getElementById('finished-task-modal');
    modal.style.display = 'none';
    document.getElementById('finished-desc').value = '';
}

function deleteTask(date, index) {
    tasks[date].splice(index, 1);
    saveTasksToLocalStorage();
    displayTasks(date);
}

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

window.onload = loadTasksFromLocalStorage;

window.onclick = function(event) {
    const modal = document.getElementById('finished-task-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

