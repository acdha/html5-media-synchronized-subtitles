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

Notes & Browser Compatibility
-----------------------------

* Safari 7 on OS X:
  * cuechange event dispatch will stop if subtitles are subsequently enabled and disabled using the browser's
    standard controls: https://bugs.webkit.org/show_bug.cgi?id=135159
* Safari on iOS 7: ok
* Chrome:
  * cuechange event dispatch will stop if subtitles are subsequently enabled and disabled using the browser's
    standard controls: https://code.google.com/p/chromium/issues/detail?id=396085
* Firefox:
  * WebVTT is currently unsupported but this is scheduled to ship in FF31 and can be enabled in about:config in FF30: https://bugzilla.mozilla.org/show_bug.cgi?id=629350#c56
  * cuechange events are not yet dispatched: https://bugzilla.mozilla.org/show_bug.cgi?id=996331
  * The demo will not work in Firefox on OS X until H.264 support ships
* IE11:
  * `<track>` is only supported on Windows 8
  * `<track>` does not load cross-origin and does not support the `crossorigin` attribute:
    https://connect.microsoft.com/IE/feedback/details/817222/ie-11-unable-to-load-captions-cross-domain-with-track
  * the subtitles must have the standard `text/vtt` MIME type
  * cuechange event dispatch will stop if subtitles are subsequently enabled and disabled using the browser's
    standard controls
