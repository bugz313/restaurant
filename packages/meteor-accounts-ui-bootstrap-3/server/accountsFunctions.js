var Fiber = Npm.require('fibers');
var Future = Npm.require('fibers/future');

Meteor.methods({
	checkPassword: function(digest) {
	    check(digest, String);

	    if (this.userId) {
	      var user = Meteor.user();
	      var password = {digest: digest, algorithm: 'sha-256'};
	      var result = Accounts._checkPassword(user, password);
	      return result.error == null;
	    } else {
	      return false;
	    }
	},
	addLog:function(a,b,c){},
	makeAPIKey:function(){
		var d = new Date();
		d=d.getTime();
		var uname = Meteor.users.findOne({_id:this.userId}).username;
		uname = new Buffer(uname).toString('base64');
		uname = uname.replace(/=/g,"");
		uname = uname.slice(0,6);
		token = uname+d.toString(32);

		Meteor.users.update({_id:this.userId}, {$set:{"profile.apiKey":token}});
	},
	buyMembership:function(name, cardNumber, type, cvv, expire_year, expire_month, time){
		var tot = 0;
		if(time == 1) tot = "10.00";
		if(time == 3) tot = "30.00";
		if(time == 12) tot = "120.00";
		var uid = this.userId;
		
		var call_paypal = Async.runSync(function(done) {
			Paypal.purchase({
								name: name,
								number:cardNumber,
								type:type,
								cvv2:cvv,
								expire_year:expire_year,
								expire_month:expire_month
							}, 
							{
								total: tot, 
								currency: 'USD'
							}, 
							function(err, results){
						        if (err){
						        	console.error(err);
						        	done(null, "BAD");
						        }else{
						        	console.log(results);
						        	if(results.success){
						        		var curMembExpire = Meteor.users.findOne({_id:uid});
						        		if(!curMembExpire.profile.membership){
						        			var d = new Date();
						        			d.setMonth(d.getMonth()+time);
						        			Meteor.users.update({_id:uid}, {$set:{"profile.membership":d}})
						        		}else {
						        			var membExp = new Date(curMembExpire.profile.membership);
						        			var d = new Date();
						        			if(d > membExp){
						        				var d = new Date();
							        			d.setMonth(d.getMonth()+time);
							        			Meteor.users.update({_id:uid}, {$set:{"profile.membership":d}})
						        			}else{
						        				membExp.setMonth(membExp.getMonth()+time);
						        				Meteor.users.update({_id:uid}, {$set:{"profile.membership":membExp}})
						        			}
						        		}
										done(null, "GOOD");
						        	}else{
						        		done(null, "BAD");	
						        	}
						        } 
		    				});
	    });
	    return call_paypal.result;
	},
	saveTeapplixInfo:function(account, user, pass){
		var doc = {};
		doc["accountName"] = account;
		doc["user"] = user;
		doc["pass"] = pass;
		doc["uId"] = this.userId;
		TeapplixInfo.insert(doc); 
	}
})

Meteor.startup(function(){
	/*Accounts.validateLoginAttempt(function(info) {
	    var user = info.user;
	    if(user){
	    	if(!user.profile) return true;
	    	if(user.profile.disabled){
		    	console.log("Disabled account");
		    	return false;	
		    } else{
		    	return true;
		    }
	    }else{
	    	return false;
	    }
	});*/
});