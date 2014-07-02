/* globals console, document, jQuery */

(function () {
    "use strict";

    if (!document.querySelectorAll || !document.addEventListener || !document.body.classList) {
        // Do nothing on old browsers
        return;
    }

    var scrollIntoView = function (elem, newTop) {
        elem.scrollTop = newTop;
    };

    if (!!window.jQuery) {
        scrollIntoView = function (elem, newTop) {
            jQuery(elem).animate({scrollTop: newTop});
        };
    }

    function displayTextTrack(playerElement, textTrack, displayList) {
        for (var i = 0; i < textTrack.cues.length; i++) {
            var li = document.createElement('li'),
                cue = textTrack.cues[i];

            li.startTime = cue.startTime;
            li.endTime = cue.endTime;

            li.appendChild(cue.getCueAsHTML());

            displayList.appendChild(li);
        }

        function clearHighlights() {
            var highlights = displayList.querySelectorAll('.highlighted');

            for (var i = 0; i < highlights.length; i++) {
                highlights[i].classList.remove('highlighted');
            }
        }

        var trackList = displayList.children;

        textTrack.addEventListener('cuechange', function (evt) {
            clearHighlights();

            var startTime = Number.MAX_VALUE,
                endTime = Number.MIN_VALUE,
                activeCues = evt.target.activeCues;

            for (var i = 0; i < activeCues.length; i++) {
                startTime = Math.min(startTime, activeCues[i].startTime);
                endTime = Math.max(endTime, activeCues[i].endTime);
            }

            var newScrollTop = -1;

            for (i = 0; i < trackList.length; i++) {
                var li = trackList[i];

                if ((li.startTime >= startTime && li.startTime <= endTime) ||
                    (li.endTime >= startTime && li.endTime <= endTime)) {

                    li.classList.add('highlighted');

                    if (newScrollTop > -1) {
                        newScrollTop = Math.min(newScrollTop, li.offsetTop);
                    } else {
                        newScrollTop = li.offsetTop;
                    }
                }
            }

            if (newScrollTop > -1) {
                scrollIntoView(displayList, newScrollTop);
            }
        });
    }

    function loadTrack(trackElement) {
        var checkTrackState = function () {
            if (this.readyState <= 1) {
                return;
            }

            if (this.readyState == 2) {
                displayTextTrack(player, this.track, trackList);
                container.hidden = false;
            }

            this.removeEventListener('load', checkTrackState);
            this.removeEventListener('loadedmetadata', checkTrackState);
            this.removeEventListener('error', checkTrackState);
        };

        trackElement.addEventListener('load', checkTrackState);
        trackElement.addEventListener('loadedmetadata', checkTrackState);
        trackElement.addEventListener('error', checkTrackState);

        // If the mode is disabled, set it to hidden to trigger the browser loading the track content:
        if (trackElement.track.mode == 'disabled') {
            trackElement.track.mode = 'hidden';
        }

        checkTrackState.call(trackElement);
    }

    var displayElements = document.querySelectorAll('.synchronized-subtitle-display');

    for (var i = 0; i < displayElements.length; i++) {
        var container = displayElements[i],
            playerId = container.dataset.playerId;

        if (!playerId) {
            console.log('Container must specify data-player-id:', container);
            continue;
        }

        var player = document.getElementById(playerId);
        if (!player) {
            console.log('Unable to find player with ID: ' + playerId);
            continue;
        }

        var toggle = container.querySelector('.collapse-toggle');
        if (toggle) {
            toggle.addEventListener('click', function () {
                container.classList.toggle('expanded');
            }); // jshint ignore:line
        }

        var trackList = document.createElement('ol');
        container.appendChild(trackList);

        var tracks = player.querySelectorAll('track');

        for (i = 0; i < tracks.length; i++) {
            loadTrack(tracks[i]);
        }
    }
})();
