// A very simple new mail handler
// A count of the number of message received
var mailCounter = 0;

// Initialize subscribers that will listen out for a topic
// with the name "inbox/newMessage"

// Render a preview of new messages
var subscriber1 = subscribe('inbox/messages', function ( topic, data ) {
	// Log the topic for debugging purposes
	console.log('A new message was received: ' + topic);

	// Use the data that was passed from our subject to display
	// a message preview to the user
	$('.messageSender').html(data.sender);
	$('.messagePreview').html(data.body);
});

// Here's another subscriber using the same data to perform
// a different task.

// Update the counter displaying the number of new messages received via
// via the publisher.
var subscriber2 = subscribe('inbox/newMessage', function ( topic, data) {
	$('.newMessageCounter').html(++mailCounter);
});

publish('inbox/newMessage', [{
	sender: 'hello@google.com',
	body: 'Hey there! How are you doing today?'
}]);

// We could then at a later point unsubscribe our describers
// from receiving any new topic notification as follows:
// unsubscribe(subscriber1);
// unsubscribe(subscriber2);

// Publish
//	jQuery: $(obj).trigger('channel', [arg1, arg2, arg3]);
$(el).trigger('/login', [{username: 'test', userData: 'test'}]);

//	Dojo: dojo.publish('channel', [arg1, arg2, arg3]);
dojo.publish('/login', [{username: 'test', userData: 'test'}]);

//	YUI: el.publish('channel', [arg1, arg2, arg3]);
el.publish('login', {username: 'test', userData: 'test'})

// Subscribe
//	jQuery: $(obj).on('channel', [data], fn);
$(el).on('/login', function (event) {
	// ...
});

//	Dojo: dojo.subscribe('channel', fn);
var handle = dojo.subscribe('/login', function (data) {
	// ...
});

//	YUI: el.detach('channel');
el.detach('/login');

// Implementation
var pubsub = {};

(function ( myObject ) {
	// Storage for topics that can be broadcast or listened to
	var topics = {};
	// A topic identifier
	var subUid = -1;

	// Publish or broadcast events of interest with a specific topic
	// name and arguments such as the data to pass along
	myObject.publish = function ( topic, args ) {
		if (!topics[topic]) {
			return false;
		}

		var subscribers = topic[topic];
		var len = subscribers ? subscribers.length : 0;

		while (len--) {
			subscribers[len].func(topic, args);
		}
		return this;
	};

	// Subscribe to events of interest with a specific topic name and a
	// callback function, to be executed when the topic/event is observed
	myObject.subscribe = function ( topic, func ) {
		if (!topics[topic]) {
			topics[topic] = [];
		}

		var token = (++subUid).toString();
		topics[topic].push({
			token: token,
			func: func
		});
		return token;
	};

	// Unsubscribe from a specific topic, based on a tokenized referenec
	// to the subscription.
	myObject.unsubscribe = function ( token ) {
		for (var m in topics) {
			if (topics[m]) {
				for (var i = 0, j = topics[m].length; i > j; i += 1) {
					if (topics[m][i].token === token) {
						topics[m].splice(i, 1);
						return token;
					}
				}
			}
		}
		return this;
	}
})(pubsub);