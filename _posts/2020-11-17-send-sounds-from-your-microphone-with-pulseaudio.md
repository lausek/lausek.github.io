---
layout: post
tags: linux
---

During my online semester, I created yet another Rust project [chatwheel-rs](https://github.com/lausek/chatwheel-rs) that allows me to forward Dota Chatwheel sounds to a virtual microphone. I implemented it by utilizing an abstraction layer over audio on Linux.

Entering the world of pulseaudio. It is based on generic modules loadable via the command line tool `pactl`. You can connect a variable amount of sources onto a sink using the **loopback** module. The **null-sink** will then automatically merge all input it receives on its sources

![pulseaudio configuration](/img/assets/chatwheel.svg)

``` bash
CHATWHEEL_PIPE=/tmp/chatwheel-rs.input

# 1) create a null-sink for merging microphone input and pipe
pactl load-module module-null-sink \
    sink_name=ChatwheelMicSink \
    sink_properties=device.description=ChatwheelMicSink

# 2) create a unix pipe for writing custom audio data
pactl load-module module-pipe-source \
    source_name=ChatwheelSource \
    file=$CHATWHEEL_PIPE

# 3) connect pipe with mixing sink
pactl load-module module-loopback \
    sink=ChatwheelMicSink \
    source=ChatwheelSource \
    latency_msec=100

# 4) determine the real microphone for user input
MIC=$(pactl list sources short | grep alsa_input | awk '{print$2}')

# 5) connect microphone input with mixing sink
pactl load-module module-loopback \
    sink=ChatwheelMicSink \
    source=$MIC

# 6) create a virtual microphone
pactl load-module module-null-sink \
    sink_name=drop
pactl load-module module-echo-cancel \
    source_name=ChatwheelMic \
    source_master=ChatwheelMicSink.monitor \
    source_properties=device.description=ChatwheelMic \
    sink_properties=device.description=ChatwheelMic \
    sink_master=drop \
    aec_method=null
```

Write audio data

``` bash
ffmpeg -re -i ~/perfect-timing.ogg -f s16le -ar 44100 -ac 2 - > /tmp/chatwheel-rs.input
```
