// ⭐️ TO-DO: 1 ⭐️
// Import Dependencies

const mongo = require('mongodb').MongoClient;
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http)

// ⭐️ TO-DO: 2 ⭐️
//Handle our HTML pages and use Port 3000

app.get('/', function(req, res){
  res.sendFile(__dirname + '/home.html');
});

app.get('/chat.html', function(req, res){
  res.sendFile(__dirname + '/chat.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

// ⭐️ TO-DO 3 ⭐️
//get our Connection String from MongoDB Atlas

const uri = 'mongodb+srv://admin:admin123@coding2-pwvhe.gcp.mongodb.net/test?retryWrites=true'


//Connect to MongoDB

mongo.connect(uri, { useNewUrlParser: true }, function(err, client){

  // ⭐️ TO-DO 4 ⭐️
  //Let's log a message to the terminal if MongoDB successfully connects of has an error

  if(err) {

    // 1. ERROR: Log an Error Message to the console in here
    console.log("Error Occured", err)

  } else {

    // 2. SUCCESS: Log a Success Message here
    console.log("Connection Successful")

  }


  // ⭐️ TO-DO 8 ⭐️
  //Connect to our database
const db = client.db('marker-messenger');


  //Connect to Socket.io

  io.on('connection', function(socket){

    // ⭐️ TO-DO 9 ⭐️
    //Variable to select collection
    const chat = db.collection('messages');

    // ⭐️ TO-DO 10 ⭐️
    //Handle the user inputing events

    socket.on('input', function(data){

      console.log(data)

      let message = data.message
      let name = data.name

      db.collection('messages').insertOne({
        name: name,
        message: message
      });

    });

    // ⭐️ TO-DO 11 ⭐️
    // Get the existing messages from the collection
    chat.find().toArray(function(err, messagesArray){
      console.log(messagesArray)

      if(err){
        console.log('There was an error retrieving messages \n', err)
      } else {

      socket.emit('output', messagesArray);

      }
    });

    socket.on('output', function(messagesArray){

    console.log(messagesArray);

    for(let i = 0; i < messagesArray.length; i++){

      var message = document.createElement('div');
      message.textContext = messagesArray[i].name + ": "  + messagesArray[i].message;
      messages.appendChild(message);
    }



});


    });
  });
