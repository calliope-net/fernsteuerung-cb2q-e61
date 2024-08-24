function Strecken () {
    cb2.fahreStrecke(192, 31, 40)
    cb2.fahreStrecke(64, 31, 40)
    cb2.fahreStrecke(255, 16, 20)
    cb2.fahreStrecke(192, 2, 150)
    cb2.fahreStrecke(192, 30, 150)
    cb2.fahreStrecke(1, 16, 20)
}
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    Ultraschall_Sensor_Knopf_A = !(Ultraschall_Sensor_Knopf_A)
    btf.set_timeoutDisbled(Ultraschall_Sensor_Knopf_A)
})
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    Strecken()
})
cb2.onAbstandEvent(function (abstand_Sensor, abstand_Stop, cm) {
    cb2.buffer_Hindernis_ausweichen(btf.btf_receivedBuffer19(), abstand_Stop)
    cb2.event_Hindernis_ausweichen(
    Ultraschall_Sensor_Knopf_A && !(Spur_Sensor_Knopf_B),
    abstand_Stop,
    255,
    16,
    64,
    0,
    randint(5, 20)
    )
    if (abstand_Stop) {
        cb2.writecb2RgbLed(cb2.eRgbLed.lh, 0xff0000, true)
    } else {
        cb2.writecb2RgbLed(cb2.eRgbLed.lh, 0xffff00, abstand_Sensor)
    }
})
function Fahrplan () {
    cb2.fahrplanBuffer5Strecken(btf.btf_receivedBuffer19(), btf.e3aktiviert.m1)
}
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    Spur_Sensor_Knopf_B = !(Spur_Sensor_Knopf_B)
    Ultraschall_Sensor_Knopf_A = Spur_Sensor_Knopf_B
    btf.set_timeoutDisbled(Spur_Sensor_Knopf_B)
})
input.onButtonEvent(Button.B, btf.buttonEventValue(ButtonEvent.Hold), function () {
    btf.buttonBhold()
})
btf.onReceivedDataChanged(function (receivedData, changed) {
    if (changed) {
        cb2.writeMotorenStop()
        cb2.writecb2RgbLeds(0x000000, false)
    }
    Ultraschall_Sensor_Knopf_A = false
    Spur_Sensor_Knopf_B = false
    cb2.fahreJoystick(receivedData, 50)
    Fahrplan()
    btf.setLedColors(btf.btf_RgbLed(btf.eRgbLed.a), 0x0000ff, true, true)
    btf.zeige5x5Buffer(receivedData)
    btf.zeige5x5Joystick(receivedData)
    pins.pinDigitalWrite(pins.pins_eDigitalPins(pins.eDigitalPins.C16), !(btf.getSchalter(receivedData, btf.e0Schalter.b0)))
})
function Konfiguration () {
    btf.comment(btf.btf_text("GitHub: calliope-net/fernsteuerung-cb2-e61"))
    btf.comment(btf.btf_text("Erweiterung: calliope-net/fernsteuerung"))
    btf.comment(btf.btf_text(",\"yotta\":{\"config\":{\"microbit-dal\":{\"bluetooth\":{\"pairing_mode\":1,\"partial_flashing\":0}}}}"))
}
cb2.onSpurEvent(function (links_hell, rechts_hell, abstand_Stop) {
    cb2.buffer_Spur_folgen(btf.btf_receivedBuffer19(), links_hell, rechts_hell, abstand_Stop)
    cb2.event_Spur_folgen(
    Spur_Sensor_Knopf_B,
    links_hell,
    rechts_hell,
    192,
    160,
    31,
    0,
    abstand_Stop,
    cb2.cb2_zehntelsekunden(btf.ePause.s1)
    )
})
input.onButtonEvent(Button.A, btf.buttonEventValue(ButtonEvent.Hold), function () {
    btf.buttonAhold()
})
let Spur_Sensor_Knopf_B = false
let Ultraschall_Sensor_Knopf_A = false
cb2.beimStart()
btf.zeigeBIN(cb2.readVersionArray()[1], btf.ePlot.bin, 2)
btf.zeigeBIN(cb2.readSpannung(), btf.ePlot.bcd, 4)
basic.forever(function () {
    cb2.raiseBufferEvents(btf.btf_receivedBuffer19())
    cb2.raiseAbstandEvent(Ultraschall_Sensor_Knopf_A, 30, 35)
    cb2.raiseSpurEvent(Spur_Sensor_Knopf_B)
})
loops.everyInterval(700, function () {
    if (btf.timeout(30000, true)) {
        cb2.writeMotorenStop()
        control.reset()
    } else if (btf.timeout(1000)) {
        btf.setLedColors(btf.btf_RgbLed(btf.eRgbLed.a), 0xff0000, true, true)
        cb2.writeMotorenStop()
        cb2.writecb2RgbLeds(0x000000, false)
    } else if (btf.timeout(1000, true)) {
        btf.setLedColors(btf.btf_RgbLed(btf.eRgbLed.a), 0x00ff00)
    }
})
