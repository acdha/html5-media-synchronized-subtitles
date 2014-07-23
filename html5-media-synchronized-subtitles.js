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

    // IE 11 adds <br> tags which are unfortunately impossible to style in a way which is compatible
    // with inline display:
    var stripBreakTagRe = new RegExp(/<[/]?br>/g);
    function stripBreaks(container) {
        container.innerHTML = container.innerHTML.replace(stripBreakTagRe, ' ');
    }

    function displayTextTrack(playerElement, textTrack, trackDisplayList, cueElementCallback) {

        for (var i = 0; i < textTrack.cues.length; i++) {
            var li = document.createElement('li'),
                cue = textTrack.cues[i];

            li.dataset.startTime = cue.startTime;
            li.startTime = cue.startTime;
            li.endTime = cue.endTime;

            li.appendChild(cue.getCueAsHTML());
            cueElementCallback(li);

            trackDisplayList.appendChild(li);
        }

        var trackList = trackDisplayList.children;

        playerElement.addEventListener('timeupdate', function () {
            var newScrollTop = -1,
                currentTime = playerElement.currentTime;

            for (i = 0; i < trackList.length; i++) {
                var li = trackList[i];

                if (currentTime >= li.startTime && currentTime <= li.endTime) {
                    li.classList.add('highlighted');

                    if (newScrollTop > -1) {
                        newScrollTop = Math.min(newScrollTop, li.offsetTop);
                    } else {
                        newScrollTop = li.offsetTop;
                    }
                } else {
                    li.classList.remove('highlighted');
                }
            }

            if (newScrollTop > -1) {
                scrollIntoView(trackDisplayList, newScrollTop);
            }
        });
    }

    function loadTrack(container, playerElement, trackElement, trackDisplayList, cueElementCallback) {
        var checkTrackState = function () {
            if (this.readyState <= 1) {
                return;
            }

            if (this.readyState == 2) {
                displayTextTrack(playerElement, trackElement.track, trackDisplayList, cueElementCallback);
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

    function enableDisplay(container) {
        var playerId = container.dataset.playerId;

        if (!playerId) {
            console.log('Container must specify data-player-id:', container);
            return;
        }

        var player = document.getElementById(playerId);
        if (!player) {
            console.log('Unable to find player with ID: ' + playerId);
            return;
        }

        var toggle = container.querySelector('.collapse-toggle');
        if (toggle) {
            toggle.addEventListener('click', function () {
                container.classList.toggle('expanded');
            });
        }

        var trackDisplayList = document.createElement('ol');
        container.appendChild(trackDisplayList);

        if (container.dataset.clickToTime === 'true') {
            trackDisplayList.addEventListener('click', function (evt) {
                player.currentTime = evt.target.startTime;
            });
        }

        // This callback will be called for each element created to hold a track cue so it can perform
        // any post-display processing:
        var cueElementCallback = stripBreaks;

        if ('cueElementCallback' in container.dataset) {
            cueElementCallback = window[container.dataset.cueElementCallback];
        }

        var trackElements = player.querySelectorAll('track');
        for (i = 0; i < trackElements.length; i++) {
            var trackElement = trackElements[i];

            if (trackElement.kind == "subtitles") {
                loadTrack(container, player, trackElement, trackDisplayList, cueElementCallback);
                return;
            }
        }

        console.warn('Unable to find a subtitle track!');
    }

    var displayElements = document.querySelectorAll('.synchronized-subtitle-display');

    for (var i = 0; i < displayElements.length; i++) {
        enableDisplay(displayElements[i]);
    }
})();
