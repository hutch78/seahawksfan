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
	skip_threshold = 600,
	num_shit_talked = 0,
	refollow_object = {};

function get_rand(the_integer, include_zero){
	if(include_zero){

		var the_rand = Math.floor((Math.random() * the_integer));
		// console.log('\n'+the_rand+'\n');
		return the_rand;

	} else {
		return Math.floor((Math.random() * the_integer) + 1);
	}
}

function randIndex (arr) {
  var index = Math.floor(arr.length*Math.random());
  return arr[index];
};

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

	if(get_rand(100) > 98 || skipped_seahawks == skip_threshold){	// 5% of the time or 200 skips

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

				seahawks_stream.stop();

				// =- =- =- =- =- =- =- =- =- =- =- =- =- =- -= =- =- =- =- =- =- =- =-
				//
				//		Retweet Seahawks Fan tweet, and attempt to favorite it
				//
				// =- =- =- =- =- =- =- =-=- =- =- =- =- =- =- =- =- =- =- =- =- =-
			    T.post('statuses/retweet/:id', { id: tweet_id_str }, 
			    	function(err, data, res){

					    if(err){
					    	console.error(err);
					    	seahawks_stream.start();

					    	var rt_error = '1';

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

					    			    	var rt_error = '2';

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

					    if(!rt_error){
					    	start_pats_stream();
					    }

						skipped_seahawks = 0;

					}// end function

				); // end T.post

				prev_targets.push(tweet_id);

			} else {

				if(tweet_logging >= 1){ console.log(tweet_count+". "+the_team+" - We already targeted this user. No Post Made."); }

			}

		} else {

			if(tweet_logging >= 4){ 

				if (skipped_seahawks % 50 == 0) {
					if(skipped_seahawks > 0){
						console.log(tweet_count+". "+the_team+" - Skipping random Post. No Post Made. "+skipped_seahawks+' skipped seahawks posts'.green)
					} else {
						console.log(tweet_count+". "+the_team+" - Skipping random Post. No Post Made.\n");
					}
				}

			}
			
			skipped_seahawks++;

		}

	} else {

		if(tweet_logging >= 4){

			if (skipped_seahawks % 50 == 0) {
				if(skipped_seahawks > 0){
					console.log(tweet_count+". "+the_team+" - Skipping random Post. No Post Made. "+skipped_seahawks+' skipped seahawks posts'.green)
				} else {
					console.log(tweet_count+". "+the_team+" - Skipping random Post No Post Made. \n");
				}
			}	
		}	

		firstRunThrough = false;

		skipped_seahawks++;

	}

});

// =- =- =- =- -= =- =- =- =- =- =- =-
//
//		Reply to new folowers, refollow them
//
// =- =- =- =- =- =- =- =- 

function reply_to_followers(){

	console.log('\nChecking for new followers...\n');

	var found = 0,
		refollow_list = [];

	// People who follow me
	T.get('followers/ids', function(err, reply) {
	    if(err) return function(err){
	    	console.log(err);
	    }
	    
	    var followers = reply.ids;
	    
	    // People who i follow
	    T.get('friends/ids', function(err, reply) {
	        if(err) return function(err){
	        	console.log(err);
	        }
	        
	        var friends = reply.ids,
	        	followed = true,
	        	i = 0,
	        	found = false,
	        	count = 0,
        		length = followers.length,
				target_id_str = '',
       			target_screen_name = '',
       			trigger_refollow = false;

		    for(var k = 0; k < length; k++){

		       	var target_id_str = followers[count]

		       	T.get('friendships/show', { target_id: target_id_str }, function(err, data){
		       		if(err){
		       			console.log(err);
		       		} else {
		       			found = true;
		       		}

		       		if(data.relationship.source.following == false){
		       			found = true;
		       			trigger_refollow = true;

		       			console.log('\n\nFound Unfollowed Follower\n\n');

						target_id_str = data.relationship.target.id_str,
		       			target_screen_name = data.relationship.target.screen_name;

		       			refollow_object = {
		       				id_str: data.relationship.target.id_str,
		       				screen_name: data.relationship.target.screen_name
		       			};


		       			setTimeout(function() {
			       			//follow a follower
			       			T.post('friendships/create', { id: refollow_object.id_str },
			       			    function (error, response){
			       			        if(error) {
			       			        	console.error(error) 
			       			        } else {
			       			        	console.log('\nNew Friend Added! :)\n');
			       			        }
			       			    }
			       			);		       				
		       			}, get_rand(10)*1000);

		       			var refollow_text = "Thanks for the follow @"+refollow_object.screen_name+" GO @Seahawks #LegionOfBoom";

		       			setTimeout(function() {
		       				post_tweet(refollow_text,null,null);
		       			}, get_rand(10)*1000);

		       		}; 

		       	}); // end T.get

		       	count++;

		    } // endfor

	    });  // end T.get
	
	}); // end T.get
};


