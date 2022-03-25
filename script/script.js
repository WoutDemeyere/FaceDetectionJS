let eventt = 'message_test'

let i = 0;

function spew(err, line) {
    console.log(err + " " + line)
    document.querySelector('.js-err').innerHTML = err + " " + line;
}

/*  
    ------------  
    Functies die de android app kan oproepen in Javascript
    ------------    
*/

function onBeWithMeStatus(status){
    console.log(status)
    //document.getElementById("inputField").value = status;
    document.querySelector('.js-inf').innerHTML = status;
}

function onGoToLocationStatusChanged(location, status, id, desc) {
    console.log(`location: ${location}, status: ${status}, id: ${id},  desc: ${desc}`)
}

function onBatteryLevelChanged(status) {
    console.log("Battery level: " + String(status));
    document.querySelector('.js-bat').innerHTML = `Battery level: ${status}`;
}

function onBatteryChargingChanged(status) {
    console.log("Battery charging: " + String(status));
}

function onLoadMapStatusChanged(status) {
    console.log("Map load status: " + String(status));
}

function onMovementVelocityChanged(velocity) {
    console.log("Robot moved with velocity: " + String(velocity));    
}

function OnUserInteractionChanged(status) {
    console.log("User interaction: " + String(status));
}

function onDetectionStateChanged(status) {
    console.log("User detected: " + String(status));
}

function onDetectionDataChanged(angle, distance, isdetected) {
    console.log(`User detection at ${angle} deg ${distance}m`);
}

function onRobotLifted(status, reason) {
    console.log(`RobotRobot lifted status ${status} with reason ${reason}`);
}

function onWakeupWord(word, angle) {
    console.log(`Wakeup word: ${word} at ${angle} deg`);
}

function onTelepresenceEventChanged(sessionID, type, status) {
    console.log(`Call event: type ${type} status ${status} deg`);
}

/*  
    ------------  
    Functies die Javascript kan triggeren bij de android app

    Normaal gezien is het "Android" object standaard aanwezig
    ------------    
*/


function readButtons() {

    up.addEventListener("click", function () {
        Android.tiltBy(30);
    })

    down.addEventListener("click", function () {
        Android.tiltBy(-30);
    })

    turn.addEventListener("click", function () {
        Android.turnBy(45);
    })

    forward.addEventListener("click", function () {

        for (let i = 0; i < 1000; i++) {
            setTimeout(function () {
                Android.moveRobot(1, 0);
            }, 500);
        }

    })

    backward.addEventListener("click", function () {

        for (let i = 0; i < 1000; i++) {
            setTimeout(function () {
                Android.moveRobot(-1, 0);
            }, 500);
        }

    })

    send.addEventListener("click", function () {
        Android.robotSpeak(speak.value);
    })

    getloc.addEventListener("click", function () {
        let locations = Android.getLocations();
        console.log(locations)
        info.innerHTML = locations;

    })

    getMap.addEventListener("click", function () {
        let maps = Android.getMaps();
        console.log(maps);
        info.innerHTML = maps;

    })

    goto.addEventListener("click", function () {
        Android.goTo(loc.value);
    })

    test.addEventListener("click", function () {
        Android.testWS();
        console.log("Test button");
    })

    refresh.addEventListener("click", function () {
        location.reload();
    })

    document.querySelector('.js-q-app').addEventListener("click", function () {
        //Android.exitApp();
        Android.quitApp();
    });

    document.querySelector('.js-q-web').addEventListener("click", function () {
        Android.stopWebApp();
    });

    document.querySelector('.js-show-top').addEventListener("click", function () {
        Android.showTopBar();
    });

    document.querySelector('.js-hide-top').addEventListener("click", function () {
        Android.hideTopBar();
    });

    document.querySelector('.js-kiosk-on').addEventListener("click", function () {
        var val = Android.startKioskMode();
        document.querySelector('.js-inf').innerHTML = val;
    });

    document.querySelector('.js-kiosk-off').addEventListener("click", function () {
        var val = Android.stopKioskMode();
        document.querySelector('.js-inf').innerHTML = val;
    });

    document.querySelector('.js-kiosk-get').addEventListener("click", function () {
        var val = Android.isKioskModeOn();
        console.log("kiosk mode " + val)
        document.querySelector('.js-inf').innerHTML = val;
    });

    document.querySelector('.js-get-bat').addEventListener("click", function () {
        var val = Android.getBatteryLevel();
        document.querySelector('.js-bat').innerHTML = `Battery level: ${val}`;
    });

    document.querySelector('.js-shutdown').addEventListener("click", function () {
        Android.shutdown();
    });

    document.querySelector('.js-restart').addEventListener("click", function () {
        Android.restart();
    });

    document.querySelector('.js-cpu').addEventListener("click", function () {
        Android.getCpuTotal();
    });

    document.querySelector('.js-cont').addEventListener("click", function () {
        var obj = new JSONObject(Android.getContacts());
        console.log(obj);
    });
}




function getButtons() {

    try {
        forward = document.querySelector('.js-for');
        backward = document.querySelector('.js-back');
        up = document.querySelector('.js-up');
        down = document.querySelector('.js-down');
        turn = document.querySelector('.js-turn');
        error = document.querySelector('.js-err');
        info = document.querySelector('.js-inf');
        refresh = document.querySelector('.js-ref');
        send = document.querySelector('.js-send');
        speak = document.querySelector('.js-text');
        getloc = document.querySelector('.js-get-loc');
        getMap = document.querySelector('.js-get-map');
        goto = document.querySelector('.js-send-loc');
        loc = document.querySelector('.js-loc');
        test = document.querySelector('.js-test');
    } catch (e) {
        spew(e)
    }

}

document.addEventListener("DOMContentLoaded", function () {
    window["Android"].tiltBy(0);
    getButtons();
    readButtons();
})