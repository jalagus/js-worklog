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

		if ($("#" + currentId).length) {
			timer = setInterval(function() { updateLog(currentId, 1) }, 1000);
		}
		else {
			$('#worktable').append('<div class="workEntry" id="' + currentId + '"><span class="entryName">' + currentId + '</span><span class="loggedTime">0</span></div>');
			$("#" + currentId + " span.loggedTime").data('time', 0);
			
			runningId = createLogEntry(currentId);

			timer = setInterval(function() { 
				time = updateLogEntry(runningId);
				updateTimeField(currentId, Math.floor(time / 1000));
			}, 1000);
		}
		
		$(".workEntry").click(function() {
			$('#entryNameInput').val($(this).find(".entryName").html());
		});
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

function updateTimeField(id, time) {
	elem_id = "#" + id + " span.loggedTime";
	$(elem_id).html(Math.floor(time / 60) + " minutes " + (time % 60) + " seconds");
}

function logEntry(workId, startTime, endTime)
{
	this.workId = workId;
	this.startTime = startTime;
	this.endTime = endTime;
}


function printList() {
	sums = {};

	for (var key in localStorage) {
		ent = JSON.parse(localStorage.getItem(key));
		sums[ent.workId] = Date.parse(ent.endTime) - Date.parse(ent.startTime);
	}

	for (var key in sums) {
		console.log(key + " - " + sums[key]);		
	}
}