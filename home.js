
function formatDateTime(dateTimeString) {
    if (!dateTimeString) {
        return "(No Specified Deadline)";
    }

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    const dateTime = new Date(dateTimeString);
    return new Intl.DateTimeFormat('en-US', options).format(dateTime);
}

function formatTime(minutes) {
    if (minutes === undefined || minutes === '') {
        return "No Allotted Time";
    }

    var hours = Math.floor(minutes / 60);
    var remainingMinutes = minutes % 60;

    var formattedTime = "";
    if (hours > 0) {
        formattedTime += hours + " hour";
        if (hours > 1) {
            formattedTime += "s";
        }
    }

    if (hours > 0 && remainingMinutes > 0) {
        formattedTime += " and ";
    }

    if (remainingMinutes > 0) {
        formattedTime += remainingMinutes + " minute";
        if (remainingMinutes > 1) {
            formattedTime += "s";
        }
    }

    return formattedTime;
}

function newElement() {
    var taskDescriptionValue = document.getElementById("taskDescriptionInput").value.trim();
    var inputValue = document.getElementById("todoInput").value.trim();
    var deadlineValue = document.getElementById("deadlineInput").value;
    var timeValue = document.getElementById("timeInput").value;
    var fontSizeValue = document.getElementById("fontSizeInput").value;

    if (inputValue === '') {
        document.getElementById("todoInput").style.border = "1px solid black";
        return;
    }

    document.getElementById("todoInput").style.border = "";

    var formattedDeadline = formatDateTime(deadlineValue);
    var formattedTime = formatTime(timeValue);

    var formattedTaskDescription = taskDescriptionValue ? "-" + taskDescriptionValue + "" : ""; 

    var formattedTask = "<div class='task-input'>" + inputValue + "</div>" +
                        "<div class='task-description'>" + formattedTaskDescription + "</div>" +
                        "<div class='task-details'>" +
                        "<p>Task Time: " + formattedTime + " | Deadline at: " + formattedDeadline + "</p>" +
                        "</div>" +
                        "<button class='editButton' onclick='editTaskDescription(this.parentNode)'>\u270E</button>"; 

    var li = document.createElement("li");
    li.style.fontFamily = "Verdana"; 
    li.style.fontSize = fontSizeValue + "px"; 

    var taskDiv = document.createElement("div");
    taskDiv.className = "task-container";
    taskDiv.innerHTML = formattedTask;

    li.appendChild(taskDiv);

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    taskDiv.appendChild(span);

    span.onclick = function () {
        var div = this.parentElement.parentElement;
        div.remove();
    };

    li.onclick = function () {
        this.classList.toggle('done');
    };

    var todoList = document.getElementById("todoList");
    var firstItem = todoList.firstChild;
    if (firstItem) {
        todoList.insertBefore(li, firstItem);
    } else {
        todoList.appendChild(li);
    }

    document.getElementById("taskDescriptionInput").value = "";
    document.getElementById("todoInput").value = "";
    document.getElementById("deadlineInput").value = "";
    document.getElementById("timeInput").value = "";
    document.getElementById("fontSizeInput").value = ""; 
    saveTasks();
}









document.getElementById("addButton").addEventListener("click", newElement);


document.getElementById("todoInput").addEventListener("keypress", function(event) {
    if (event.keyCode === 13) {
        newElement();
    }
});


$(document).ready(function() {
    $( "#todoList.sortable" ).sortable({
        update: function(event, ui) {
            var updatedTaskOrder = $(this).sortable('toArray').map(function(taskId) {
                return $("#" + taskId).text(); 
            });
            console.log(updatedTaskOrder);
        }
    });
    $( "#todoList.sortable" ).disableSelection();
});















function saveTaskOrder() {
    var taskIds = Array.from(document.querySelectorAll("#todoList > li")).map(function(task) {
        return task.id;
    });
    localStorage.setItem("taskOrder", JSON.stringify(taskIds));
}


