var timer;
var currentId;

$(document).ready(function() {
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

			timer = setInterval(function() { updateLog(currentId, 1) }, 1000);
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

function updateLog(id, time) {
	elem_id = "#" + id + " span.loggedTime";

	old_time = parseInt($(elem_id).data('time'));

	$(elem_id).data('time', old_time + parseInt(time));

	time = parseInt($(elem_id).data('time'));

	$(elem_id).html(Math.floor(time / 60) + " minutes " + (time % 60) + " seconds");
}
