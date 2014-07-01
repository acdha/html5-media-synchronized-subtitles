html5-media-synchronized-subtitles
==================================

Pure-HTML5 synchronized subtitles and movie display:

http://acdha.github.io/html5-media-synchronized-subtitles/demo.html

Synopsis
--------

1. A hidden element with the `synchronized-subtitle-display` class exists somewhere on the page with a `data-player-id` attribute pointing to a `<video>` element
2. When the async JavaScript loads, it registers event handlers for the subtitle `<track>` loading
3. Browsers which support WebVTT will load the track and parse it
4. JavaScript creates an ordered list of track cues so the entire transcript may be displayed
5. As the browser fires `cuechange` events, cues which overlap in time have the CSS class `highlighted` added and the `scrollTop` property of the cue list will be updated. If jQuery is present, the scrollTop change will be animated.

Notes
-----

* Firefox does not currently support WebVTT but this is scheduled to ship in FF31
* Firefox does not currently fire cuechange events
* The demo will not work in Firefox on OS X until H.264 support ships
* IE11 requires the subtitles to have the standard `text/vtt` MIME type
