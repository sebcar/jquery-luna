# jQuery-Luna
### html5 audio player

jQuery-Luna is a simple mp3 audio player.

- Plays only mp3 files.
- Supports several files.
- Supports play, pause, next, prev actions.
- Supports volume control.
- Supports progress bar using jQuery UI

 [Demo URL](http://sebastian.uy/jquery-luna/)

Usage:

```javascript
$("your-selector").luna({
	songs:["path/to/your/file1.mp3", "path/to/your/file2.mp3",...],
	onStatusChange: function(e){
		console.log(e);
	}
});
```
