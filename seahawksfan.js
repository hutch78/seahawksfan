var Twit = require("twit"),
	fs = require("fs"),
	colors = require("colors"),
	T = new Twit({
	    consumer_key: "",
	    consumer_secret: "",
	    access_token: "",
	    access_token_secret: ""
	}),
	ownerID = 3007901165,
	tweets = [],
	tweetIndex=  0,
	firstRunThrough = true,
	prev_targets = [],
	tweet_count = 0,
	tweet_logging = 4,
	which_team = 'patriots',
	skip_threshold = skip_threshold;

function get_rand(the_integer, include_zero){
	if(include_zero){

		var the_rand = Math.floor((Math.random() * the_integer));
		// console.log('\n'+the_rand+'\n');
		return the_rand;

	} else {
		return Math.floor((Math.random() * the_integer) + 1);
	}
}

if(tweet_logging > 1){
	console.log("\n -= -= -= -= SeahawksFan Activated - Debugging Mode =- =- =- =- =-\n\n");
} else {
	console.log("\n -= -= -= -= SeahawksFan Activated!!! =- =- =- =- =-\n\n");
}


/* =- =- =- -= =- =- =- =-

	Initial Run Through

=- =- =- =- =- =- =- -=*/
if(firstRunThrough){
	console.log('Initial Run-through: Go Seahawks!\n');
}




/* =- =- =- -= =- =- =- =- =- =- =- =- =- =- =- =- =- =-

	Post Tweets (pass text in as first argument)

=- =- =- =- =- =- =- =- -==- =- =- =- -= =- =- =- =-*/
var post_tweet = function(tweet_text, waiting, start_seahawks){
	T.post("statuses/update", { status: tweet_text }, function(err, data, response) {
	  console.log("#PatriotsNation ".blue+"Tweet Posted.");
	  if(waiting){
	  	console.log('Waiting...\n');
	  }

	})
}




/* =- =- =- -= =- =- =- =- =- =- =- =- =- =- =- =- =- =- =- =- =- =-

	Listen for tweets containing our hashtag, and reply to them

=- =- =- =- =- =- =- =- -==- =- =- =- -= =- =- =- =- =-= - =- =- =- -=*/
var seahawks_stream = T.stream('statuses/filter', { track: '#seahawks', language: 'en' });

var skipped_seahawks = 0;

