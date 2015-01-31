var Twit = require("twit")
var fs = require("fs");
var T = new Twit({
     consumer_key: ""
  , consumer_secret: ""
  , access_token: ""
  , access_token_secret: ""
});

var tweets = [];
var tweetIndex=  0;
var firstRunThrough = true;

var ownerID = 3007901165;

console.log("SeahawksFan Activated!!!.\n\n");


/* =- =- =- -= =- =- =- =- =- =- =- =- =- =- =- =- =- =-

	Post Tweets (pass text in as first argument)

=- =- =- =- =- =- =- =- -==- =- =- =- -= =- =- =- =-*/
var post_tweet = function(tweet_text, waiting){
	T.post("statuses/update", { status: tweet_text }, function(err, data, response) {
	  console.log("Tweet Posted.");
	  if(waiting){
	  	console.log('Waiting...\n');
	  }
	})
}



/* =- =- =- -= =- =- =- =- =- =- =- =- =- =- =- =- =- =-

	Query Tweets (what to search, how many tweets)

=- =- =- =- =- =- =- =- -==- =- =- =- -= =- =- =- =-*/

var talk_trash = function(the_query, num_tweets){

	firstRunThrough = false;

	/* =- =- =- -= =- =- =- =- =- =- =- =- =- =- =- =- =- =-

		Use the node wrapper to send the request to the twitter api

	=- =- =- =- =- =- =- =- -==- =- =- =- -= =- =- =- =-*/
	T.get("search/tweets", { q: the_query, count: num_tweets }, function(err, data, response) {

		var 	tweets = data.statuses,
				legit_tweets = [],
				prev_targets = [];

		/* =- =- =- -= =- =- =- =- =- =- =- =- =- =- =- =- =- =-

			Loop through the results

		=- =- =- =- =- =- =- =- -==- =- =- =- -= =- =- =- =-*/
		for(var i = 0; i < tweets.length; i++){

		  	/* =- =- =- -= =- =- =- =- =- =- =- =- =- =- =- =- =- =-

		  		Set up variables to analyze each tweet in our results array

		  	=- =- =- =- =- =- =- =- -==- =- =- =- -= =- =- =- =-*/
		  	var current_tweet = tweets[i],
		  		current_tweet_txt = current_tweet.text,
		  		has_link = current_tweet_txt.indexOf("http"),
		  		has_mention = current_tweet_txt.indexOf("@"),
		  		has_rt = current_tweet_txt.indexOf("RT");

		  	/* =- =- =- -= =- =- =- =- =- =- =- =- =- =- =- =- =- =-

		  		Check if the tweet has no mention, retweet, or link characteristics
		  		Tweets that meet this criteria are more likely to be responded to

		  	=- =- =- =- =- =- =- =- -==- =- =- =- -= =- =- =- =-*/
		  	if(has_link == -1 && has_rt == -1 && has_mention == -1){
		  		legit_tweets.push(current_tweet);
		  	}
		}

		/* =- =- =- -= =- =- =- =- =- =- =- =- =- =- =- =- =- =-

				Set Up variables related to the tweet we are targeting

		=- =- =- =- =- =- =- =- -==- =- =- =- -= =- =- =- =-*/
		var rand_integer = Math.floor(Math.random() * legit_tweets.length),
			victim = legit_tweets[rand_integer],
			// victim_name = victim.user.screen_name,
			victim_name = "Patriots",
			victim_id = victim.id,
			tweet_bodies = [
				"@"+victim_name+" #LegionofBoom is coming to AZ to destroy you! #patriots!",
				"@"+victim_name+" GOOOO @SEAHAWKS! :) http://bit.ly/1wjWxxP ",
				"@"+victim_name+" Cheaters!! xD GO @Seahawks #deflategate ",
				"@"+victim_name+"We're shutting down #tombrady on Sunday! #LegionOfBoom @"+victim_name,
				"12th man visits SUPER BOWL XLIX #LEGIONOFBOOM!",
				"@"+victim_name+" - #TomBrady is going DOWN!!! #LEGIONOFBOOM @Seahawks #Seahawks #patriotnation",
				"@Seattle is coming for you @"+victim_name+"... http://bit.ly/15Vx5nH #LegionOfBoom",
				"I'm seeing a lot of patriots fans here talking trash! @"+victim_name+" & #patriotsnation, we are coming for you! #LegionOfBoom"
			];

		var trash_text = tweet_bodies[Math.floor((Math.random() * (tweet_bodies.length - 1)) + 1)];

		var has_run = function(){
			prev_targets.forEach(function(tweet){
				if(prev_targets[tweet] == victim_id){
					return true;
				}
			});
		}

		/* =- =- =- -= =- =- =- =- =- =- =- =- =- =- =- =- =- =-

			Post The Tweet

		=- =- =- =- =- =- =- =- -==- =- =- =- -= =- =- =- =-*/
		if (has_run != true) {

			console.log('has_run = false');

			// =- =- =- =- =- =- =- =- =-
			//
			//		Fire Away!
			//
			// =- =- =- =- =- =- =- =-
			post_tweet(trash_text,true);

			console.log(trash_text);

			prev_targets.push(victim_id);

		} else {

			console.log("We already targeted this user. No Post Made.");

		}

		// Write messsages to the console
		console.log("There were "+legit_tweets.length+" statuses returned out of "+tweets.length+" total results.");
		console.log("tweet id = "+victim_id);
		console.log("victim = "+victim_name+"\n\n");

		return legit_tweets;


	});

}


/* =- =- =- -= =- =- =- =- =- =- =- =- =- =- =- =- =- =- =- =- =- =- =- =-

	Start talkin as soon as we run this, no one likes to wait..

=- =- =- =- =- =- =- =- -==- =- =- =- -= =- =- =- =- =- =- -= =- =- =- -=*/
if(firstRunThrough){
	console.log('Initial Run-through: Go Seahawks!\n');
}
// talk_trash("#patriotsnation since:2015-1-11", 50);


/* =- =- =- =- =- =- =- =- =-

	Let it ride...

=- =- =-  =- -= =- =- =- -=*/
setInterval(function(){ 

	var random_int = Math.floor((Math.random() * 100) + 1);

	if(random_int > 50){	// feeble attempt to space the timing out :(
		talk_trash("#patriotsnation since:2015-1-11", 50);
	} else {
		firstRunThrough = false;
		console.log('do_run == false, skipping this round\n\n');
	}

// one hour
}, 360000);


