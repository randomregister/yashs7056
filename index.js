const express = require('express')
const app = express()
const port = process.env.PORT||3000 
var firebase = require('firebase')
var morningScheduleTime
var eveningScheduleTime
var device_status
var flag ="false";

var firebaseConfig = {
    apiKey: "AIzaSyDKi09ANqxdxwBgkmocjzNcXkkVjYb3NgQ",
    authDomain: "fano-595d2.firebaseapp.com",
    databaseURL: "https://fano-595d2.firebaseio.com",
    projectId: "fano-595d2/IoTApp",
    storageBucket: "fano-595d2.appspot.com",
    messagingSenderId: "984398842850",
    appId: "1:984398842850:web:2b3c5c160cf4db2c"
  };
  
firebase.initializeApp(firebaseConfig);
app.get('/hello/:time_stamp/:current', (req, res) => {
  console.log("hello from feeder at"+req.params.time_stamp)
  firebase.database().ref('Feeder/online since').set(req.params.current+" "+" -> "+req.params.time_stamp);
  res.send("hello")
})
app.get('/feeded/time/:time_stamp/date/:current/day/:monthDay/month/:monthName/year/:year', (req, res) => {
  console.log("Good Morning Yash, Birds Feeded on "+ " "+req.params.current +" "+ "at" +" "+ req.params.time_stamp);
  firebase.database().ref('Feeder/daily_status/'+req.params.year+'/'+req.params.monthName+'/'+req.params.monthDay).set(true);
  firebase.database().ref('Feeder/schedule/eveningTime').set("No Schedule");

  res.send(" birds feeding done")
})
app.get('/led/:status', (req, res) => {

  res.json({led : req.params.status});
  firebase.database().ref('Feeder/LED').set(req.params.status);

})
app.get('/time', (req, res) => {
  let date_ob = new Date();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let nowTime=hours+":"+minutes;
  res.send(nowTime);
})
app.get('/status', (req, res) => {
  res.send(device_status);
})

app.get('/morning/:morningTime/evening/:eveningTime', (req, res) => {
  res.send("Bird Feeder is scheduled to morning at "+req.params.morningTime+"and Evening at "+req.params.eveningTime);
  firebase.database().ref('Feeder/schedule').set({"morningTime":req.params.morningTime,"eveningTime":req.params.eveningTime});
})
app.get('/delete/:record', (req, res) => {
  res.send("deleted record");
  firebase.database().ref(req.params.record).remove();
})

app.get('/getScheduleTime', (req, res) => {
  firebase.database().ref('Feeder/schedule').on('value',function(snapshot){
   morningScheduleTime=snapshot.val().morningTime;
   eveningScheduleTime=snapshot.val().eveningTime;
  });

  res.json({ morning: morningScheduleTime, evening: eveningScheduleTime });
})

app.get('/logs/:current/:time_stamp/day/:monthDay/month/:monthName/year/:year', (req, res) => {
  res.send(req.params.time_stamp)
  firebase.database().ref('Feeder/logs/'+req.params.year+'/'+req.params.monthName+'/'+req.params.monthDay+'/'+req.params.time_stamp).set("online");
  device_status = "online";
  flag = "true";

})
app.get('/online', (req, res) => {
  res.send("online")
  device_status = "online";
  flag = "true";
 
})
 var my = setInterval(function () {
  if(flag=="false")
  {
  device_status = "offline";
  }
  flag="false";

}, 6000);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})