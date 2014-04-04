var timer;
var currentId;
var idCounter = 0;
var runningId = 0;

$(document).ready(function() {
	localStorage
	$('#startLog').click(function() {
		currentId = $('#entryNameInput').val();

		if (timer) {
			clearInterval(timer);
		}
			
		runningId = createLogEntry(currentId);

		timer = setInterval(function() { 
			time = updateLogEntry(runningId);
			printList();
		}, 1000);
	});

	$('#stopLog').click(function() {
		if (timer) {
			clearInterval(timer);
		}
	});

});

function createLogEntry(workId) {
	var entry = new logEntry(workId, new Date(), new Date());
	localStorage.setItem(idCounter, JSON.stringify(entry));

	idCounter++;
	
	return idCounter - 1;
}

function sumLogEntries(workId) {
	sum = 0;

	for (i = 0; i < idCounter; i++) {
		ent = JSON.parse(localStorage.getItem(i));
		sum += Date.parse(ent.endTime) - Date.parse(ent.startTime);
	}

	return sum;
}

function updateLogEntry(id) {
	ent = JSON.parse(localStorage.getItem(id));
	ent.endTime = new Date();
	localStorage.setItem(id, JSON.stringify(ent));

	return Date.parse(ent.endTime) - Date.parse(ent.startTime);	
}

function logEntry(workId, startTime, endTime)
{
	this.workId = workId;
	this.startTime = startTime;
	this.endTime = endTime;
}

function formatTime(timeInMs) {
	seconds = Math.floor(timeInMs / 1000);
	return (seconds + " seconds");
}

function printList() {
	$('#worktable').html("");

	sums = {};

	for (var key in localStorage) {
		ent = JSON.parse(localStorage.getItem(key));
		if (sums[ent.workId]) {
			sums[ent.workId] += Date.parse(ent.endTime) - Date.parse(ent.startTime);
		}
		else  {
			sums[ent.workId] = 0;
		}
	}

	for (var key in sums) {
		$('#worktable').append('<div class="workEntry" id="' + key + '"><span class="entryName">' + key + 
			'</span><span class="loggedTime">' + formatTime(sums[key]) + '</span></div>');
	}

	$(".workEntry").click(function() {
		$('#entryNameInput').val($(this).find(".entryName").html());
	});
}