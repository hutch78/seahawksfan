

fs.readFile('poem.txt', function read(err, data) {
    var lines = data.toString().split('\n');
    var currentTweet = '';

    if (err) {
        throw err;
    }

	console.log(lines);
    var numChars = 0;
    numChars = lines[0].length;
    console.log('Num Chars: ' + numChars);
    
	for (var i = 0; i < lines.length; i++) {
		currentTweet += lines[i] + '\n';
		if(i < lines.length-1)
			numChars += lines[i+1].length;
		if(numChars >= 140) {
			console.log('Tweet: ('+currentTweet.length+')\n' + currentTweet );
			tweets.push(currentTweet);
			numChars = lines[i+1].length;
			currentTweet = '';
		}
    }
});

setInterval(function tweetLine() {
    if(tweetIndex < tweets.length) {
		console.log(tweets[tweetIndex]);
		T.post('statuses/update', { status: tweets[tweetIndex] }, function(err, data, response) {
			console.log('Posted');
		});
		tweetIndex++;
    } else {
		process.exit(code=0);
    }
}, 3000);