seahawks_stream.on('tweet', function (tweet) {

	// console.log(tweet.text);

	var the_team = '#Seahawks'.green;

	tweet_count++;

	if(get_rand(100) > 95 || skipped_seahawks == skip_threshold){	// 5% of the time or 200 skips

		if(skipped_seahawks == skip_threshold){
			skipped_seahawks = 0;
		}
		// spam filter
		has_link = tweet.text.indexOf("http"),
		has_mention = tweet.text.indexOf("@"),
		has_rt = tweet.text.indexOf("RT");


		if(has_link == -1 && has_rt == -1 && has_mention == -1){

			var tweet_handle = tweet.user.screen_name,
				tweet_id = tweet.id,
				tweet_id_str = tweet.id_str;

			var has_run = function(){
				prev_targets.forEach(function(index){
					if(prev_targets[index] == tweet_id){
						return true;
						console.log('Previous target');
					}
				});
			}


			/* =- =- =- -= =- =- =- =- =- =- =- =- =- =- =- =- =- =-

				Post The Tweet

			=- =- =- =- =- =- =- =- -==- =- =- =- -= =- =- =- =-*/
			if (has_run != true) {

				// =- =- =- =- =- =- =- =- =- =- =- =- =- =- -= =- =- =- =- =- =- =- =-
				//
				//		Retweet Seahawks Fan tweet, and attempt to favorite it
				//
				// =- =- =- =- =- =- =- =-=- =- =- =- =- =- =- =- =- =- =- =- =- =-
			    T.post('statuses/retweet/:id', { id: tweet_id_str }, 
			    	function(err, data, res){

					    if(err){
					    	console.error(err);
					    } else {
					    	if(tweet_logging >= 1){ console.log("\n"+the_team+" fan = "+tweet_handle+" has been retweeted: "+tweet.text); }

					    }

						if(get_rand(100) > 50){
							var time_offset = get_rand(10) * 1000;
							if (tweet_logging <= 1) { console.log('Attempting to favorite this tweet in'+time_offset+' seconds...\n'); }
						    setTimeout(function() {
					    	    T.post('favorites/create', { id: tweet_id_str }, 
					    	    	function(err, data, res){

					    			    if(err){
					    			    	console.error(err);
					    			    	seahawks_stream.start();
					    			    } else {
					    			    	console.log('Post Favorited.\n');
					    			    }
					    			}
					    		);

						    }, time_offset);
						} else {
							console.log('Post favorite criteria not met. This RT will not be favorited.\n');
						}
					    if (tweet_logging <= 1) { console.log('Waiting...\n'); }

						skipped_seahawks = 0;

					}// end function

				); // end T.post

				prev_targets.push(tweet_id);

			} else {

				if(tweet_logging >= 1){ console.log(the_team+" - We already targeted this user. No Post Made."); }

			}

		} else {

			if(tweet_logging >= 4){ 

				if (skipped_seahawks % 50 == 0) {
					if(skipped_seahawks > 0){
						console.log(the_team+" - Skipping random Post. No Post Made. "+skipped_seahawks+' skipped seahawks posts'.green)
					} else {
						console.log(the_team+" - Skipping random Post. No Post Made.\n");
					}
				}

			}
			
			skipped_seahawks++;

		}

	} else {

		if(tweet_logging >= 4){

			if (skipped_seahawks % 50 == 0) {
				if(skipped_seahawks > 0){
					console.log(the_team+" - Skipping random Post. No Post Made. "+skipped_seahawks+' skipped seahawks posts'.green)
				} else {
					console.log(the_team+" - Skipping random Post No Post Made. \n");
				}
			}
			
		}
		

		firstRunThrough = false;

		skipped_seahawks++;

	}

	

});




/* =- =- =- -= =- =- =- =- =- =- =- =- =- =- =- =- =- =-

	Query Tweets (what to search, how many tweets)

=- =- =- =- =- =- =- =- -==- =- =- =- -= =- =- =- =-*/

var talk_trash = function(the_query, num_tweets){

	firstRunThrough = false;

	var the_team = '#PatriotsNation'.blue;

	/* =- =- =- -= =- =- =- =- =- =- =- =- =- =- =- =- =- =-

		Use the node wrapper to send the request to the twitter api

	=- =- =- =- =- =- =- =- -==- =- =- =- -= =- =- =- =-*/
	T.get("search/tweets", { q: the_query, count: num_tweets }, function(err, data, response) {

		var 	tweets = data.statuses,
				legit_tweets = [];

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

		var limit = legit_tweets.length - 1;

		// target a random tweet from the list of usable tweets
		var victim = legit_tweets[get_rand(limit, 1)],
			victim_name = victim.user.screen_name,
			victim_id = victim.id,
			tweet_bodies = [
				"@"+victim_name+" #LegionofBoom is coming to AZ to destroy you! #patriots!",
				"@"+victim_name+" GOOOO @SEAHAWKS! :) http://bit.ly/1wjWxxP ",
				"@"+victim_name+" Cheaters!! xD GO @Seahawks #deflategate ",
				"@"+victim_name+" We're shutting down #tombrady on Sunday! #LegionOfBoom",
				"#12thMan visits SUPER BOWL XLIX #LEGIONOFBOOM!",
				"@"+victim_name+" - #TomBrady is going DOWN!!! #LEGIONOFBOOM @Seahawks #Seahawks #patriotsnation",
				"@Seattle is coming for you @"+victim_name+"... http://bit.ly/15Vx5nH #LegionOfBoom",
				"I'm seeing a lot of patriots fans here talking trash! @"+victim_name+" & #patriotsnation, we are coming for you! #LegionOfBoom",
				"Less than 24hrs until @SuperBowl XLIX! @Seahawks #LegionOfBoom",
				"Today is the day!! Time to get rowdy",
				"Look out @Patriots OT's, We Coming for ya! #LegionOFBoom @Seahawks #12thMan",
				"@"+victim_name+" I'm looking forward to seeing #BeastMode #24 Running it in the endzone today! @Seahawks #patriotsnation",
				"We're going to eat @RobGronkowski and @"+victim_name+" for breakfast!! @Seahawks #LegionOfBoom #patriotsnation"
			];

		var trash_text = tweet_bodies[get_rand(tweet_bodies.length - 1)];


		/* =- =- =- -= =- =- =- =- =- =- =- =- =- =- =- =- =- =-

			Check if we have replied to this user already

		=- =- =- =- =- =- =- =- -==- =- =- =- -= =- =- =- =-*/
		var has_run = function(){
			prev_targets.forEach(function(index){
				if(prev_targets[index] == victim_id){
					return true;
				}
			});
		}

		/* =- =- =- -= =- =- =- =- =- =- =- =- =- =- =- =- =- =-

			Post The Tweet

		=- =- =- =- =- =- =- =- -==- =- =- =- -= =- =- =- =-*/
		if (has_run != true) {

			if(tweet_logging >= 1){ console.log("\n"+the_team+" - Interval Post - Victim = "+victim_name); }
			if(tweet_logging >= 1){ console.log(the_team+" - Interval Post - Posting Tweet: "+trash_text); }

			// =- =- =- =- =- =- =- =- =-
			//
			//		Fire Away!
			//
			// =- =- =- =- =- =- =- =-
			post_tweet(trash_text,true);

			// add tweet id into an array
			prev_targets.push(victim_id);

		} else {

			if(tweet_logging >= 1){ console.log("We already targeted this user. No Post Made."); }

		}

		return legit_tweets;


	});

}



