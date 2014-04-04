var timer;
var currentId;
var runningId = 0;

$(document).ready(function() {
	printList();

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
	idCounter = 0;

	if (localStorage.length > 0) {
		idCounter = localStorage.key(localStorage.length - 1);

		while(idCounter in localStorage) {
			idCounter++;
		}
	}

	localStorage.setItem(idCounter, JSON.stringify(entry));
	
	return idCounter;
}

function updateLogEntry(id) {
	ent = JSON.parse(localStorage.getItem(id));
	ent.endTime = new Date();
	localStorage.setItem(id, JSON.stringify(ent));

	console.log(ent);

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
		
		if (!(ent.workId in sums))  {
			sums[ent.workId] = 0;
		}

		sums[ent.workId] += Date.parse(ent.endTime) - Date.parse(ent.startTime);
	}

	for (var key in sums) {		
		$('#worktable').append('<div class="workEntry" id="' + key + '"><span class="entryName">' + key + 
			'</span><span class="loggedTime">' + formatTime(sums[key]) + '</span></div>');
	}

	$(".workEntry").click(function() {
		$('#entryNameInput').val($(this).find(".entryName").html());
	});
}