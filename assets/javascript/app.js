var config = {
    apiKey: "AIzaSyCIgu5PS4P0Yss7R4Tujqovo7PoSvkY380",
    authDomain: "t-scheduler.firebaseapp.com",
    databaseURL: "https://t-scheduler.firebaseio.com",
    projectId: "t-scheduler",
    storageBucket: "t-scheduler.appspot.com",
    messagingSenderId: "763192430008",
    appId: "1:763192430008:web:886fc36c00fcf1a4ee934d"
      };
    
      firebase.initializeApp(config);
    
    var dataRef = firebase.database();
    
    $("#add-train").on("click", function(event) {
      event.preventDefault();

      var trainName = $("#train-input")
      .val()
      .trim();
    var destination = $("#destination-input")
      .val()
      .trim();
    var firstTrain = $("#first-input")
      .val()
      .trim();
    var frequency = $("#frequency-input")
      .val()
      .trim();
  
    
      var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
      };

      dataRef.ref().push(newTrain);

      alert("Train added to the schedule!") 

      $("#train-input").val("")
      $("#destination-input").val("")
      $("#first-input").val("")
      $("#frequency-input").val("")

    });

  dataRef.ref().on("child_added", function(childSnapshot, prevChildKey) {
      console.log(childSnapshot.val());
    
      var tName = childSnapshot.val().name;
      var tDestination = childSnapshot.val().destination;
      var tFrequency = childSnapshot.val().frequency;
      var tFirstTrain = childSnapshot.val().firstTrain;
    
      var timeArr = tFirstTrain.split(":");
      var trainTime = moment()
        .hours(timeArr[0])
        .minutes(timeArr[1]);
      var maxMoment = moment.max(moment(), trainTime);
      var tMinutes;
      var tArrival;
      if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
      } else {
        var differenceTimes = moment().diff(trainTime, "minutes");
        var tRemainder = differenceTimes % tFrequency;
        tMinutes = tFrequency - tRemainder;
    
        tArrival = moment()
          .add(tMinutes, "m")
          .format("hh:mm A");
      }
      console.log("tMinutes:", tMinutes);
      console.log("tArrival:", tArrival);
    

  $("#train-table > tbody").append(
    $("<tr>").append(
      $("<td>").text(tName),
      $("<td>").text(tDestination),
      $("<td>").text(tFrequency),
      $("<td>").text(tArrival),
      $("<td>").text(tMinutes)
    )
  );
});