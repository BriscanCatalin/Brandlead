import "bootstrap";
import axios from "axios";
import "../css/app.scss";

axios.defaults.withCredentials = true;

function getTaskElement(taskId, taskName) {
    return `
        <div class="list-group-item list-group-item-action py-3" id="task-${taskId}">
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <input id="task-name-${taskId}" class="form-control form-control-lg" value="${taskName}">
                    </div>
                </div>

                <div class="col-auto">
                    <div class="d-flex">
                        <div class="p-1 cursor-pointer border btn-edit-task" onclick="editTask(${taskId})">
                            <i class="fa fa-edit fa-2x text-success"></i>
                        </div>

                        <div class="p-1 cursor-pointer border btn-delete-task" onclick="deleteTask(${taskId})">
                            <i class="fa fa-trash fa-2x text-danger"></i>
                        </div>

                        <div class="p-1 cursor-pointer border btn-drag-task" onclick="move(${taskId}, 'up')">
                            <i class="fa fa-angle-up fa-2x text-secondary"></i>
                        </div>

                        <div class="p-1 cursor-pointer border btn-drag-task" onclick="move(${taskId}, 'down')">
                            <i class="fa fa-angle-down fa-2x text-secondary"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

window.document.getElementById("btn-add-task").addEventListener("click", () => {
    const taskName = window.document.getElementById("task-name").value;

    axios
        .post("http://localhost/api/tasks", {
            name: taskName,
        })
        .then((response) => {
            displayTask(taskName, response.data.id);
        })
        .catch((error) => {
            console.log(error);
        });
});

window.editTask = function (taskId) {
    const taskName = window.document.getElementById(
        `task-name-${taskId}`
    ).value;

    axios.put(`http://localhost/api/tasks/${taskId}`, {
        name: taskName,
    });
};

window.deleteTask = function (taskId) {
    axios.delete(`http://localhost/api/tasks/${taskId}`).then((response) => {
        window.document.getElementById(`task-${taskId}`).remove();
    });
};

window.move = function (taskId, type) {
    const taskElement = window.document.getElementById(`task-${taskId}`);

    axios
        .put(`http://localhost/api/tasks/${taskId}/move-${type}`)
        .then((response) => {
            getTasks();
        });
};

function displayTask(taskName, taskId) {
    const taskElement = getTaskElement(taskId, taskName);

    window.document.getElementById("list-tasks").innerHTML += taskElement;
}

function getTasks() {
    window.document.getElementById("list-tasks").innerHTML = "";

    axios
        .get("http://localhost/api/tasks")
        .then((response) => {
            response.data.forEach((task) => {
                displayTask(task.name, task.id);
            });
        })
        .catch((error) => {
            window.location = "/login.html";
        });
}

getTasks();
