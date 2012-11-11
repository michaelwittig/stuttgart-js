# Hello Stuttgart.JS!

## JSON-RPC definition

### Types
#### Token
~~~json
{
	type:"facebook",
	value:String
}
~~~
#### Location
~~~json
{
	lng:Float,
	lat:Float
~~~
#### User
~~~json
{
	type:"facebook",
	id:String
~~~
#### Board
~~~json
{
	_id:String,
	title:String,
	loc:Location,
	user:User,
	createdAt:Date,
	expireAt:Date //optional
}
~~~
#### CreateBoard
~~~json
{
	title:String,
	expireIn:Integer, //optional, ignored if <= 0
	loc:Location
}
~~~
#### Message
~~~json
{
	_id:String,
	title:String,
	user:User,
	createdAt:Date
}
~~~

### Demo
#### start
in:
~~~json
{
	method:"demo:start",
	params:[
		loc:Location,
		distance:Float //in miles
	],
	id:String
}
~~~
out:
~~~json
{
	result:true, //null if error !== null
	error:null, //or Error
	id:String
}
~~~

### Board
#### get all
in:
~~~json
{
	method:"board:getall",
	params:[
		loc:Location,
		distance:Float //in miles
	],
	id:String
}
~~~
out:
~~~json
{
	result:[Board], //null if error !== null
	error:null, //or Error
	id:String
}
~~~

#### create
in:
~~~json
{
	method:"board:create",
	params:[
		board:CreateBoard,
		token:Token
	],
	id:String
}
~~~
out:
~~~json
{
	result:Board, //null if error !== null
	error:null, //or Error
	id:String
}
~~~
### Message
#### get all for board
in:
~~~json
{
	method:"message:getall",
	params:[boardId:String],
	id:String
}
~~~
out:
~~~json
{
	result:[Message], //null if error !== null
	error:null, //or Error
	id:String
}
~~~

#### create
in:
~~~json
{
	method:"message:create",
	params:[
		boardId:String,
		message:String,
		token:Token
	],
	id:String
}
~~~
out:
~~~json
{
	result:Message, //null if error !== null
	error:null, //or Error
	id:String
}
~~~

## Deploy instructions

### GitHub — [Team][2], [Repo][3]

~~~sh
git clone git@github.com:nko3/stuttgart-js.git
~~~

### Nodejitsu — [More details][5], [Handbook][4]

~~~sh
npm install -g jitsu
jitsu login --username nko3-stuttgart-js --password 8CQ9bTXCSfIFatSh
jitsu deploy
~~~

## Tips

### Vote KO Widget

![Vote KO widget](http://f.cl.ly/items/1n3g0W0F0G3V0i0d0321/Screen%20Shot%202012-11-04%20at%2010.01.36%20AM.png)

Use our "Vote KO" widget to let from your app directly. Here's the code for
including it in your site:

~~~html
<iframe src="http://nodeknockout.com/iframe/stuttgart-js" frameborder=0 scrolling=no allowtransparency=true width=115 height=25>
</iframe>
~~~

### Tutorials & Free Services

If you're feeling a bit lost about how to get started or what to use, we've
got some [great resources for you](http://nodeknockout.com/resources).

First, we've pulled together a great set of tutorials about some of node's
best and most useful libraries:

* [How to install node and npm](http://blog.nodeknockout.com/post/33857791331/how-to-install-node-npm)
* [Getting started with Express](http://blog.nodeknockout.com/post/34180474119/getting-started-with-express)
* [Real-time communication with Socket.IO](http://blog.nodeknockout.com/post/34243127010/knocking-out-socket-io)
* [Data persistence with Mongoose](http://blog.nodeknockout.com/post/34302423628/getting-started-with-mongoose)
* [OAuth integration using Passport](http://blog.nodeknockout.com/post/34765538605/getting-started-with-passport)
* [Debugging with Node Inspector](http://blog.nodeknockout.com/post/34843655876/debugging-with-node-inspector)
* [and many more](http://nodeknockout.com/resources#tutorials)&hellip;

Also, we've got a bunch of great free services provided by sponsors,
including:

* [MongoLab](http://nodeknockout.com/resources#mongolab) - for Mongo hosting
* [Monitaur](http://nodeknockout.com/resources#monitaur) - for server monitoring
* [Ratchet.io](http://nodeknockout.com/resources#ratchetio) - for exception tracking
* [Teleportd](http://nodeknockout.com/resources#teleportd) - real-time photo streams
* [and more](http://nodeknockout.com/resources#tutorials)&hellip;

## Have fun!

If you have any issues, we're on IRC in #nodeknockout and #nodejitsu on
freenode, email us at <all@nodeknockout.com>, or tweet
[@node_knockout](https://twitter.com/node_knockout).

[2]: https://github.com/organizations/nko3/teams/280710
[3]: https://github.com/nko3/stuttgart-js
[4]: http://handbook.jit.su
[5]: http://blog.nodeknockout.com/post/35279199042/introduction-to-jitsu-deployment
