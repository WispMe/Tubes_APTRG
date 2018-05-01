var timeoutId;
var airSpeedWidget;
var airSpeedSlider;

var altimeterWidget;
var heightSlider;

var attitudeIndicatorWidget;
var pitchSlider;
var rollSlider;

var headingIndicatorWidget;
var directionSlider;

var turnCoordinatorWidget;
var turnRollSlider;
var slipSlider;

var verticalSpeedIndicatorWidget;
var verticalSpeedSlider;
var timeOutMiliseconds = 1000;

var pitchValue = 0;
var rollValue = 0;

function nextInt(minValue,maxValue){
    return Math.floor((Math.random()*(maxValue-minValue))+minValue);
}

function nextDouble(minValue,maxValue){
    return ((Math.random()*(maxValue-minValue))+minValue);
}
    var altimeterWidget = null;

        $(document).ready(function()

            altimeterWidget = new PerfectWidgets.Widget("altimeter", jsonModel2);
        })
        
function reloadWidget() {
    //widget model
    //initialized in widget_data.js

    //creating widget
    airSpeedWidget = new PerfectWidgets.Widget("airSpeed", jsonModel1);
    altimeterWidget = new PerfectWidgets.Widget("altimeter", jsonModel2);
    attitudeIndicatorWidget = new PerfectWidgets.Widget("attitudeIndicator", jsonModel3);
    headingIndicatorWidget = new PerfectWidgets.Widget("headingIndicator", jsonModel4);
    turnCoordinatorWidget = new PerfectWidgets.Widget("turnCoordinator", jsonModel5);
    verticalSpeedIndicatorWidget = new PerfectWidgets.Widget("verticalSpeedIndicator", jsonModel6);

    window.onresize = function (event){
        airSpeedWidget.rescale();
        altimeterWidget.rescale();
        attitudeIndicatorWidget.rescale();
        headingIndicatorWidget.rescale();
        turnCoordinatorWidget.rescale();
        verticalSpeedIndicatorWidget.rescale();
    }

    grabAttitudeIndicatorSliders();
    grabAltimeterSliders();
    grabAirSpeedWidgetSliders();
    grabHeadingIndicatorSliders();
    grabTurnCoordinatorSliders();
    grabVerticalSpeedSliders();
    timeoutId = window.setTimeout(updateInstruments,timeOutMiliseconds);
}

function grabVerticalSpeedSliders(){
    verticalSpeedSlider = verticalSpeedIndicatorWidget.getByName("Slider2");
    verticalSpeedSlider.configureAnimation({"enabled": true, "ease": "swing", "duration": 20});
    verticalSpeedSlider.addAnimationValueChangedHandler(verticalSpeedChangedHandler);
}

function verticalSpeedChangedHandler(sender, e){
    verticalSpeedIndicatorWidget.getByName("Slider1").recalculate();
}

function grabAltimeterSliders(){
    heightSlider = altimeterWidget.getByName("height");
    heightSlider.configureAnimation({"enabled": true, "ease": "swing", "duration": 500});
    heightSlider.addAnimationValueChangedHandler(heightMovementHandler);
}

function heightMovementHandler(sender, e)
{
        altimeterWidget.getByName("Slider1").recalculate();
        altimeterWidget.getByName("Slider2").recalculate();
}

function grabHeadingIndicatorSliders(){
    directionSlider = headingIndicatorWidget.getByName("Slider1");
    directionSlider.configureAnimation({"enabled": true, "ease": "swing", "duration": 10});
}
      
function grabAttitudeIndicatorSliders(){
    pitch = attitudeIndicatorWidget.getByName("Pitch");
    rollSlider = attitudeIndicatorWidget.getByName("Roll");
    rollSlider.configureAnimation({"enabled": true, "ease": "swing", "duration": 10});
}

function grabTurnCoordinatorSliders(){
    slipSlider = turnCoordinatorWidget.getByName("Slider2");
    turnRollSlider = turnCoordinatorWidget.getByName("Slider1");
    turnRollSlider.configureAnimation({"enabled": true, "ease": "swing", "duration": 2});
}

function grabAirSpeedWidgetSliders(){ 
    airSpeedSlider = airSpeedWidget.getByName("Speed");
    airSpeedSlider.configureAnimation({"enabled": true, "ease": "swing", "duration": 20});
    airSpeedSlider.addAnimationValueChangedHandler(airSpeedMovementHandler);
}
         
function airSpeedMovementHandler(sender, e){
    airSpeedWidget.getByName("Slider2").recalculate();
}        //

function updateInstruments(){
    clearTimeout(timeoutId);
    pitchValue = pitchValue+nextInt(-20,20);
    var newRoll = rollValue+nextInt(-30,30);

    if (Math.abs(newRoll)<90){
       rollValue = newRoll;
    }

    turnRollSlider.setValue(rollValue);           
    rollSlider.setValue(rollValue);
    pitch.setValue(pitchValue);

    heightSlider.setValue(heightSlider.getValue()+nextInt(-500,500));
    directionSlider.setValue(directionSlider.getValue()+nextInt(-90,90));
    airSpeedSlider.setValue(airSpeedSlider.getValue()+nextInt(-20,20));
    slipSlider.setValue(nextInt(-100,100));
    verticalSpeedSlider.setValue(verticalSpeedSlider.getValue()+nextDouble(-1,1))
    timeoutId = window.setTimeout(updateInstruments,timeOutMiliseconds);
}

window.addEventListener('load', function() { reloadWidget(); }, false);