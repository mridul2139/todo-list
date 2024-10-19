document.addEventListener("DOMContentLoaded", () => {
    const storedtasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedtasks) {
        storedtasks.forEach((task) => tasks.push(task));
    }
    updatetaskslist();
    updatestats();
});

let tasks = [];

const savetasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const addtask = () => {
    const taskinput = document.getElementById('taskinput');
    const text = taskinput.value.trim();
    if (text) {
        tasks.push({ text: text, completed: false });
        taskinput.value = "";
        updatetaskslist();
        updatestats();
        savetasks();
    }
};

const updatetaskslist = () => {
    const tasklist = document.getElementById('task-list');
    tasklist.innerHTML = '';
    tasks.forEach((task, index) => {
        const listitem = document.createElement('li');
        listitem.innerHTML = `
            <div class="taskitem">
                <div class="task ${task.completed ? "completed" : ""}">
                    <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} />
                    <p>${task.text}</p>
                </div>
                <div class="icons">
                    <img src="edit.png" onclick="edittask(${index})" />
                    <img src="bin.png" onclick="deletetask(${index})" />
                </div>
            </div>
        `;
        listitem.querySelector('.checkbox').addEventListener('change', () => toggletaskcomplete(index));
        tasklist.append(listitem);
    });
};

const toggletaskcomplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updatetaskslist();
    updatestats();
    savetasks();
};

const edittask = (index) => {
    const taskinput = document.getElementById("taskinput");
    taskinput.value = tasks[index].text;
    tasks.splice(index, 1);
    updatetaskslist();
    updatestats();
    savetasks();
};

const deletetask = (index) => {
    tasks.splice(index, 1);
    updatetaskslist();
    updatestats();
    savetasks();
};

const updatestats = () => {
    const completedtasks = tasks.filter(task => task.completed).length;
    const totaltasks = tasks.length;
    const progress = (completedtasks / totaltasks) * 100;
    const progressbar = document.getElementById("progress");
    progressbar.style.width = `${progress}%`;
    document.getElementById('numbers').innerText = `${completedtasks}/${totaltasks}`;
    
    // Celebrate when all tasks are completed
    if (tasks.length && completedtasks === totaltasks) {
        celebrate();
    }
};

document.getElementById('newtask').addEventListener('click', function (e) {
    e.preventDefault();
    addtask();
});

const celebrate = () => {
    const duration = 15 * 1000,
        animationEnd = Date.now() + duration,
        defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // since particles fall down, start a bit higher than random
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            })
        );
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            })
        );
    }, 250);
};