/* =- =- =- =- =- =- =- =- =-

	Let it ride...

=- =- =-  =- -= =- =- =- -=*/
setInterval(function(){ 

	if(get_rand(100) > 30){	
		talk_trash("#patriotsnation since:2015-1-11", 50);
	} else {
		firstRunThrough = false;
		console.log("#PatriotsNation ".blue+'Interval Post - skipping this round'+' No Posts <30% condition not met\n');
	}

	if(get_rand(100) > 35){
		find_new_user();
	}

	// if(get_rand(100) < 11){
	// 	remove_follower();
	// }

// one hour ~13 minutes
// }, 4500000);

// six minutes
// }, 360000);

// onw minute
}, 60000);

// 40 seconsd
// }, 40000);

var find_new_user = function(){
	//get ids of people I'm following
	T.get('followers/ids', { count: 300 }, function(err, reply) {
	    if(err) { console.error(err); }

	    //select a random follower
	    var follower_ids = reply.ids;
	    var random_number = get_rand(follower_ids.length);
	    var randomFollower = follower_ids[random_number];
	    
	    //find followers of the random follower
	    T.get('friends/ids', { user_id: randomFollower }, function(err, reply) {
	        if(err) {  console.error(err); }

	        var followersFriendsIds = reply.ids;
	        var random_number = get_rand(followersFriendsIds.length, true);
	        var randomFollowersFriend = followersFriendsIds[random_number];
	        
	        //follow random follower
	        T.post('friendships/create', { id: randomFollowersFriend },
	            function (error, response){
	                if(error) console.error(error);
	            }
	        );
	        
	    });

	});
}


var remove_follower = function(){
	T.get('followers/ids', function(err, reply) {
	    if(err) return callback(err);
	    
	    var followers = reply.ids;
	    
	    T.get('friends/ids', function(err, reply) {
	        if(err) return callback(err);
	        
	        var friends = reply.ids
	          , pruned = false;
	        
	        while(!pruned) {
	          var target = get_rand(friends.length - 1);
	          
	          if(!~followers.indexOf(target)) {
	            pruned = true;
	            T.post('friendships/destroy', { id: target }, function(){
	            	console.log("\nFriend removed.\n");
	            });   


	          }
	        }
	    });
	});
}



