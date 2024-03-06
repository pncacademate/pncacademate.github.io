
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

    var formattedTaskDescription = taskDescriptionValue ? "-" + taskDescriptionValue + "" : ""; // Add task description with format "-(task description)"

    var formattedTask = "<div class='task-input'>" + inputValue + "</div>" +
                        "<div class='task-description'>" + formattedTaskDescription + "</div>" +
                        "<div class='task-details'>" +
                        "<p>Task Time: " + formattedTime + " | Deadline at: " + formattedDeadline + "</p>" +
                        "</div>";

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


