
Note that it is impossible to hide 404 errors from the chrome dev tools console.
That particular error is not my fault - it won't show up on any other browser
because the 404 is handled.

As per Matt's comment here: http://stackoverflow.com/q/7035466

Features "correctly" implemented:

* Marker on self location
    * Clicking on self marker names closest station and gives distance
    * Polyline connecting self to nearest station as the crow flies
* Markers on MBTA red line stations and used non-default marker
    * Clicking on a station marker brings up a list of times until train arrivals
        * Times count down every 5 seconds
        * A new request is made every minute to limit how bad the times can get
* Polyline connecting stations to show path of red line on map

Collaborations:
    None

Time spent: ~9 hours