function saveTasks() {
    saveTaskOrder(); 

    var todoList = document.getElementById("todoList").innerHTML;
    localStorage.setItem("tasks", todoList);
}


function loadTasks() {
    var savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        document.getElementById("todoList").innerHTML = savedTasks;

 
        var removeButtons = document.querySelectorAll(".close");
        removeButtons.forEach(function(button) {
            button.onclick = function() {
                var div = this.parentElement.parentElement;
                div.remove();
                saveTasks(); 
            };
        });

        var taskTexts = document.querySelectorAll("#todoList li");
        taskTexts.forEach(function(task) {
            task.onclick = function() {
                this.classList.toggle('done');
                saveTasks(); 
            };
        });


        makeSortable();
    }
}

function makeSortable() {
    $( "#todoList.sortable" ).sortable({
        update: function(event, ui) {
            saveTaskOrder(); 
            saveTasks(); 
        }
    });
    $( "#todoList.sortable" ).disableSelection();
}


window.onload = function() {
    loadTasks();
}


function editTaskDescription(taskDiv) {
    var newDescription = prompt("Enter the new task description:");
    if (newDescription !== null) {
        var descriptionElement = taskDiv.querySelector('.task-description');
        descriptionElement.textContent = "- " + newDescription;

        var parentLi = taskDiv.parentNode;
        parentLi.classList.toggle('done');
    }
}


















/*
function editTask(button) {
    var modal = document.getElementById("editTaskModal");
    modal.style.display = "block";

    // Find the task container
    var taskContainer = button.parentNode;
    var taskTitle = taskContainer.querySelector('.task-input').textContent;
    var taskDescription = taskContainer.querySelector('.task-description').textContent.replace('-', '').trim();
    var taskFontSize = taskContainer.parentNode.style.fontSize.replace('px', '');
    var taskDeadline = taskContainer.querySelector('.task-details p').textContent.split('Deadline at: ')[1];
    var taskTime = taskContainer.querySelector('.task-details p').textContent.split('Task Time: ')[1].split(' |')[0].trim();

    // Populate the modal inputs with task details
    document.getElementById("editTaskInput").value = taskTitle;
    document.getElementById("editTaskDescription").value = taskDescription;
    document.getElementById("editTaskDeadline").value = taskDeadline;
    document.getElementById("editTaskTime").value = taskTime;
    document.getElementById("editFontSizeInput").value = taskFontSize;

    // Add an event listener to handle changes in font size
    document.getElementById("editFontSizeInput").addEventListener("change", function() {
        taskContainer.parentNode.style.fontSize = this.value + "px";
    });

    // Store the task container for later use when saving changes
    modal.selectedTaskContainer = taskContainer;

    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Refresh the displayed tasks
    displayTasks();
}


function closeEditModal() {
    var modal = document.getElementById("editTaskModal");
    modal.style.display = "none";
}

function saveEditedTask() {
    // Fetch edited values
    var editedTitle = document.getElementById("editTaskInput").value.trim();
    var editedDescription = document.getElementById("editTaskDescription").value.trim();
    var editedDeadline = document.getElementById("editTaskDeadline").value;
    var editedTime = document.getElementById("editTaskTime").value;
    var editedFontSize = document.getElementById("editFontSizeInput").value;

    // Find the selected task
    var selectedTask = document.querySelector(".task-container.selected");

    // Update task title
    selectedTask.querySelector('.task-input').textContent = editedTitle;

    // Update task description
    selectedTask.querySelector('.task-description').textContent = editedDescription ? "-" + editedDescription : "";

    // Update task font size
    selectedTask.parentNode.style.fontSize = editedFontSize + "px";

    // Update task deadline
    var formattedDeadline = formatDateTime(editedDeadline);
    selectedTask.querySelector('.task-details p').innerHTML = "Task Time: " + formatTime(editedTime) + " | Deadline at: " + formattedDeadline;

    // Close the modal
    closeEditModal();

    // Save the changes
    saveTasks();
}



*/