function start_pats_stream(){

	// /* =- =- =- -= =- =- =- =- =- =- =- =- =- =- =- =- =- =- =- =- =- =-
	//
	// 	Start the Patritos Tweet Stream.. Listen for #PatriotNation
	//
	// =- =- =- =- =- =- =- =- -==- =- =- =- -= =- =- =- =- =-= - =- =- =- -=*/
	var pats_stream = T.stream('statuses/filter', { track: '#patriotsnation', language: 'en' });

	var skipped_patriots = 0;

	pats_stream.on('tweet', function (tweet) {

		// console.log(tweet.text);

		var the_team = '#PatriotsNation'.blue;

		tweet_count++;

		if(get_rand(100) > 98 || skipped_patriots == skip_threshold){	// 5% of the time or 200 skips

			if(skipped_patriots == skip_threshold){
				skipped_patriots = 0;
			}

			// spam filter
			has_link = tweet.text.indexOf("http"),
			has_mention = tweet.text.indexOf("@"),
			has_rt = tweet.text.indexOf("RT");

			var has_run = function(){
				prev_targets.forEach(function(tweet){
					if(prev_targets[tweet] == victim_id){
						return true;
					}
				});
			}

			if(has_link == -1 && has_rt == -1 && has_mention == -1){
				var victim = tweet,
					victim_name = victim.user.screen_name,
					// victim_name = "Patriots",
					victim_id = victim.id,
					tweet_bodies = [
						"@"+victim_name+" #LegionofBoom is coming to AZ to destroy you! #patriots!",
						"@"+victim_name+" GOOOO @SEAHAWKS! :) #LEGIONOFBOOM #patriotsnation",
						"@"+victim_name+" Cheaters!! xD GO @Seahawks #deflategate #LEGIONOFBOOM",
						"Today we shut down #TomBrady!!!!! #LegionOfBoom @"+victim_name,
						"@"+victim_name+" - #TomBrady is going DOWN!!! #LEGIONOFBOOM @Seahawks #Seahawks #patriotsnation",
						"@Seattle is coming for you @"+victim_name+"... http://bit.ly/15Vx5nH #LegionOfBoom",
						"I'm seeing a lot of patriots fans here talking trash! @"+victim_name+" & #patriotsnation, we are coming for you! #LegionOfBoom"
					];

				var trash_text = tweet_bodies[get_rand(tweet_bodies.length - 1)];

				/* =- =- =- -= =- =- =- =- =- =- =- =- =- =- =- =- =- =-

					Post The Tweet

				=- =- =- =- =- =- =- =- -==- =- =- =- -= =- =- =- =-*/
				if (has_run != true) {


					if (num_shit_talked == 3) {
						pats_stream.stop();
					} else {
						num_shit_talked++;
					}

					console.log('\nWe caught a live one!\n');

					// =- =- =- =- =- =- =- =- =-
					//
					//		Fire Away!
					//
					// =- =- =- =- =- =- =- =-
					post_tweet(trash_text,true, 1);

					if (num_shit_talked == 3) {
						seahawks_stream.start();
						num_shit_talked = 0;
					} 

					skipped_patriots = 0;

					prev_targets.push(victim_id);

					if(tweet_logging >= 1){ console.log(tweet_count+". "+the_team+" - Victim = "+victim_name+", tweet = "+trash_text+"\n\n"); }

				} else {

					if(tweet_logging >= 1){ console.log(tweet_count+". "+the_team+" - We already targeted this user. No Post Made."); }

				}
			} else {

				if(tweet_logging >= 4){ 
					
					if (skipped_patriots % 50 == 0) {
						if(skipped_patriots > 0){
							console.log(tweet_count+". "+the_team+" - Skipping random Post. No Post Made. "+skipped_patriots+' skipped patriots posts'.blue)
						} else {
							console.log(tweet_count+". "+the_team+" - Skipping random Post No Post Made. ");
						}
					}
					
				}
				
				skipped_patriots++;


			}


		} else {

			if (skipped_patriots % 50 == 0) {
				if(skipped_patriots > 0){
					console.log(tweet_count+". "+the_team+" - Skipping random Post. No Post Made. "+skipped_patriots+' skipped patriots posts'.blue)
				} else {
					console.log(tweet_count+". "+the_team+" - Skipping random Post No Post Made. ");
				}
			}

			skipped_patriots++;

			firstRunThrough = false;

		}

		

	});


}




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

		var limit = legit_tweets.length - 1,
			key = get_rand(limit, 1);

		// console.log('\nLimit legit_tweets = '+limit+', Random key of legit_tweet = '+key+'\n '); 

		// target a random tweet from the list of usable tweets
		var victim = legit_tweets[key],
			victim_name = victim.user.screen_name,
			victim_id = victim.id,
			tweet_bodies = [
				"@"+victim_name+" #LegionofBoom is coming to AZ to destroy you! #patriots!",
				"@"+victim_name+" GOOOO @SEAHAWKS! :) #LEGIONOFBOOM #patriotsnation",
				"@"+victim_name+" Cheaters!! xD GO @Seahawks #deflategate ",
				"@"+victim_name+" We're shutting down #tombrady tonight #FOSHO! #LegionOfBoom",
				"#12thMan is all over #SUPERBOWLXLIX #LEGIONOFBOOM!",
				"@"+victim_name+" - #TomBrady is going DOWN!!! #LEGIONOFBOOM @Seahawks #Seahawks #patriotsnation",
				"@Seattle is coming for you @"+victim_name+"... #LegionOfBoom",
				"I'm seeing a lot of patriots fans here talking trash! @"+victim_name+" & #patriotsnation, we are coming for you! #LegionOfBoom",
				"Less than 12 Hours until @SuperBowlXLIX! @Seahawks #LegionOfBoom",
				"Today is the day!! Time to get rowdy",
				"Look out @Patriots OT's, We Coming for ya! #LegionOFBoom @Seahawks #12thMan",
				"@"+victim_name+" I'm looking forward to seeing #BeastMode #24 Running it in the endzone today! @Seahawks #patriotsnation",
				"We're going to eat @RobGronkowski and @"+victim_name+" for breakfast!! @Seahawks #LegionOfBoom #patriotsnation"
			];
		var replies_limit = tweet_bodies.length - 1,
			replies_key = get_rand(replies_limit, 1);

			// console.log('\nLimit replies = '+replies_limit+', Random key of repkies = '+replies_key+'\n '); 

		var trash_text = tweet_bodies[replies_key];


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

			if(tweet_logging >= 1){ console.log("\n"+tweet_count+". "+the_team+" - Interval Post - Victim = "+victim_name); }
			if(tweet_logging >= 1){ console.log(tweet_count+". "+the_team+" - Interval Post - Posting Tweet: "+trash_text); }

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

reply_to_followers();

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

	if(get_rand(100) < 35){
		reply_to_followers();
	}

	// if(get_rand(100) < 11){
	// 	remove_follower();
	// }

// one hour ~13 minutes
// }, 4500000);

// six minutes
}, 360000);

// onw minute
// }, 60000);

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


// var remove_follower = function(){
// 	T.get('followers/ids', function(err, reply) {
// 	    if(err) return callback(err);
	    
// 	    var followers = reply.ids;
	    
// 	    T.get('friends/ids', function(err, reply) {
// 	        if(err) return callback(err);
	        
// 	        var friends = reply.ids
// 	          , pruned = false;
	        
// 	        while(!pruned) {
// 	          var target = get_rand(friends.length - 1);
	          
// 	          if(!~followers.indexOf(target)) {
// 	            pruned = true;
// 	            T.post('friendships/destroy', { id: target }, function(){
// 	            	console.log("\nFriend removed.\n");
// 	            });   


// 	          }
// 	        }
// 	    });
// 	});
// }



