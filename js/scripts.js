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
	$('#exportLog').click(function() {
		csvData = "data:text/plain;base64," + btoa(JSON.stringify(localStorage));
        $(this)
            .attr({
            'download': "export.txt",
                'href': csvData,
                'target': '_blank'
        });
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

	str = "";

	if (seconds >= 3600) {
		hours = Math.floor(seconds / 3600);
		seconds -= hours * 3600;
		minutes = Math.floor(seconds / 60);

		str += huors + " hours " + minutes + " minutes ";
	}
	else if (seconds >= 60) {
		str += Math.floor(seconds / 60) + " minutes ";
	}
	
	str += (seconds % 60) + " seconds";
	
	return str;
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